'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
const changeCase = require('change-case');

module.exports = class extends Generator {

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.option('name', {
      desc: 'the name to give the application',
      type: String,
      alias: 'n'
    });

    if (this.options.name) {
      this.myAppName = this.options.name;
      this.config.set('name', this.myAppName);
    }

    // This method adds support for a `--set-odp-path` flag
    this.option('set-odp-path', {
      desc: 'sets On Disk Project path',
      type: String,
      alias: 'p',
      default: 'ODP'
    });

    // This method adds support for a `--set-odp-path` flag
    this.option('skip-app-init', {
      desc: 'skips other setup for a new app, use wth set-odp-path',
      type: String,
      alias: 's'
    });

    if (this.options['set-odp-path'] && this.options['skip-app-init']) {
      this.reconfigureOdp = true;
      this.config.set('odpPath', this.options['set-odp-path']);
      return;
    }

    // And you can then access it later; e.g.
    this.odpPath = (this.options['set-odp-path'] ? this.options['set-odp-path'] : 'ODP');
    this.config.set('odpPath', this.odpPath);
  }

  prompting() {
    updateNotifier({pkg}).notify();

    if (this.reconfigureOdp === true) {
      return;
    }

    const ctx = this;

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to ' + chalk.red('generator-xsp') + '!'
    ));

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'What shall we call your app?',
        default: this.myAppName || this.appname,
        when: function () {
          return undefined === ctx.myAppName;
        }
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
          let str = 'What plugins should be included?';
          const condition = (answerOb.basetheme === 'Bootstrap3' || answerOb.basetheme === 'Bootstrap3_flat');
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
        default: /* istanbul ignore next */
        function (answerOb) {
          const altAr = [];
          if (answerOb.basetheme === 'Bootstrap3' || answerOb.baseTheme === 'Bootstrap3_flat') {
            altAr.push('com.ibm.xsp.extlib.library');
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
  }

  // Copy the configuration files
  config() {
    if (this.reconfigureOdp === true) {
      return;
    }
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
  }

  // Copy ODP's application files
  app() {
    if (this.reconfigureOdp === true) {
      return;
    }
    // Main ODP
    this.fs.copy(
      this.templatePath('ODP'),
      this.destinationPath(this.odpPath)
    );
    // .gitattributes
    this.fs.copyTpl(
      this.templatePath('_gitattributes'),
      this.destinationPath('.gitattributes')
    );
    // Templated files (to inject app name as received)
    this.fs.copyTpl(
      this.templatePath('_project'),
      this.destinationPath(this.odpPath + '/.project'), {
        name: this.props.name + this.odpPath
      }
    );
    this.fs.copyTpl(
      this.templatePath('_database.properties'),
      this.destinationPath(this.odpPath + '/AppProperties/database.properties'), {
        name: this.props.name,
        filename: this.props.filename
      }
    );
    this.fs.copyTpl(
      this.templatePath('_plugin.xml'),
      this.destinationPath(this.odpPath + '/plugin.xml'), {
        name: this.props.name + this.odpPath
      }
    );
    this.fs.copyTpl(
      this.templatePath('_IconNote'),
      this.destinationPath(this.odpPath + '/Resources/IconNote'), {
        name: this.props.name
      }
    );
    this.fs.copyTpl(
      this.templatePath('_app.theme'),
      this.destinationPath(this.odpPath + '/Resources/Themes/app.theme'), {
        basetheme: this.props.basetheme,
        starterResources: this.props.starterResources
      }
    );
    this.fs.copyTpl(
      this.templatePath('_xsp.properties'),
      this.destinationPath(this.odpPath + '/WebContent/WEB-INF/xsp.properties'), {
        ddeplugins: this.props.ddeplugins
      }
    );
    if (this.props.starterResources === true) {
      this.fs.copyTpl(
        this.templatePath('_app.css'),
        this.destinationPath(this.odpPath + '/Resources/StyleSheets/app.css')
      );
      this.fs.copyTpl(
        this.templatePath('_app.js'),
        this.destinationPath(this.odpPath + '/Code/ScriptLibraries/app.js')
      );
      this.fs.copyTpl(
        this.templatePath('_app.jss'),
        this.destinationPath(this.odpPath + '/Code/ScriptLibraries/app.jss')
      );
    }
  }

  install() {
    if (this.reconfigureOdp === true) {
      return;
    }
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
    if (depOpt.bower === false && depOpt.npm === false) {
      // intentionally left blank
    } else {
      this.installDependencies(depOpt);
    }
  }

};
