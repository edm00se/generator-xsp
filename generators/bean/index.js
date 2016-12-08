'use strict';

const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const cheerio = require('cheerio');
const changeCase = require('change-case');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

module.exports = yeoman.Base.extend({
  prompting: function () {
    updateNotifier({pkg}).notify();
    var prompts = [
      {
        name: 'name',
        message: 'Name of the class in Pascal case (aka- UpperCamelCase)',
        required: true,
        type: String
      },
      {
        name: 'scope',
        message: 'Scope to put managed bean into',
        required: true,
        type: 'list',
        choices: [
          {
            name: 'request',
            value: 'request'
          },
          {
            name: 'view',
            value: 'view'
          },
          {
            name: 'session',
            value: 'session'
          },
          {
            name: 'application',
            value: 'application'
          }
        ],
        default: 'view'
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  // Writing Logic
  writing: {
    // Copy the configuration files
    config: function () {
      var scope = this.props.scope;
      var parts = this.props.name.split('.');
      var name = parts.pop();
      var log = this.log;

      this.props = this.config.getAll();
      this.props.package = parts.join('.');
      var pkg = this.props.package;
      this.props.dir = parts.join('/');
      this.props.name = name;
      var lCaseName = changeCase.lowerCase(this.props.name);

      var namespace = (this.props.namespace || '').replace(/\./g, '/');

      const exlib = this.config.get('useExtLib') || false;

      this.fs.copyTpl(
        this.templatePath('Class.java'),
        this.destinationPath(path.join('ODP/Code/Java', namespace, this.props.dir, this.props.name + '.java')), {
          package: pkg,
          namespace: namespace,
          name: this.props.name,
          lowerCaseName: lCaseName,
          camelName: changeCase.camelCase(name),
          scope: scope,
          extlib: exlib
        }
      );

      // write block to faces-config.xml
      var projRoot = this.destinationRoot();
      fs.readFile(path.join(projRoot, 'ODP/WebContent/WEB-INF/faces-config.xml'), 'utf8', function (err, data) {
        /* istanbul ignore else */
        if (err) {
          log(yosay(
            chalk.red('Error') + ` getting faces-config.xml content.
  You may need to add the relevant definition manually.`
          ));
        } else if (data.includes(`<managed-bean-name>${lCaseName}Bean</managed-bean-name>`)) {
            // managed bean already exists, prompt to deconflict
          log(yosay(
            chalk.red('Error:') + `a <managed-bean> block with the '${lCaseName}Bean' <managed-bean-name> already exists.
  You should de-conflict your faces-config.xml file manually.`
          ));
        } else {
          let $ = cheerio.load(data, {xmlMode: true});
          var add = `  <managed-bean>
    <managed-bean-name>${changeCase.camelCase(name)}Bean</managed-bean-name>
    <managed-bean-scope>${scope}</managed-bean-scope>
    <managed-bean-class>${pkg ? pkg + '.' : ''}${name}</managed-bean-class>
  </managed-bean>
`;
          $('faces-config').append(add);
          fs.writeFile(path.join(projRoot, 'ODP/WebContent/WEB-INF/faces-config.xml'), $.xml(), 'utf8', function (err) {
            if (err) {
              throw err;
            }
            log(yosay(
              'The bean\'s class has been created and the ' + chalk.red('faces-config') + ' has been updated!'
            ));
          });
        }
      });
    }
  },

  install: function () {
    // this.installDependencies();
  }
});
