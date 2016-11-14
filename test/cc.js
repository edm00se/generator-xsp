'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var testFileName = 'bar';

describe('generator-xsp:cc', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/cc'))
      .withPrompts({ccname: testFileName})
      .toPromise();
  });

  it('creates specified ODP Custom Control file', function () {
    assert.file([
      'ODP/CustomControls/' + testFileName + '.xsp'
    ]);
  });
});
