var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var obfuscate = require('gulp-obfuscate');
 
gulp.task('default', function () {
    return gulp.src('./source/app.module.js')
    	.pipe(ngAnnotate())
        .pipe(obfuscate())
        .pipe(gulp.dest('./static/js'));
});