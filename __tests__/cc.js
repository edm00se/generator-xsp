'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const testFileName = 'bar';

describe('generator-xsp:cc', function () {
  beforeEach(() => {
    return helpers
      .run(path.join(__dirname, '../generators/cc'))
      .withPrompts({ccname: testFileName})
      .toPromise();
  });

  it('creates specified ODP Custom Control file', function () {
    assert.file(['ODP/CustomControls/' + testFileName + '.xsp']);
  });

  describe('CLI options power invocation', function () {
    beforeEach(function () {
      return helpers
        .run(path.join(__dirname, '../generators/cc'))
        .withOptions({
          name: 'baz'
        })
        .toPromise();
    });

    it('creates proper file structure from specified options', function () {
      assert.file(['ODP/CustomControls/baz.xsp']);
    });
  });
});
