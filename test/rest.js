'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const changeCase = require('change-case');
const apiXpg = 'ODP/XPages/api.xsp';

describe('generator-xsp:rest', function () {
  describe('first CustomRestService bean and endpoint', function () {
    const myName = 'stuff';
    const myProperName = changeCase.pascalCase(myName);
    const fName = 'ODP/Code/Java/app/rest/' + myProperName + 'ServiceBean.java';

    before(() => {
      return helpers.run(path.join(__dirname, '../generators/rest'))
        .withPrompts({
          endpoint: myName,
          contenttype: 'application/json'
        })
        .toPromise();
    });

    it('creates specified CustomServiceBean Java class file', () => {
      assert.file([
        fName
      ]);

      assert.fileContent(fName, 'extends CustomServiceBean');
    });

    it('creates api.xsp', () => {
      assert.file(apiXpg);
    });

    it('defines api endpont in api.xsp', () => {
      assert.fileContent(apiXpg, '<xe:restService');
      assert.fileContent(apiXpg, `pathInfo="${myName}"`);
    });

    it('defines use of the CustomServiceBean', () => {
      assert.fileContent(apiXpg, '<xe:customRestService');
      assert.fileContent(apiXpg, `serviceBean="app.rest.${myProperName}ServiceBean"`);
    });
  });

  describe('second CustomRestService bean and endpoint', () => {
    const myName = 'things';
    const myProperName = changeCase.pascalCase(myName);
    const fName = 'ODP/Code/Java/app/rest/' + myProperName + 'ServiceBean.java';

    before(() => {
      return helpers.run(path.join(__dirname, '../generators/rest'))
        .withPrompts({
          endpoint: myName,
          contenttype: 'application/json'
        })
        .toPromise();
    });

    it('creates specified CustomServiceBean Java class file', () => {
      assert.file([
        fName
      ]);

      assert.fileContent(fName, 'extends CustomServiceBean');
    });

    it('ensures api.xsp exists', () => {
      assert.file(apiXpg);
    });

    it('defines api endpont in api.xsp', () => {
      assert.fileContent(apiXpg, '<xe:restService');
      assert.fileContent(apiXpg, `pathInfo="${myName}"`);
    });

    it('defines use of the CustomServiceBean', () => {
      assert.fileContent(apiXpg, '<xe:customRestService');
      assert.fileContent(apiXpg, `serviceBean="app.rest.${myProperName}ServiceBean"`);
    });
  });

  describe('CLI options power invocation', function () {
    const myName = 'gadget';
    const myProperName = changeCase.pascalCase(myName);
    const fName = 'ODP/Code/Java/app/rest/' + myProperName + 'ServiceBean.java';

    before(function () {
      return helpers.run(path.join(__dirname, '../generators/rest'))
        .withOptions({
          endpoint: myName,
          contenttype: 'text/plain'
        })
        .toPromise();
    });

    it('creates specified CustomServiceBean Java class file', () => {
      assert.file([
        fName
      ]);

      assert.fileContent(fName, 'extends CustomServiceBean');
    });

    it('ensures api.xsp exists', () => {
      assert.file(apiXpg);
    });

    it('defines api endpont in api.xsp', () => {
      assert.fileContent(apiXpg, '<xe:restService');
      assert.fileContent(apiXpg, `pathInfo="${myName}"`);
    });

    it('defines use of the CustomServiceBean', () => {
      assert.fileContent(apiXpg, '<xe:customRestService');
      assert.fileContent(apiXpg, `serviceBean="app.rest.${myProperName}ServiceBean"`);
    });
  });
});
