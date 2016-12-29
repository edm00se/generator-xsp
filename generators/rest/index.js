'use strict';
const yeoman = require('yeoman-generator');
const fs = require('fs');
const chalk = require('chalk');
const yosay = require('yosay');
const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');
const fileExists = require('file-exists');
const changeCase = require('change-case');
const cheerio = require('cheerio');

module.exports = yeoman.Base.extend({
  prompting: function () {
    updateNotifier({pkg}).notify();
    var prompts = [
      {
        type: 'input',
        name: 'endpoint',
        message: 'What endpoint would you like to use?'
      },
      {
        type: 'list',
        name: 'contenttype',
        message: 'What ContentType to use for request + response?',
        choices: [
          'application/json',
          'text/plain',
          'text/xml'
        ],
        default: 'application/json',
        store: true
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
      const vm = this;
      const log = vm.log;
      let endpoint = changeCase.camelCase(vm.endpoint) || vm.props.endpoint;
      // define templating vars
      const opt = {
        svcName: endpoint,
        propName: changeCase.pascalCase(endpoint),
        path: changeCase.paramCase(endpoint),
        serviceBeanPkg: 'app.rest',
        serviceBeanPkgClass: 'app.rest.' + changeCase.pascalCase(endpoint),
        serviceBeanPathClass: 'app/rest/' + changeCase.pascalCase(endpoint) + 'ServiceBean.java',
        type: vm.props.contenttype
      };
      if (fileExists(vm.destinationPath('ODP/XPages/api.xsp'))) {
        fs.readFile(vm.destinationPath('ODP/XPages/api.xsp'), 'utf8', function (err, data) {
          if (err) {
            throw err;
          }
          let $ = cheerio.load(data, {
            xmlMode: true
          });
          const add = ` <xe\\:restService
	id="${opt.svcName}"
	pathInfo="${opt.path}"
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
          fs.writeFile(vm.destinationPath('ODP/XPages/api.xsp'), $.xml().replace(/\\/gmi, ''), 'utf8', function (er) {
            if (er) {
              throw er;
            }
            log(yosay(
              'The ' + chalk.red('api.xsp') + ' has been updated!'
            ));
          });
        });
      } else {
        // new api.xsp needed
        vm.fs.copyTpl(
          vm.templatePath('api.xsp'),
          vm.destinationPath('ODP/XPages/api.xsp'), opt
        );
      }
      vm.fs.copyTpl(
        vm.templatePath('./_serviceBean.java'),
        vm.destinationPath('ODP/Code/Java/' + opt.serviceBeanPathClass), opt
      );
      vm.log(yosay(chalk.red('Done') + ` creating the ${vm.props.endpoint} as a Custom Rest Service via Service Bean.`));
    }
  },

  install: function () {
    // this.installDependencies();
  }
});
