var gulp = require('gulp'),
	jsmin = require('gulp-jsmin'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	streamqueue = require('streamqueue'),
	concat       = require('gulp-concat');


gulp.task('default', function(){
	gulp.watch('js/**/*.js', ['lint', 'js']);
});

gulp.task('js', function(){

	return streamqueue({ objectMode: true },
			gulp.src('js/start.js'),
			gulp.src('js/Robin.Utils.PubSub.js'),
			gulp.src('js/Robin.Core.js')
		)
	.pipe(concat('robin-jsp.js'))
	.pipe(gulp.dest('build'))
	.pipe(gulp.dest('examples/js')) //get the unchanged source to the examples dir
	.pipe(uglify()) // uglify it
	.pipe(rename('robin-jsp.min.js')) //rename it to *.min.js
	.pipe(gulp.dest('build')) //save it to the js dir
	.pipe(gulp.dest('examples/js')) //save it to the examples dir

	// return gulp.src('js/robin-jsp.js')
	// 		.pipe(gulp.dest('examples/js')) //get the unchanged source to the examples dir
	// 		.pipe(jsmin()) // minify it
	// 		.pipe(uglify()) // uglify it
	// 		.pipe(rename('robin-jsp.min.js')) //rename it to *.min.js
	// 		.pipe(gulp.dest('js')) //save it to the js dir
	// 		.pipe(gulp.dest('examples/js')) //save it to the examples dir
});

gulp.task('lint', function(){
	return gulp.src('js/robin-jsp.js')
			.pipe(jshint())
			.pipe(jshint.reporter(stylish));
});