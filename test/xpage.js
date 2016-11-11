'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var testFileName = 'foo';

describe('generator-xsp:xpage', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/xpage'))
      .withPrompts({xpagename: testFileName})
      .toPromise();
  });

  it('creates specified ODP XPage file', function () {
    assert.file([
      'ODP/XPages/' + testFileName + '.xsp'
    ]);
  });
});
