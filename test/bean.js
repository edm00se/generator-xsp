'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const testName = 'com.my.package.Some'; // PascalCase package and Class name

describe('generator-xsp:bean', function () {
  describe('viewScope bean', function () {
    const modifier = '1';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/bean'))
      .withPrompts({
        scope: 'viewScope',
        name: testName + modifier
      })
      .toPromise();
    });

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });
});
