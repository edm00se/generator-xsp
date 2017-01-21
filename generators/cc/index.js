'use strict';
const Generator = require('yeoman-generator');
const _ = require('lodash');
const chalk = require('chalk');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

module.exports = class extends Generator {
  prompting() {
    updateNotifier({pkg}).notify();
    var prompts = [{
      type: 'input',
      name: 'ccname',
      message: 'What shall we call your new Custom Control?'
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  // Writing Logic
  writing() {
    const odpPath = this.config.get('odpPath') || 'ODP';
    // Copy the configuration files
    var tmpName = _.camelCase(this.ccname) || this.props.ccname;
    this.fs.copyTpl(
      this.templatePath('_some.xsp'),
      this.destinationPath(odpPath + '/CustomControls/' + tmpName + '.xsp'), {
        name: tmpName
      }
    );

    this.log(yosay(chalk.red('Done') + ` creating the ${this.props.ccname} Custom Control.`));
  }

  install() {
    // this.installDependencies();
  }
};
