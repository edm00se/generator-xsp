'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var testProjName = 'SomeApp';

describe('generator-xsp:app', function () {
  describe('app without npm deps', function () {
    beforeEach(function () {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          name: testProjName,
          basetheme: 'Bootstrap3',
          ddeplugins: ['com.ibm.xsp.extlib.library'],
          starterResources: false,
          useNpm: false
        })
        .toPromise();
    });

    it('creates base ODP files without npm, or starter resources', function () {
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
        'package.json'
      ]);
      assert.noFileContent('ODP/Resources/Themes/app.theme', 'app.css');
      assert.noFileContent('ODP/Resources/Themes/app.theme', 'app.js');
      assert.noFileContent('ODP/Resources/Themes/app.theme', 'app.jss');
    });
  });

  describe('app with npm, with starter theme components', function () {
    beforeEach(function () {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withOptions({
          name: testProjName
        })
        .withPrompts({
          basetheme: 'webstandard',
          ddeplugins: [],
          starterResources: true,
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
      assert.fileContent('ODP/Resources/Themes/app.theme', 'app.css');
      assert.fileContent('ODP/Resources/Themes/app.theme', 'app.js');
      assert.fileContent('ODP/Resources/Themes/app.theme', 'app.jss');
    });
  });

  describe('app with no npm, alt ODP path', function () {
    beforeEach(function () {
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
          useNpm: false
        })
        .toPromise();
    });

    it('creates base ODP files', function () {
      assert.file([
        'NSF/.project',
        'NSF/AppProperties/database.properties',
        'NSF/plugin.xml',
        'NSF/Resources/IconNote'
      ]);
      assert.noFile([
        'NSF/Resources/StyleSheets/app.css',
        'NSF/Code/ScriptLibraries/app.js',
        'NSF/Code/ScriptLibraries/app.jss'
      ]);
    });
  });

  describe('reconfigure existing app to use given ODP path, via CLI options', function () {
    beforeEach(function () {
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
    describe(' basic setup with no npm scripts', function () {
      beforeEach(function () {
        return helpers
          .run(path.join(__dirname, '../generators/app'))
          .withOptions({
            n: testProjName,
            t: 'webstandard',
            r: true,
            'dde-plugins': 'ExtLib',
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
          'ODP/Resources/StyleSheets/app.css',
          'ODP/Code/ScriptLibraries/app.js',
          'ODP/Code/ScriptLibraries/app.jss'
        ]);
        assert.noFile(['package.json']);
      });
    });
    describe(' basic setup with npm scripts, starter resources', function () {
      beforeEach(function () {
        return helpers
          .run(path.join(__dirname, '../generators/app'))
          .withOptions({
            n: testProjName,
            t: 'Bootstrap3',
            'no-res': true,
            d: 'ODA',
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
          'ODP/Resources/StyleSheets/app.css',
          'ODP/Code/ScriptLibraries/app.js',
          'ODP/Code/ScriptLibraries/app.jss'
        ]);
      });
    });
  });
});
