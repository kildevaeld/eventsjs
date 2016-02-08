'use strict';

const gulp = require('gulp'),
      merge = require('merge2'),
      tsc = require('gulp-typescript');

const project = tsc.createProject('./tsconfig.json', {
  typescript: require('typescript')
});

gulp.task('build', function () {

  let result = project.src()
  .pipe(tsc(project));

  let js = result.js
  .pipe(gulp.dest('./lib'));

  let dts = result.dts.pipe(gulp.dest('./lib'));

  return merge([js,dts]);

});

gulp.task('default', ['build']);