'use strict';
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var eslintConfig = require('./.eslintrc.json');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var codecov = require('gulp-codecov');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');

gulp.task('static', function () {
  return gulp.src(['**/*.js', '!generators/**/templates/**/*.js'])
    .pipe(excludeGitignore())
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
  return gulp.src(['generators/**/*.js', '!generators/**/templates/**/*.js'])
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true,
      thresholds: {global: 90}
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('codecov', function () {
  if (process.env.CI) {
    return gulp.src(path.join([__dirname, '!generators/**/templates/**/*.js'], 'coverage/lcov.info'))
      .pipe(codecov());
  }
  return;
});

gulp.task('watch', function () {
  gulp.watch(['generators/**/*.js', 'test/**'], ['test']);
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test', 'codecov']);
