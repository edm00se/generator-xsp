'use strict';
var fs = require('fs');
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var testName = 'com.my.package.Some'; // PascalCase package and Class name

// abstracted common before function to minimize duplicated functions
function common(mod, serialize) {
  return function () {
    var conf = {visibility: '', name: testName + mod};
    if (serialize) {
      conf.serializable = true;
    }
    return helpers.run(path.join(__dirname, '../generators/class'))
      .withPrompts(conf)
      .toPromise();
  };
}

describe('generator-xsp:class', function () {
  describe('public', function () {
    var modifier = '1';

    before(common(modifier));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('default (public), checking for Serializable', function () {
    var modifier = '2';

    before(common(modifier, true));

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

    before(common(modifier));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('private', function () {
    var modifier = '4';

    before(common(modifier));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('no modifier', function () {
    var modifier = '5';

    before(common(modifier));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });
});
