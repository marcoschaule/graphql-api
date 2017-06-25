(function(){ 'use strict';

// *****************************************************************************
// Imports
// *****************************************************************************

const del  = require('del');
const gulp = require('gulp');
const ts   = require('gulp-typescript');

const _tsProject          = ts.createProject('tsconfig.json');
const _objSettingsNodemon = require('./nodemon.json');

// *****************************************************************************
// Tasks
// *****************************************************************************

gulp.task('clear', () => {
  return del.sync(['./dist/**'], { dryRun: false });
});

// *****************************************************************************

gulp.task('build', () => _tsProject
  .src()
  .pipe(_tsProject()).js
  .pipe(gulp.dest('./dist'))
);

// *****************************************************************************

gulp.task('copy', () => gulp
  .src([
    './src/**/*.gql',
    './src/**/*.graphql',
  ])
  .pipe(gulp.dest('./dist'))
);

// *****************************************************************************

gulp.task('watch', () => {
  gulp.watch('./src/**', ['build']);
});

// *****************************************************************************

})();
