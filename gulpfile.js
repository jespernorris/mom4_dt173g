const {src, dest, watch, series, parallel} = require('gulp');
const concat = require('gulp-concat'); // Slå ihop filer
const terser = require('gulp-terser').default; // Komprimera JS
const cleanCSS = require('gulp-clean-css'); // Komprimera CSS
const htmlmin = require('gulp-htmlmin'); // Komprimera HTML
const browserSync = require('browser-sync').create(); // laddar om vid sparning
const sourcemaps = require('gulp-sourcemaps'); // Kartlägger kod
const babel = require('gulp-babel');

// Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    cssPath: "src/**/*.css",
    jsPath: "src/**/*.js"
}

// HTML-task, kopierar filer
function htmlTask() {
    return src(files.htmlPath)
    .pipe(browserSync.stream())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub'))
}

// JS-task, konkatenera filer
function jsTask() {
    return src(files.jsPath)
    .pipe(browserSync.stream())
    .pipe(babel({
        presets: ["@babel/preset-env"]
    }))
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'))
}

// CSS-task, konkatenera filer
function cssTask() {
    return src(files.cssPath)
    .pipe(browserSync.stream())
    .pipe(concat('main.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/style'))
}

// Watch
function watchTask() {
    browserSync.init({
        server: {
            baseDir: 'pub/'
        }
    });
    watch([files.htmlPath, files.jsPath, files.cssPath], parallel(htmlTask, jsTask, cssTask));
}

exports.default = series(
    parallel(htmlTask, jsTask, cssTask),
    watchTask
);