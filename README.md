# generator-xsp

> a [yeoman](http://yeoman.io/) generator to scaffold an XPages runtime (xsp) compliant On Disk Project (ODP)

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][codecov-image]][codecov-url] [![Codacy Badge][codacy-image]][codacy-url] [![semantic-release][semantic-release-image]][semantic-release-url] [![npm][npm-license]][npm-url] [![PRs Welcome][prs-badge]][prs] [![Roadmap][roadmap-badge]][roadmap] [![Issues][waffle-img]][waffle-link]

[![NPM badge][npm-badge]][npm-url]

## Installation

First, install [Yeoman](http://yeoman.io) and generator-xsp using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-xsp
```

## Use

Then generate your new project:

```bash
mkdir my-new-proj
cd my-new-proj
yo xsp
```

### Example
[![asciicast](https://asciinema.org/a/bttg0m2v4m8l85cnpyoxzofjt.png)](https://asciinema.org/a/bttg0m2v4m8l85cnpyoxzofjt)

## Import to [IBM Domino Designer](https://www.ibm.com/developerworks/downloads/ls/dominodesigner/)

Importing your On Disk Project (ODP) into IBM Domino Designer is the end-goal. This will not work as a full application in its NSF container without being interacted with from a Domino Designer instance.

If you need help getting started with source control and its relationship to Domino/XPages applicaitons, you may wish to get started at [Notes in 9 episode 131: Use SourceTree for Better XPages Source Control](http://www.notesin9.com/2013/11/12/notesin9-131-use-sourcetree-for-better-xpages-source-control/).

### Sub-Generators

A sub-generator is one that creates/scaffolds a _part_ or _parts_ of an _app_. By default, yeoman will generator the entirety of the defined _app_. For example, if one were to [look at generator-angular](https://github.com/yeoman/generator-angular#generators), you would find that you can scaffold an _app_ or a specific _directive_ or _filter_, etc. The format of this follows the basics of `yo xsp:<sub-generator>`.

Available are:

- XPages, `yo xsp:xpage`
- Custom Controls, `yo xsp:cc`
- Java `Class`es, `yo xsp:class`
- Java `Class`es configured as beans, `yo xsp:bean`
- a `CustomRestService` bean and integration into an `api.xsp` XPage via `xe:restService`, `yo xsp:rest`

## [Road Map][roadmap]

### Want More?

Feel free to report bugs [in Issues](https://github.com/edm00se/generator-xsp/issues), and should you have an addition to the road map, [create a Pull Request to this repo, of just this ReadMe.md](README.md), with what you would like added. If you would like to contribute code, read the [CONTRIBUTING guide](CONTRIBUTING.md), then [create a Pull Request](https://github.com/edm00se/generator-xsp/compare).

## License

The code in this project governs my unique contributions and is open, free to use and redistribute or modify, for public or private use, without warranty or liability.

[The MIT License (MIT)](http://choosealicense.com/licenses/mit/) © 2016 Eric McCormick

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[npm-image]: https://badge.fury.io/js/generator-xsp.svg
[npm-url]: https://npmjs.org/package/generator-xsp
[npm-license]: https://img.shields.io/npm/l/generator-xsp.svg
[npm-badge]: https://nodei.co/npm/generator-xsp.png?downloads=true&downloadRank=true&stars=true
[travis-image]: https://travis-ci.org/edm00se/generator-xsp.svg?branch=master
[travis-url]: https://travis-ci.org/edm00se/generator-xsp
[daviddm-image]: https://david-dm.org/edm00se/generator-xsp/status.svg
[daviddm-url]: https://david-dm.org/edm00se/generator-xsp
[codecov-image]: https://codecov.io/github/edm00se/generator-xsp/coverage.svg
[codecov-url]: https://codecov.io/github/edm00se/generator-xsp
[codacy-coverage-image]: https://img.shields.io/codacy/coverage/c44df2d9c89a4809896914fd1a40bedd.svg
[codacy-image]: https://api.codacy.com/project/badge/grade/d2ab498482af4a6fae1f72a39275b36c
[codacy-url]: https://www.codacy.com/app/edm00se/generator-xsp
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[prs]: http://makeapullrequest.com
[roadmap]: https://waffle.io/edm00se/generator-xsp
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg
[waffle-img]: https://badge.waffle.io/edm00se/generator-xsp.png?label=In%20Progress&title=In%20Progress
[waffle-link]: https://waffle.io/edm00se/generator-xsp
