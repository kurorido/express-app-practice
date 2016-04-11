var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass');

var concat = require('gulp-concat'),
    minifyCSS  = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    rename     = require("gulp-rename");

// gulp.task('sass', function () {
//   gulp.src('./resources/css/*.scss')
//     .pipe(plumber())
//     .pipe(sass())
//     .pipe(gulp.dest('./public/css'))
//     .pipe(livereload());
// });

gulp.task('concat-vendor-css', function() {
  return gulp.src([
    './resources/bower_components/bootstrap/dist/css/bootstrap.min.css',
    './resources/bower_components/boostrap-social/bootstrap-social.css'])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('minify-vendor-css', function() {
  return gulp.src('./build/css/vendor.css')
    .pipe(minifyCSS{
      keepBreaks: true
    })
    .pipe(rename function(path) {
      path.basename += '.min';
      path.extname = '.css';
    })
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('concat-vendor-js', function() {
  return gulp.src([
    './resources/bower_components/bootstrap/dist/js/bootstrap.min.js',
    './resources/bower_components/jquery/dist/jquery.min.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('uglify-vendor-js', function() {
  return gulp.src('./build/js/vendor.js')
      .pipe(uglify())
      .pipe(rename(function(path) {
          path.basename += ".min";
          path.extname = ".js";
      }))
      .pipe(gulp.dest('./public/js/'));
});

gulp.task('copy-vendor', function() {
  // Javascripts
  gulp.src([
    './resources/bower_components/bootstrap/dist/js/bootstrap.min.js',
  ]).pipe(gulp.dest('./public/js/'));

  // CSS
  gulp.src([
    './resources/bower_components/bootstrap/dist/css/bootstrap.min.css',
    './resources/bower_components/font-awesome/css/font-awesome.min.css',
  ]).pipe(gulp.dest('./public/css/'));

  // Fonts
  gulp.src([
    './resources/bower_components/bootstrap/dist/fonts/',
    './resources/bower_components/font-awesome/fonts/',
  ]).pipe(gulp.dest('./public/fonts/'));
});

// gulp.task('watch', function() {
//   gulp.watch('./public/css/*.scss', ['sass']);
// });

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee ejs',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);

gulp.task('vendor-build', [
  'concat-vendor-css',
  'minify-vendor-css',
  'concat-vendor-js',
  'uglify-vendor-js'
]);