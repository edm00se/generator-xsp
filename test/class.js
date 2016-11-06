'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var testName = 'com.my.package.Some'; // PascalCase package and Class name

describe('generator-xsp:class', function () {
  describe('public', function () {
    var modifier = '1';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/class'))
        .withPrompts({visibility: 'public', name: testName + modifier})
        .toPromise();
    });

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('default (public), checking for Serializable', function () {
    var modifier = '2';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/class'))
        .withPrompts({visibility: '', name: testName + modifier, serializable: true})
        .toPromise();
    });

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);

      var tmpBuf = fs.readFileSync('ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java');
      assert(tmpBuf.toString().includes('implements Serializable'));
    });
  });

  describe('protected', function () {
    var modifier = '3';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/class'))
        .withPrompts({visibility: 'protected', name: testName + modifier})
        .toPromise();
    });

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('private', function () {
    var modifier = '4';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/class'))
        .withPrompts({visibility: 'protected', name: testName + modifier})
        .toPromise();
    });

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('no modifier', function () {
    var modifier = '5';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/class'))
        .withPrompts({visibility: '', name: testName + modifier})
        .toPromise();
    });

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });
});
