'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
const changeCase = require('change-case');

module.exports = yeoman.Base.extend({
  prompting: function () {
    updateNotifier({pkg}).notify();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('generator-xsp') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What shall we call your app?',
        default: this.appname
      },
      {
        type: 'list',
        name: 'basetheme',
        message: 'What base theme will your app extend?',
        choices: [
          'webstandard',
          'Bootstrap3',
          'Bootstrap3_flat',
          'oneui',
          'oneuiv2',
          'oneuiv2.1',
          'oneuiv3.0.2'
        ],
        default: 'webstandard',
        store: true
      },
      {
        type: 'confirm',
        name: 'starterResources',
        message: 'Would you like to include some starter resources in your theme (app file for CSS, JS, SSJS)?',
        default: true,
        store: true
      },
      {
        type: 'checkbox',
        name: 'ddeplugins',
        message: function (answerOb) {
          var str = 'What plugins should be included?';
          var condition = (answerOb.basetheme === 'Bootstrap3' || answerOb.basetheme === 'Bootstrap3_flat');
          if (condition) {
            str += '\n  🍰  ExtLib pre-selected in order to extend ' + answerOb.basetheme;
          }
          return str;
        },
        choices: [
          {
            name: 'ExtLib',
            value: 'com.ibm.xsp.extlib.library'
          },
          {
            name: 'ExtLib Relational',
            value: 'com.ibm.xsp.extlib.relational.library'
          },
          {
            name: 'ExtLib Experimental',
            value: 'com.ibm.xsp.extlibx.library'
          },
          {
            name: 'OpenNTF Domino API',
            value: 'org.openntf.domino.xsp.XspLibrary'
          },
          {
            name: 'OpenNTF JUnit4XPages',
            value: 'org.openntf.junit4xpages.Library'
          }
        ],
        default: function (answerOb) {
          var altAr = [];
          switch (answerOb.basetheme) {
            case 'Bootstrap3':
            case 'Bootstrap3_flat':
              altAr.push('com.ibm.xsp.extlib.library');
              break;
            default:
              break;
          }
          return altAr;
        },
        store: true
      },
      {
        type: 'confirm',
        name: 'installBower',
        message: 'Would you like to use Bower for dependency management?',
        default: false,
        store: true
      },
      {
        type: 'confirm',
        name: 'useNpm',
        message: 'Include npm scripts (clean to perform a la DORA), etc.?',
        default: true,
        store: true
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  // Copy the configuration files
  config: function () {
    if (this.props.ddeplugins.indexOf('com.ibm.xsp.extlib.library') > -1) {
      this.config.set('useExtLib', true);
    } else {
      this.config.set('useExtLib', false);
    }
    /* istanbul ignore else */
    if (this.props.useNpm) {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), {
          name: changeCase.paramCase(this.props.name)
        }
      );
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );
    }
    // Only load Bower files if requested
    if (this.props.installBower) {
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'), {
          name: this.props.name
        }
      );
      this.fs.copy(
        this.templatePath('_bowerrc'),
        this.destinationPath('.bowerrc')
      );
    }
  },
  // Copy ODP's application files
  app: function () {
    // Main ODP
    this.fs.copy(
      this.templatePath('ODP'),
      this.destinationPath('ODP')
    );
    // .gitattributes
    this.fs.copyTpl(
      this.templatePath('_gitattributes'),
      this.destinationPath('.gitattributes')
    );
    // Templated files (to inject app name as received)
    this.fs.copyTpl(
      this.templatePath('_project'),
      this.destinationPath('ODP/.project'), {
        name: this.props.name + ' ODP'
      }
    );
    this.fs.copyTpl(
      this.templatePath('_database.properties'),
      this.destinationPath('ODP/AppProperties/database.properties'), {
        name: this.props.name,
        filename: this.props.filename
      }
    );
    this.fs.copyTpl(
      this.templatePath('_plugin.xml'),
      this.destinationPath('ODP/plugin.xml'), {
        name: this.props.name + ' ODP'
      }
    );
    this.fs.copyTpl(
      this.templatePath('_IconNote'),
      this.destinationPath('ODP/Resources/IconNote'), {
        name: this.props.name
      }
    );
    this.fs.copyTpl(
      this.templatePath('_app.theme'),
      this.destinationPath('ODP/Resources/Themes/app.theme'), {
        basetheme: this.props.basetheme,
        starterResources: this.props.starterResources
      }
    );
    this.fs.copyTpl(
      this.templatePath('_xsp.properties'),
      this.destinationPath('ODP/WebContent/WEB-INF/xsp.properties'), {
        ddeplugins: this.props.ddeplugins
      }
    );
    if (this.props.starterResources === true) {
      this.fs.copyTpl(
        this.templatePath('_app.css'),
        this.destinationPath('ODP/Resources/StyleSheets/app.css')
      );
      this.fs.copyTpl(
        this.templatePath('_app.js'),
        this.destinationPath('ODP/Code/ScriptLibraries/app.js')
      );
      this.fs.copyTpl(
        this.templatePath('_app.jss'),
        this.destinationPath('ODP/Code/ScriptLibraries/app.jss')
      );
    }
  },

  install: function () {
    let depOpt = {
      bower: false,
      npm: false
    };
    /* istanbul ignore else */
    if (this.props.installBower) {
      depOpt.bower = true;
    }
    /* istanbul ignore else */
    if (this.props.useNpm) {
      depOpt.npm = true;
    }
    this.installDependencies(depOpt);
  }

});
