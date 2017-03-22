'use strict';
const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.option('name', {
      desc: 'the name to give the newly created XPage',
      type: String,
      alias: 'n'
    });

    if (this.options.name) {
      this.xpagename = this.options.name;
    }
  }

  prompting() {
    updateNotifier({pkg}).notify();
    const ctx = this;
    var prompts = [
      {
        type: 'input',
        name: 'xpagename',
        message: 'What shall we call your new XPage?',
        when: function () {
          return undefined === ctx.xpagename;
        }
      }
    ];

    return this.prompt(prompts).then(
      function (props) {
        // To access props later use this.props.someAnswer;
        this.props = props;
      }.bind(this)
    );
  }

  // Writing Logic
  writing() {
    const odpPath = this.config.get('odpPath') || 'ODP';
    // Copy the configuration files
    var tmpName = _.camelCase(this.xpagename) || this.props.xpagename;
    this.fs.copyTpl(
      this.templatePath('_some.xsp'),
      this.destinationPath(odpPath + '/XPages/' + tmpName + '.xsp'),
      {
        name: tmpName
      }
    );

    this.log(
      yosay(
        chalk.red('Done') +
          ` creating the ${this.xpagename || this.props.xpagename} XPage.`
      )
    );
  }
};
