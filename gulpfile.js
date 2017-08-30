var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var obfuscate = require('gulp-javascript-obfuscator');
var uglify = require('gulp-uglify');
var bytediff = require('gulp-bytediff');
var plumber = require('gulp-plumber');
 
gulp.task('default', function () {
    return gulp.src('./source/app.module.js')
    	.pipe(plumber())
			.pipe(bytediff.start())
    			.pipe(ngAnnotate())
				.pipe(obfuscate())
				.pipe(uglify({mangle: true}))
			.pipe(bytediff.stop())
		.pipe(plumber.stop())
        .pipe(gulp.dest('./static/js'));
});