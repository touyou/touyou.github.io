'use strict';

/*--plug in--*/
const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sassGlob = require('gulp-sass-glob');
const packageImporter = require('node-sass-package-importer');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const csslint = require('gulp-csslint');
const coffee = require('gulp-coffee');
const htmllint = require('gulp-htmllint');
const imagemin = require('gulp-imagemin');
const slim = require('gulp-slim');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const pump = require('pump');
const browserSync = require('browser-sync');
/*--plug in--*/

/*--task--*/
const paths = {
  'scss': './src/scss/',
  'css': './css/',
  'coffee': './src/js/',
  'js': './js/',
  'slim': './src/slim/',
  'html': './'
};
// default
gulp.task('default', ['watch', 'browser-sync']);
// Sass
gulp.task('scss', () => {
  gulp.src(paths.scss + '**/*.scss')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sassGlob({
      ignorePaths: [
        'foundation/_reset.scss'
      ]
    }))
    .pipe(sass({
      importer: packageImporter({
        extensions: ['.scss', '.css']
      }),
      outputStyle: 'expanded'
    }))
    .pipe(postcss([require('css-mqpacker')]))
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream())
});
// CoffeeScript
gulp.task('coffee', () => {
  gulp.src(paths.coffee + '**/*.coffee')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(coffee({
      bare: true
    }))
    .pipe(gulp.dest(paths.js))
    .pipe(browserSync.stream())
});
// uglify
gulp.task('jsmin', (cb) => {
  pump(
    [
      gulp.src(paths.js + '**/*.js'),
      uglify(),
      rename({
        suffix: '.min'
      }),
      gulp.dest(paths.js + 'min')
    ],
    cb
  )
});
// Slim
gulp.task('slim', () => {
  gulp.src(paths.slim + '**/*.slim')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(slim({
      pretty: true
    }))
    .pipe(gulp.dest(paths.html))
    .pipe(browserSync.stream())
});
// watch
gulp.task('watch', () => {
  gulp.watch([paths.scss + '**/*.scss'], ['scss']);
  gulp.watch([paths.coffee + '**/*.coffee'], ['coffee']);
  gulp.watch([paths.slim + '**/*.slim'], ['slim']);
});
// browser-sync
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});
// imagemin
gulp.task('imagemin', () => {
  gulp.src('src/img/**/*.{png,jpg,gif,svg}')
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 4
      }),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      })
    ]))
    .pipe(gulp.dest('./res'))
});
// htmlhint
gulp.task('htmllint', () => {
  gulp.src(paths.html + '**/*.html')
    .pipe(htmllint())
    .pipe(htmllint.reporter())
});
// csslint
gulp.task('csslint', () => {
  gulp.src(paths.css + '**/*.min.css')
    .pipe(cssv({
      'adjoining-classes': false,
      'box-model': false,
      'box-sizing': false,
      'bulletproof-font-face': false,
      'compatible-vendor-prefixes': false,
      'empty-rules': true,
      'display-property-grouping': true,
      'duplicate-background-images': false,
      'duplicate-properties': true,
      'fallback-colors': false,
      'floats': false,
      'font-faces': false,
      'font-sizes': false,
      'gradients': false,
      'ids': false,
      'import': false,
      'important': false,
      'known-properties': true,
      'order-alphabetical': false,
      'outline-none': true,
      'overqualified-elements': false,
      'qualified-headings': false,
      'regex-selectors': false,
      'shorthand': false,
      'star-property-hack': false,
      'text-indent': false,
      'underscore-property-hack': false,
      'unique-headings': false,
      'universal-selector': false,
      'unqualified-attributes': false,
      'vendor-prefix': false,
      'zero-units': true
    }))
    .pipe(csslint.formatter('compact'))
});
/*--task--*/