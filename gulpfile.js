const { src, dest, watch, parallel, series } = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const del = require("del");

const ttf2woff2 = require("gulp-ttf2woff2");
const ttf2woff = require("gulp-ttf2woff");

function cleanDist() {
    return del(["dist/**", "!dist/fonts"]);
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
}


function html() {
    return src("app/**/*.html").pipe(dest("dist")).pipe(browserSync.stream());
}

function styles() {
    return src("app/sass/**/*.sass")
        .pipe(sass({ outputStyle: "compressed" }))
        .pipe(concat("style.min.css"))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 7 version"],
                grid: true,
            })
        )
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
}

function js() {
    return src("app/js/**/*.js").pipe(concat("main.min.js")).pipe(uglify()).pipe(dest("dist/js")).pipe(browserSync.stream());
}

function fonts() {
    return src("app/fonts/*.ttf").pipe(ttf2woff()).pipe(dest("dist/fonts")).pipe(src("app/fonts/*.ttf")).pipe(ttf2woff2()).pipe(dest("dist/fonts"));
}

function watching() {
    watch(["app/sass/**/*.sass"], styles);
    watch(["app/js/**/*.js"], js);
    watch(["app/**/*.html"], html);
}

exports.browsersync = browsersync;
exports.html = html;
exports.styles = styles;
exports.js = js;
exports.fonts = fonts;
exports.watching = watching;

exports.default = series(cleanDist, parallel(cleanDist, browsersync, html, styles, js, watching));
