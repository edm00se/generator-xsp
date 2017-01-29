'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const testName = 'com.my.package.Some'; // PascalCase package and Class name

// abstracted common before function to minimize duplicated functions
function common(mod, serialize) {
  return () => {
    const conf = {visibility: '', name: testName + mod};
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
    const modifier = '1';

    before(common(modifier));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('default (public), checking for Serializable', function () {
    const modifier = '2';

    before(common(modifier, true));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);

      const tmpBuf = fs.readFileSync('ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java');
      assert(tmpBuf.toString().includes('implements Serializable'));
    });
  });

  describe('protected', function () {
    const modifier = '3';

    before(common(modifier));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('private', function () {
    const modifier = '4';

    before(common(modifier));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('no modifier', function () {
    const modifier = '5';

    before(common(modifier));

    it('creates specified ODP Java class file', function () {
      assert.file([
        'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java'
      ]);
    });
  });

  describe('CLI options power invocation', function () {
    const modifier = '6';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/class'))
        .withOptions({
          name: testName + modifier,
          visibility: 'public',
          serializable: true
        })
        .toPromise();
    });

    it('creates proper file structure from specified options', function () {
      const fPath = 'ODP/Code/Java/' + testName.replace(/\./g, '/') + modifier + '.java';
      assert.file([
        fPath
      ]);

      const tmpBuf = fs.readFileSync(fPath);
      assert(tmpBuf.toString().includes('implements Serializable'));
    });
  });
});
