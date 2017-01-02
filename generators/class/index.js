'use strict';

const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

module.exports = class extends Generator {
  prompting() {
    updateNotifier({pkg}).notify();
    var prompts = [
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
        default: 'public'
      },
      {
        name: 'name',
        message: 'Name of the class in Pascal case (aka- UpperCamelCase)',
        required: true,
        type: String
      },
      {
        name: 'serializable',
        message: 'Whether this class implements java.io.Serializable',
        required: true,
        type: 'confirm',
        default: false
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  // Writing Logic
  writing() {
    // Copy the configuration files
    var vis = this.props.visibility;
    var serialize = this.props.serializable;
    var parts = this.props.name.split('.');
    var name = parts.pop();

    this.props = this.config.getAll();
    this.props.package = parts.join('.');
    this.props.dir = parts.join('/');
    this.props.name = name;
    this.props.vis = vis;

    var namespace = (this.props.namespace || '').replace(/\./g, '/');

    this.fs.copyTpl(
      this.templatePath('Class.java'),
      this.destinationPath(path.join('ODP/Code/Java', namespace, this.props.dir, this.props.name + '.java')), {
        package: this.props.package,
        namespace: namespace,
        visibility: vis,
        name: this.props.name,
        serializable: serialize
      }
    );

    this.log(yosay(chalk.red('Done') + ` creating the ${this.props.name} Class.`));
  }

  install() {
    // this.installDependencies();
  }
};
