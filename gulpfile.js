var gulp = require('gulp'),
	jsmin = require('gulp-jsmin'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish')


gulp.task('default', function(){
	gulp.run('js');

	gulp.watch('js/robin-jsp.js', function(){
		gulp.run('js');
	})
});

gulp.task('js', function(){
	return gulp.src('js/robin-jsp.js')
			.pipe(gulp.dest('examples/js')) //get the unchanged source to the examples dir
			.pipe(jsmin()) // minify it
			.pipe(uglify()) // uglify it
			.pipe(rename('robin-jsp.min.js')) //rename it to *.min.js
			.pipe(gulp.dest('js')) //save it to the js dir
			.pipe(gulp.dest('examples/js')) //save it to the examples dir
});

gulp.task('lint', function(){
	return gulp.src('js/robin-jsp.js')
			.pipe(jshint())
			.pipe(jshint.reporter(stylish));
});