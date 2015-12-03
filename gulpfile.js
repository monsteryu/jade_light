'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var harp = require('harp');
var compass = require('gulp-compass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
/**
 * Serve the Harp Site from the src directory
 */
gulp.task('serve', function (cb) {
  harp.server('app', {
    port: 9000
  }, function () {
    browserSync({
      proxy: "localhost:9000",
      open: true,
      /* Hide the notification. It gets annoying */
      // notify: {
      //   styles: ['opacity: 0', 'position: absolute']
      // }
    });
    /**
     * Watch for scss changes, tell BrowserSync to refresh main.css
     */
    gulp.watch([ "app/**/*.sass", "app/**/*.scss"],['compass'], function () {
      reload("app.css", {stream: true});
    });
    /**
     * Watch js changes, reload the whole page
     */
    gulp.watch(["app/lib/*.js"],['javascript'], function () {
      return reload();
    });
    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch(["app/*.jade","app/css/*.css"], function () {
      return reload();
    });
  })
  cb();
});
// compile sass & scss 如果只用sass跑這個task就好
gulp.task('sass', function () {
	gulp.src('app/sass/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest('app/css'));
});
// compile sass & scss & compass
gulp.task('compass', function() {
  gulp.src('app/sass/*.scss') //來源路徑
  .pipe(compass({ //這段內輸入config.rb的內容
    css: 'app/css', //compass輸出位置
    sass: 'app/sass', //sass來源路徑
    sourcemap: true, //compass 1.0 sourcemap
    style: 'compact', //CSS壓縮格式，預設(nested)
    comments: false, //是否要註解，預設(true)
    //require: ['susy'] //額外套件 susy
  }))
  .pipe(gulp.dest('app/css')); //輸出位置(非必要)
});
gulp.task('javascript', function() {
  return gulp.src('app/lib/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/js'));
});
 
gulp.task('default', ['javascript','serve']);