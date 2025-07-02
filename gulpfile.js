////////////////////////////////
// Setup
////////////////////////////////

// Gulp and package
const { src, dest, parallel, series, watch } = require('gulp');
const pjson = require('./package.json');

// Plugins
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const tildeImporter = require('node-sass-tilde-importer');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const pixrem = require('pixrem');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const reload = browserSync.reload;
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const spawn = require('child_process').spawn;
const uglify = require('gulp-uglify-es').default;
const npmdist = require('gulp-npm-dist');

// Relative paths function
function pathsConfig(appName) {
  this.app = `./${pjson.name}`;
  const vendorsRoot = 'node_modules';

  return {
    vendorsJs: [
      `${vendorsRoot}/bootstrap/dist/js/bootstrap.js`,
      `${vendorsRoot}/gumshoejs/dist/gumshoe.polyfills.min.js`,
      `${vendorsRoot}/scrollcue/scrollCue.min.js`,
      `${vendorsRoot}/shufflejs/dist/shuffle.min.js`,
    ],
    vendorsCSS: [
      `${vendorsRoot}/swiper/swiper-bundle.min.css`,
    ],
    app: this.app,
    templates: `${this.app}/templates`,
    css: `${this.app}/static/css`,
    scss: `${this.app}/static/scss`,
    fonts: `${this.app}/static/fonts`,
    images: `${this.app}/static/images`,
    js: `${this.app}/static/js`,
    libs: `${this.app}/static/libs`,
  };
}

const paths = pathsConfig();

////////////////////////////////
// Tasks
////////////////////////////////

// Styles autoprefixing and minification
function styles() {
  const processCss = [
    autoprefixer(), // adds vendor prefixes
    pixrem(), // add fallbacks for rem units
  ];

  const minifyCss = [
    cssnano({ preset: 'default' }), // minify result
  ];

  return src(`${paths.scss}/style.scss`)
    .pipe(
      sass({
        importer: tildeImporter,
        includePaths: [paths.scss],
      }).on('error', sass.logError),
    )
    .pipe(plumber()) // Checks for errors
    .pipe(postcss(processCss))
    .pipe(dest(paths.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss(minifyCss)) // Minifies the result
    .pipe(dest(paths.css));
}

// Javascript minification
function scripts() {
  return src([`${paths.js}/app.js`, `${paths.js}/swiper.js`])
      .pipe(plumber()) // Checks for errors
      .pipe(uglify()) // Minifies the js
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.js));
}

// Vendor Javascript minification
function vendorScripts() {
  return src(paths.vendorsJs, { sourcemaps: true })
    .pipe(concat('vendors.js'))
    .pipe(dest(paths.js))
    .pipe(plumber()) // Checks for errors
    .pipe(uglify()) // Minifies the js
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.js, { sourcemaps: '.' }));
}

const plugins = function () {
  const out = paths.app + "/static/libs/";
  return src(npmdist(), {base: "./node_modules"})
      .pipe(rename(function (path) {
          path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
      }))
      .pipe(dest(out));
};


// Image compression
function imgCompression() {
  return src(`${paths.images}/*`)
    .pipe(imagemin()) // Compresses PNG, JPEG, GIF and SVG images
    .pipe(dest(paths.images));
}

// Watch
function watchPaths() {
  watch(`${paths.scss}/**/**.scss`, styles);
  watch(`${paths.templates}/**/*.html`).on('change', reload);
  watch([`${paths.js}/**/**.js`, `!${paths.js}/*.min.js`]).on(
    'change',
    reload,
  );
}

// Generate all assets
const generateAssets = parallel(styles, vendorScripts, scripts, plugins, imgCompression);

// Set up dev environment
const dev = parallel(watchPaths);

exports.default = series(generateAssets, dev);
exports['generate-assets'] = generateAssets;
exports['dev'] = dev;
