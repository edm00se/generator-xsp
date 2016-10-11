'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var testProjName = 'SomeApp';

describe('generator-xsp:app - app with no bower but with starter theme components', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({
        name: testProjName,
        ddeplugins: 'com.ibm.xsp.extlib.library'
      })
      .withPrompts({
        basetheme: 'webstandard',
        starterResources: true,
        installBower: false
      })
      .toPromise();
  });

  it('creates base ODP files', function () {
    assert.file([
      'ODP/.project',
      'ODP/AppProperties/database.properties',
      'ODP/plugin.xml',
      'ODP/Resources/IconNote',
      'ODP/Resources/StyleSheets/app.css',
      'ODP/Code/ScriptLibraries/app.js',
      'ODP/Code/ScriptLibraries/app.jss',
      'ODP/Resources/IconNote'
    ]);
    assert.noFile([
      'bower.json'
    ]);
  });
});

describe('generator-xsp:app - app with bower', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({
        name: testProjName,
        basetheme: 'Bootstrap3',
        ddeplugins: 'com.ibm.xsp.extlib.library'
      })
      .withPrompts({
        basetheme: 'Bootstrap3',
        starterResources: false,
        installBower: true
      })
      .toPromise();
  });

  it('creates base ODP files with bower support', function () {
    assert.file([
      'ODP/.project',
      'ODP/AppProperties/database.properties',
      'ODP/plugin.xml',
      'ODP/Resources/IconNote',
      'bower.json'
    ]);
    assert.noFile([
      'ODP/Resources/StyleSheets/app.css',
      'ODP/Code/ScriptLibraries/app.js',
      'ODP/Code/ScriptLibraries/app.jss'
    ]);
  });
});
