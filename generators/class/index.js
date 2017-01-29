'use strict';

const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.option('name', {
      desc: 'the name, in Pascal case (aka- UpperCamelCase), to give the newly created Class',
      type: String,
      alias: 'n'
    });
    if (this.options.name) {
      this.name = this.options.name;
    }

    this.option('visibility', {
      desc: 'the name to give the newly created XPage',
      type: String,
      alias: 'v'
    });
    if (this.options.visibility) {
      this.visibility = this.options.visibility;
    }

    this.option('serializable', {
      desc: 'makes the class implement Serializable',
      type: Boolean,
      alias: 's'
    });
    if (this.options.serializable) {
      this.serializable = this.options.serializable;
    }
  }

  prompting() {
    updateNotifier({pkg}).notify();
    const ctx = this;
    const prompts = [
      {
        name: 'name',
        message: 'Name of the class in Pascal case (aka- UpperCamelCase)',
        required: true,
        type: String,
        when: function () {
          return undefined === ctx.name;
        }
      },
      {
        name: 'visibility',
        message: `Specify the class visibility
          ref: https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html`,
        type: 'list',
        choices: [
          {
            name: 'public',
            value: 'public'
          },
          {
            name: 'protected',
            value: 'protected'
          },
          {
            name: 'no modifier (will just be "class")',
            value: ''
          },
          {
            name: 'private',
            value: 'private'
          }
        ],
        default: 'public',
        when: function () {
          return undefined === ctx.visibility;
        }
      },
      {
        name: 'serializable',
        message: 'Whether this class implements java.io.Serializable',
        required: true,
        type: 'confirm',
        default: false,
        when: function () {
          return undefined === ctx.serializable;
        }
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  // Writing Logic
  writing() {
    const odpPath = this.config.get('odpPath') || 'ODP';
    // Copy the configuration files
    const vis = this.visibility || this.props.visibility;
    const serialize = this.serializable || this.props.serializable;
    const rawName = this.name || this.props.name;
    const parts = rawName.split('.');
    const name = parts.pop();

    this.props = this.config.getAll();
    this.props.package = parts.join('.');
    this.props.dir = parts.join('/');
    this.props.name = name;
    this.props.vis = vis;

    const namespace = (this.props.namespace || '').replace(/\./g, '/');

    this.fs.copyTpl(
      this.templatePath('Class.java'),
      this.destinationPath(path.join(odpPath + '/Code/Java', namespace, this.props.dir, name + '.java')), {
        package: this.props.package,
        namespace: namespace,
        visibility: vis,
        name: rawName,
        serializable: serialize
      }
    );

    this.log(yosay(chalk.red('Done') + ` creating the ${rawName} Class.`));
  }
};
