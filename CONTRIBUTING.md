# Contributing

[Pull Requests](https://github.com/edm00se/generator-xsp/compare) are welcome! We *should* cover a couple of items first, prior to your submitting one.

- keep your [commits as atomic as possible](https://en.wikipedia.org/wiki/Atomic_commit)
- try to keep new features (sub-generators, configurations, etc.) as un-opionated as possible
- opinionated features are perfectly okay, so long as
  - it's a choice
  - the default option is to whatever the "normal" configuration is (for most XPages applications)
  - this can be tricky, feel free to ask for review or help
- this is a [yeoman](http://yeoman.io/) generator
  - documentation is available
- read the below [code of conduct](#code-of-conduct)

# Committing

- to test locally, remove any previously installed (global) `generator-xsp` and
  - `git clone https://github.com/edm00se/generator-xsp.git`
  - `cd generator-xsp`
  - `npm link`
    - [running this](https://docs.npmjs.com/cli/link) this will establish this freshly cloned copy of the repository as the npm module that yeoman will use when `yo xsp` is invoked
    - you may save any changes and use it immediately
- this project makes use of [eslint](http://npm.im/eslint)
  - don't fight it
  - this is invoked in modern editors such as [Atom](https://atom.io) or [VS Code](https://code.visualstudio.com/)
  - you can set [the eslint plugin for Atom's settings to run `eslint --fix` on file save](https://twitter.com/codeheroics/status/752800318367338497), so you don't have to fix simple syntax differences yourself
  - eslint is also invoked during `npm test` and git pre-commit occurrences, it will be checked for!
- this project uses [commitizen](http://npm.im/commitizen) for commits; use `npm run commit` and follow the prompts
- this project uses [semantic-release](http://npm.im/semantic-release), so no direct meddling with the version number in the `package.json`
- part of the pre-commit check will also perform the test script and perform a code coverage check, enforcing to an overall 90% or above

# Code of Conduct

As above, you are free to fork / submit a PR to this project. I ask you to:

1. recognize that this project does nothing more than script out the specifics to let you, the user, generate your own application
2. the code you generate is yours, not mine
3. this project creates/interacts with the On Disk Project (ODP) and will require importing to IBM Domino Designer (DDE) for use as a full application
  - if this is a foreign concept to you, please go get familiar with it (an excellent place to start is [Notes in 9 131: Use SourceTree for Better XPages Source Control](http://www.notesin9.com/2013/11/12/notesin9-131-use-sourcetree-for-better-xpages-source-control/))
4. you can achieve every single step this generator performs by manually setting up source control for your NSF and performing the routine tasks associated with each
5. if you need help, ask!
