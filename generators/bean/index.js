'use strict';

const fs = require('fs');
const path = require('path');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const cheerio = require('cheerio');
const changeCase = require('change-case');
const lowerCase = require('lower-case').lowerCase;
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.option('name', {
      desc:
        'the name, in Pascal case (aka- UpperCamelCase), to give the newly created managed bean',
      type: String,
      alias: 'n'
    });
    if (this.options.name) {
      this.name = this.options.name;
    }

    this.option('scope', {
      desc: 'the scope to give the newly created managed bean',
      type: String,
      alias: 's'
    });
    if (this.options.scope) {
      this.scope = this.options.scope;
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
        name: 'scope',
        message: 'Scope to put managed bean into',
        required: function () {
          /* istanbul ignore next */
          return undefined === ctx.scope;
        },
        type: 'list',
        when: function () {
          return undefined === ctx.scope;
        },
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

    return this.prompt(prompts).then(
      function (props) {
        // To access props later use this.props.someAnswer;
        this.props = props;
      }.bind(this)
    );
  }

  // Writing Logic
  writing() {
    // Copy the configuration files
    const scope = this.scope || this.props.scope;
    const rawName = this.name || this.props.name;
    const parts = rawName.split('.');
    const name = parts.pop();
    const log = this.log;
    const odpPath = this.config.get('odpPath') || 'ODP';

    this.props = this.config.getAll();
    this.props.package = parts.join('.');
    const pkg = this.props.package;
    this.props.dir = parts.join('/');
    this.props.name = name;
    const lCaseName = lowerCase(this.props.name);

    const namespace = (this.props.namespace || '').replace(/\./g, '/');

    const exlib = this.config.get('useExtLib') || false;

    this.fs.copyTpl(
      this.templatePath('Class.java'),
      this.destinationPath(
        path.join(
          odpPath + '/Code/Java',
          namespace,
          this.props.dir,
          this.props.name + '.java'
        )
      ),
      {
        package: pkg,
        namespace: namespace,
        name: this.props.name,
        lowerCaseName: lCaseName,
        camelName: changeCase.camelCase(name),
        scope: scope,
        extlib: exlib
      }
    );

    // Write block to faces-config.xml
    var projRoot = this.destinationRoot();
    fs.readFile(
      path.join(projRoot, odpPath + '/WebContent/WEB-INF/faces-config.xml'),
      'utf8',
      function (err, data) {
        /* istanbul ignore else */
        if (err) {
          log(
            yosay(
              chalk.red('Error') +
                ` getting faces-config.xml content.
You may need to add the relevant definition manually.`
            )
          );
        } else if (
          data.includes(
            `<managed-bean-name>${lCaseName}Bean</managed-bean-name>`
          )
        ) {
          // Managed bean already exists, prompt to deconflict
          log(
            yosay(
              chalk.red('Error:') +
                `a <managed-bean> block with the '${lCaseName}Bean' <managed-bean-name> already exists.
You should de-conflict your faces-config.xml file manually.`
            )
          );
        } else {
          let $ = cheerio.load(data, {xmlMode: true});
          var add = `  <managed-bean>
  <managed-bean-name>${changeCase.camelCase(name)}Bean</managed-bean-name>
  <managed-bean-scope>${scope}</managed-bean-scope>
  <managed-bean-class>${pkg ? pkg + '.' : ''}${name}</managed-bean-class>
</managed-bean>
`;
          $('faces-config').append(add);
          fs.writeFile(
            path.join(
              projRoot,
              odpPath + '/WebContent/WEB-INF/faces-config.xml'
            ),
            $.xml(),
            'utf8',
            function (err) {
              if (err) {
                throw err;
              }

              log(
                yosay(
                  'The bean\'s class has been created and the ' +
                    chalk.red('faces-config') +
                    ' has been updated!'
                )
              );
            }
          );
        }
      }
    );
  }

  install() {}
};
