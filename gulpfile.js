
var gulp = require('gulp'),
    fs = require('fs'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
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
                    replacement: fs.readFileSync('posts/posts', 'utf8')
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
    gulp.watch(['assets/*'], ['reload'])
})

gulp.task('reload', function () {
    connect.reload()
})

gulp.task('default', ['server', 'watch'])
