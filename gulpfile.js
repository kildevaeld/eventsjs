'use strict';

const gulp = require('gulp'),
      merge = require('merge2'),
      tsc = require('gulp-typescript'),
      webpack = require('webpack-stream');

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

gulp.task('bundle', ['build'], function () {
	return gulp.src('lib/events.js')
	.pipe(webpack({
		output: {
			library: 'eventsjs',
			libraryTarget: 'umd',
			filename: 'events.js'
		}
	}))
	.pipe(gulp.dest('dist'));
});

gulp.task('amd', () => {
	return project.src()
  	.pipe(tsc(project, {
  		module: 'amd'
  	}))
  	.pipe(gulp.dest('amd'));
})

gulp.task('default', ['bundle']);