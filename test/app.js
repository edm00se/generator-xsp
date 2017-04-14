'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var testProjName = 'SomeApp';

describe('generator-xsp:app', function () {
  describe('app without bower or npm deps', function () {
    before(function () {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          name: testProjName,
          basetheme: 'Bootstrap3',
          ddeplugins: ['com.ibm.xsp.extlib.library'],
          starterResources: false,
          installBower: false,
          useNpm: false
        })
        .toPromise();
    });

    it('creates base ODP files without bower, npm, or starter resources', function () {
      assert.file([
        'ODP/.project',
        'ODP/AppProperties/database.properties',
        'ODP/plugin.xml',
        'ODP/Resources/IconNote'
      ]);
      assert.noFile([
        'ODP/Resources/StyleSheets/app.css',
        'ODP/Code/ScriptLibraries/app.js',
        'ODP/Code/ScriptLibraries/app.jss',
        'package.json',
        'bower.json'
      ]);
      assert.noFileContent('ODP/Resources/Themes/app.theme', 'app.css');
      assert.noFileContent('ODP/Resources/Themes/app.theme', 'app.js');
      assert.noFileContent('ODP/Resources/Themes/app.theme', 'app.jss');
    });
  });

  describe('app with npm, no bower, with starter theme components', function () {
    before(function () {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withOptions({
          name: testProjName
        })
        .withPrompts({
          basetheme: 'webstandard',
          ddeplugins: [],
          starterResources: true,
          installBower: false,
          useNpm: true
        })
        .toPromise();
    });

    it('creates base ODP files with starter resources', function () {
      assert.file([
        'ODP/.project',
        'ODP/AppProperties/database.properties',
        'ODP/plugin.xml',
        'ODP/Resources/IconNote',
        'ODP/Resources/StyleSheets/app.css',
        'ODP/Code/ScriptLibraries/app.js',
        'ODP/Code/ScriptLibraries/app.jss',
        'ODP/Resources/IconNote',
        'package.json'
      ]);
      assert.noFile(['bower.json']);
      assert.fileContent('ODP/Resources/Themes/app.theme', 'app.css');
      assert.fileContent('ODP/Resources/Themes/app.theme', 'app.js');
      assert.fileContent('ODP/Resources/Themes/app.theme', 'app.jss');
    });
  });

  describe('app with bower no npm, alt ODP path', function () {
    before(function () {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withOptions({
          name: testProjName,
          'set-odp-path': 'NSF'
        })
        .withPrompts({
          basetheme: 'Bootstrap3',
          ddeplugins: ['com.ibm.xsp.extlib.library'],
          starterResources: false,
          installBower: true,
          useNpm: false
        })
        .toPromise();
    });

    it('creates base ODP files with bower support', function () {
      assert.file([
        'NSF/.project',
        'NSF/AppProperties/database.properties',
        'NSF/plugin.xml',
        'NSF/Resources/IconNote',
        'bower.json'
      ]);
      assert.noFile([
        'NSF/Resources/StyleSheets/app.css',
        'NSF/Code/ScriptLibraries/app.js',
        'NSF/Code/ScriptLibraries/app.jss'
      ]);
    });
  });

  describe('reconfigure existing app to use given ODP path, via CLI options', function () {
    before(function () {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withOptions({
          'set-odp-path': 'NSF',
          'skip-app-init': true
        })
        .toPromise();
    });

    it('creates config file with odp option', function () {
      assert.file('.yo-rc.json');
      assert.fileContent(
        '.yo-rc.json',
        `{
  "generator-xsp": {
    "odpPath": "NSF"
  }
}`
      );
      assert.noFile(['.gitattributes', 'ODP/.project', 'NSF/.project']);
    });
  });

  describe('CLI options power invocation', function () {
    describe(' basic setup with bower no npm scripts', function () {
      before(function () {
        return helpers
          .run(path.join(__dirname, '../generators/app'))
          .withOptions({
            n: testProjName,
            t: 'webstandard',
            r: true,
            'dde-plugins': 'ExtLib',
            b: true,
            'skip-npm': true,
            p: 'ODP'
          })
          .toPromise();
      });

      it('creates proper file structure from specified options', function () {
        assert.file([
          'ODP/.project',
          'ODP/AppProperties/database.properties',
          'ODP/plugin.xml',
          'ODP/Resources/IconNote',
          'bower.json',
          'ODP/Resources/StyleSheets/app.css',
          'ODP/Code/ScriptLibraries/app.js',
          'ODP/Code/ScriptLibraries/app.jss'
        ]);
        assert.noFile(['package.json']);
      });
    });
    describe(' basic setup with npm scripts, no bower, starter resources', function () {
      before(function () {
        return helpers
          .run(path.join(__dirname, '../generators/app'))
          .withOptions({
            n: testProjName,
            t: 'Bootstrap3',
            'no-res': true,
            d: 'ODA',
            'skip-bower': true,
            npm: true,
            p: 'ODP'
          })
          .toPromise();
      });

      it('creates proper file structure from specified options', function () {
        assert.file([
          'ODP/.project',
          'ODP/AppProperties/database.properties',
          'ODP/plugin.xml',
          'ODP/Resources/IconNote',
          'package.json'
        ]);
        assert.noFile([
          'bower.json',
          'ODP/Resources/StyleSheets/app.css',
          'ODP/Code/ScriptLibraries/app.js',
          'ODP/Code/ScriptLibraries/app.jss'
        ]);
      });
    });
  });
});
