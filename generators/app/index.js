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

    this.option('basetheme', {
      desc: 'the base theme for the app.theme to extend (ex: webstandard, Bootstrap3, etc.)',
      type: String,
      alias: 't'
    });
    if (this.options.basetheme) {
      this.basetheme = this.options.basetheme;
      this.config.set('name', this.basetheme);
    }

    this.option('starter-resources', {
      desc: 'includes starter CSS, JS, SSJS files',
      type: Boolean,
      alias: 'r'
    });
    this.option('skip-starter-resources', {
      desc: 'skips inclusion of starter CSS, JS, SSJS files (use instead of --starter-resources)',
      type: Boolean,
      alias: 'no-res'
    });
    if (this.options['starter-resources']) {
      this.starterResources = true;
      this.config.set('starterResources', true);
    }
    if (this.options['skip-starter-resources']) {
      this.starterResources = false;
      this.config.set('starterResources', false);
    }

    this.option('dde-plugins', {
      desc: 'plugins to enable for the app (ExtLib, ODA, JUnit)',
      type: String,
      alias: 'd'
    });
    /* istanbul ignore next */
    if (this.options['dde-plugins']) {
      let ar = [];
      let tmpAr = [];
      if (this.options['dde-plugins'].indexOf(',') > -1) {
        tmpAr = this.options['dde-plugins'].split(',');
      } else {
        tmpAr.push(this.options['dde-plugins']);
      }
      tmpAr.forEach(function (val) {
        switch (val) {
          case 'ExtLib':
            ar.push('com.ibm.xsp.extlib.library');
            break;
          case 'ODA':
            ar.push('org.openntf.domino.xsp.XspLibrary');
            break;
          case 'JUnit':
            ar.push('org.openntf.junit4xpages.Library');
            break;
          default:
            break;
        }
      });
      if (this.options.basetheme) {
        if (this.options.basetheme === 'Bootstrap3' || this.options.basetheme === 'Bootstrap3_flat') {
          if (ar.indexOf('com.ibm.xsp.extlib.library') < 0) {
            ar.push('com.ibm.xsp.extlib.library');
          }
        }
      }
      this.ddeplugins = ar;
    }

    this.option('use-bower', {
      desc: 'opts-in to using Bower for client-side dependency management',
      type: Boolean,
      alias: 'b'
    });
    this.option('skip-bower', {
      desc: 'opts-out of using Bower, use instead of --use-bower',
      type: Boolean
    });
    if (this.options['use-bower']) {
      this.useBower = true;
      this.config.set('installBower', true);
    }
    if (this.options['skip-bower']) {
      this.useBower = false;
      this.config.set('installBower', false);
    }

    this.option('use-npm', {
      desc: 'opts-in to using npm for dependency management and adds a dora cleaning script to package.json',
      type: Boolean,
      alias: 'npm'
    });
    this.option('skip-npm', {
      desc: 'opts-out of using npm, use instead of --use-npm',
      type: Boolean
    });
    if (this.options['use-npm'] && this.options['use-npm'] === true) {
      this.useNpm = true;
      this.config.set('useNpm', true);
    }
    if (this.options['skip-npm']) {
      this.useNpm = false;
      this.config.set('useNpm', false);
    }

    // This method adds support for a `--set-odp-path` flag
    this.option('set-odp-path', {
      desc: 'sets On Disk Project path',
      type: String,
      alias: 'p',
      default: 'ODP'
    });

    // This method adds support for a `--skip-app-init` flag
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
    this.odpPath = 'ODP';
    /* istanbul ignore next */
    if (this.options['set-odp-path']) {
      this.odpPath = this.options['set-odp-path'];
    }
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
        store: true,
        when: function () {
          return undefined === ctx.basetheme;
        }
      },
      {
        type: 'confirm',
        name: 'starterResources',
        message: 'Would you like to include some starter resources in your theme (app file for CSS, JS, SSJS)?',
        default: true,
        store: true,
        when: function () {
          return undefined === ctx.starterResources;
        }
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
        store: true,
        when: function () {
          return undefined === ctx.ddeplugins;
        }
      },
      {
        type: 'confirm',
        name: 'installBower',
        message: 'Would you like to use Bower for dependency management?',
        default: false,
        store: true,
        when: function () {
          return undefined === ctx.useBower;
        }
      },
      {
        type: 'confirm',
        name: 'useNpm',
        message: 'Include npm scripts (clean to perform a la DORA), etc.?',
        default: true,
        store: true,
        when: function () {
          return undefined === ctx.useNpm;
        }
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
    const tmpPlugins = this.ddeplugins || this.props.ddeplugins;
    if (tmpPlugins.indexOf('com.ibm.xsp.extlib.library') > -1) {
      this.config.set('useExtLib', true);
    } else {
      this.config.set('useExtLib', false);
    }
    /* istanbul ignore else */
    if (this.props.useNpm || this.useNpm) {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), {
          name: changeCase.paramCase(this.props.name),
          odp: this.odpPath
        }
      );
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      );
    }
    // Only load Bower files if requested
    if (this.props.installBower || this.useBower) {
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
        starterResources: this.props.starterResources || this.starterResources
      }
    );
    this.fs.copyTpl(
      this.templatePath('_xsp.properties'),
      this.destinationPath(this.odpPath + '/WebContent/WEB-INF/xsp.properties'), {
        ddeplugins: this.ddeplugins || this.props.ddeplugins
      }
    );
    if (this.props.starterResources === true || this.starterResources) {
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
