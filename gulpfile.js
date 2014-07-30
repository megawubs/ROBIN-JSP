var gulp = require('gulp'),
	jsmin = require('gulp-jsmin'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	streamqueue = require('streamqueue'),
	concat       = require('gulp-concat');

gulp.task('default', function(){
    gulp.start('lint', 'js');
	gulp.watch('js/**/*.js', ['lint', 'js']);
});

gulp.task('js', function(){

	return streamqueue({ objectMode: true },
			gulp.src('js/Robin.js'),
			gulp.src('js/Robin.Utils.PubSub.js'),
            gulp.src('js/Robin.Utils.js'),
			gulp.src('js/Robin.Storage.js'),
            gulp.src('js/Robin.Animator.js'),
			gulp.src('js/Robin.ButtonMaker.js'),
            gulp.src('js/Robin.PopOver.js'),
			gulp.src('js/Robin.Core.js')
		)
	.pipe(concat('robin-jsp.js'))
	.pipe(gulp.dest('build'))
	.pipe(gulp.dest('examples/js')) //get the unchanged source to the examples dir
	.pipe(uglify()) // uglify it
	.pipe(rename('robin-jsp.min.js')) //rename it to *.min.js
	.pipe(gulp.dest('build')) //save it to the js dir
	.pipe(gulp.dest('examples/js')) //save it to the examples dir
});

gulp.task('lint', function(){
	return gulp.src('./js/*.js')
			.pipe(jshint())
			.pipe(jshint.reporter(stylish));
});

gulp.task('linter', function(){
	gulp.watch('js/**/*.js', ['lint']);
});