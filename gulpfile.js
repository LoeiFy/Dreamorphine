
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

    if (!fs.existsSync('./pages')) {
        fs.mkdirSync('./pages')
    }

    var lists = fs.readFileSync('temp/posts', 'utf8');
    var info = ["Dreamorphine##A growing collection of album covers."];
    lists = JSON.parse('['+ lists +']').reverse();
    lists.unshift(info)

    var chunk = 15;

    for (var i = 0; i < lists.length; i += chunk) {
        var list = lists.slice(i, i + chunk).join('@@');
        fs.writeFileSync('./pages/'+ (i / chunk), list, 'utf8');
    }

    return gulp.src('assets/index.html')
        .pipe(replace({
            patterns: [
                {
                    match: 'posts',
                    replacement: fs.readFileSync('./pages/0', 'utf8')
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
