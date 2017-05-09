'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const testFileName = 'foo';

describe('generator-xsp:xpage', function () {
  beforeEach(function () {
    return helpers
      .run(path.join(__dirname, '../generators/xpage'))
      .withPrompts({xpagename: testFileName})
      .toPromise();
  });

  it('creates specified ODP XPage file', function () {
    assert.file(['ODP/XPages/' + testFileName + '.xsp']);
  });

  describe('CLI options power invocation', function () {
    beforeEach(function () {
      return helpers
        .run(path.join(__dirname, '../generators/xpage'))
        .withOptions({
          name: 'bar'
        })
        .toPromise();
    });

    it('creates proper file structure from specified options', function () {
      assert.file(['ODP/XPages/bar.xsp']);
    });
  });
});
