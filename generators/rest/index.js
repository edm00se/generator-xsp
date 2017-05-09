'use strict';
const Generator = require('yeoman-generator');
const fs = require('fs');
const chalk = require('chalk');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
const fileExists = require('file-exists');
const changeCase = require('change-case');
const cheerio = require('cheerio');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    this.option('endpoint', {
      desc: 'the name to give the newly created RESTful endpoint (ex: "todos" will yield `api.xsp/todos`)',
      type: String,
      alias: 'e'
    });
    if (this.options.endpoint) {
      this.endpoint = this.options.endpoint;
    }

    this.option('contenttype', {
      desc: 'the content-type to use, such as "application/json", "text/plain", etc.',
      type: String,
      alias: 't'
    });
    if (this.options.contenttype) {
      this.contenttype = this.options.contenttype;
      this.config.set('contenttype', this.contenttype);
    }
  }

  prompting() {
    updateNotifier({pkg}).notify();
    const ctx = this;
    const prompts = [
      {
        type: 'input',
        name: 'endpoint',
        message: 'What endpoint would you like to use?',
        when: function () {
          return undefined === ctx.endpoint;
        }
      },
      {
        type: 'list',
        name: 'contenttype',
        message: 'What ContentType to use for request + response?',
        choices: ['application/json', 'text/plain', 'text/xml'],
        default: 'application/json',
        required: function () {
          /* istanbul ignore next */
          return undefined === ctx.contenttype;
        },
        store: true,
        when: function () {
          return undefined === ctx.contenttype;
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

  // Copy the configuration files
  config() {
    const odpPath = this.config.get('odpPath') || 'ODP';
    const vm = this;
    const log = vm.log;
    const endpoint = changeCase.camelCase(vm.endpoint) || vm.props.endpoint;
    // Define templating vars
    const opt = {
      svcName: endpoint,
      propName: changeCase.pascalCase(endpoint),
      path: changeCase.paramCase(endpoint),
      serviceBeanPkg: 'app.rest',
      serviceBeanPkgClass: 'app.rest.' + changeCase.pascalCase(endpoint),
      serviceBeanPathClass: 'app/rest/' +
        changeCase.pascalCase(endpoint) +
        'ServiceBean.java',
      type: vm.contenttype || vm.props.contenttype
    }; // Ignoring as the tests run async and no guarantee of existing api.xsp
    /* istanbul ignore next */
    if (fileExists.sync(vm.destinationPath(odpPath + '/XPages/api.xsp'))) {
      fs.readFile(
        vm.destinationPath(odpPath + '/XPages/api.xsp'),
        'utf8',
        function (err, data) {
          if (err) {
            throw err;
          }
          let $ = cheerio.load(data, {
            xmlMode: true
          });
          const add = ` <xe\\:restService
id="${opt.path}"
pathInfo="${opt.svcName}"
state="false">
<xe\\:this.service>
	<xe\\:customRestService
		serviceBean="${opt.serviceBeanPkgClass}ServiceBean"
		requestContentType="${opt.type}"
		contentType="${opt.type}">
	</xe\\:customRestService>
</xe\\:this.service>
</xe\\:restService>`;
          $('xp\\:view').append(add);
          fs.writeFile(
            vm.destinationPath(odpPath + '/XPages/api.xsp'),
            $.xml().replace(/\\/gim, ''),
            'utf8',
            function (er) {
              if (er) {
                throw er;
              }
              log('The ' + chalk.red('api.xsp') + ' has been updated!');
            }
          );
        }
      );
    } else {
      // New api.xsp needed
      vm.fs.copyTpl(
        vm.templatePath('api.xsp'),
        vm.destinationPath(odpPath + '/XPages/api.xsp'),
        opt
      );
    }
    vm.fs.copyTpl(
      vm.templatePath('./_serviceBean.java'),
      vm.destinationPath(odpPath + '/Code/Java/' + opt.serviceBeanPathClass),
      opt
    );
    vm.log(
      yosay(
        chalk.red('Done') +
          ` creating the ${vm.endpoint || vm.props.endpoint} as a Custom Rest Service via Service Bean.`
      )
    );
  }

  install() {}
};
