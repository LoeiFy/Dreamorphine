
var gulp = require('gulp'),
    fs = require('fs'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    jshint = require('gulp-jshint'),
    replace = require('gulp-replace-task');

gulp.task('post', function() {
    return gulp.src('posts/*')
        .pipe(concat('posts', {newLine: ','}))
        .pipe(gulp.dest('temp/'))
})

gulp.task('replace', ['post'], function() {
    return gulp.src('assets/index.html')
        .pipe(replace({
            patterns: [
                {
                    match: 'posts',
                    replacement: fs.readFileSync('temp/posts', 'utf8')
                }
            ]
        }))
        .pipe(gulp.dest('./'))
})

gulp.task('server', ['replace'], function () {
    return connect.server({
        port: 2222,
        livereload: true
    })
})

gulp.task('watch', ['replace'], function() {
    gulp.watch(['assets/*'], ['reload']);
})

gulp.task('reload', ['replace'], function () {
    gulp.src(['assets/*.js', '!assets/zepto.js'])
        .pipe(jshint({asi:true}))
        .pipe(jshint.reporter('default'))
        .pipe(connect.reload())
})

gulp.task('default', ['reload', 'server', 'watch'])
