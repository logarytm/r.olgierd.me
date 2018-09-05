const { src, dest, series } = require('gulp');
const sass = require('gulp-dart-sass');
const rev = require('gulp-rev');
const replace = require('gulp-replace');
const csso = require('gulp-csso');
const cssBase64 = require('gulp-css-base64');

exports.default = series(scss, html);

function html() {
    const revManifest = require('./tmp/rev-manifest.json');

    // Not a robust solution, but gets the job done.
    return src('tmp/index.html')
        .pipe(replace('/index.css', `/${revManifest['index.css']}`))
        .pipe(dest('build'));
}

function scss() {
    return src('src/index.scss')
        .pipe(sass())
        .pipe(csso())
        .pipe(cssBase64())
        .pipe(dest('build'))
        .pipe(rev({ base: '/' }))
        .pipe(dest('build'))
        .pipe(rev.manifest())
        .pipe(dest('tmp'))
        ;
}
