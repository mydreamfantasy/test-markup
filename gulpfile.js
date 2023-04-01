// import gulp from "gulp";
// import plumber from "gulp-plumber";
// import dartSass from "sass";
// import gulpSass from "gulp-sass";
// import postcss from "gulp-postcss";
// import postUrl from "postcss-url";
// import autoprefixer from "autoprefixer";
// import csso from "postcss-csso";
// import terser from "gulp-terser";
// import svgo from "gulp-svgmin";
// import { deleteAsync } from "del";
// import browser from "browser-sync";
// import bemlinter from "gulp-html-bemlinter";
// import { htmlValidator } from "gulp-w3c-html-validator";
// import imagemin from "gulp-imagemin";

// const sass = gulpSass(dartSass);
// let isDevelopment = true;

// export function processMarkup() {
//   return gulp.src("source/*.html").pipe(gulp.dest("build"));
// }

// export function lintBem() {
//   return gulp.src("source/*.html").pipe(bemlinter());
// }

// export function validateMarkup() {
//   return gulp
//     .src("source/*.html")
//     .pipe(htmlValidator.analyzer())
//     .pipe(htmlValidator.reporter({ throwErrors: true }));
// }

// export function processStyles() {
//   return gulp
//     .src("source/sass/*.scss", { sourcemaps: isDevelopment })
//     .pipe(plumber())
//     .pipe(sass().on("error", sass.logError))
//     .pipe(postcss([postUrl({ assetsPath: "../" }), autoprefixer(), csso()]))
//     .pipe(gulp.dest("build/css", { sourcemaps: isDevelopment }))
//     .pipe(browser.stream());
// }

// export function processScripts() {
//   return gulp
//     .src("source/js/**/*.js")
//     .pipe(terser())
//     .pipe(gulp.dest("build/js"))
//     .pipe(browser.stream());
// }

// export function optimizeImages() {
//   return gulp
//     .src("source/img/**/*.{png,jpg}")
//     .pipe(imagemin())
//     .pipe(gulp.dest("build/img"));
// }

// export function optimizeVector() {
//   return gulp
//     .src(["source/img/**/*.svg"])
//     .pipe(svgo())
//     .pipe(gulp.dest("build/img"));
// }

// export function copyAssets() {
//   return gulp
//     .src(["source/*.ico", "source/manifest.webmanifest"], {
//       base: "source",
//     })
//     .pipe(gulp.dest("build"));
// }

// export function startServer(done) {
//   browser.init({
//     server: {
//       baseDir: "build",
//     },
//     cors: true,
//     notify: false,
//     ui: false,
//   });
//   done();
// }

// function reloadServer(done) {
//   browser.reload();
//   done();
// }

// function watchFiles() {
//   gulp.watch("source/sass/**/*.scss", gulp.series(processStyles));
//   gulp.watch("source/js/script.js", gulp.series(processScripts));
//   gulp.watch("source/*.html", gulp.series(processMarkup, reloadServer));
// }

// function compileProject(done) {
//   gulp.parallel(
//     processMarkup,
//     processStyles,
//     processScripts,
//     optimizeVector,
//     copyAssets,
//     optimizeImages
//   )(done);
// }

// function deleteBuild() {
//   return deleteAsync("build");
// }

// export function buildProd(done) {
//   isDevelopment = false;
//   gulp.series(deleteBuild, compileProject)(done);
// }

// export function runDev(done) {
//   gulp.series(deleteBuild, compileProject, startServer, watchFiles)(done);
// }

import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";

// Styles

export const styles = () => {
  return gulp
    .src("source/sass/style.scss", { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("source/css", { sourcemaps: "." }))
    .pipe(browser.stream());
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: "source",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/*.html").on("change", browser.reload);
};

export default gulp.series(styles, server, watcher);
