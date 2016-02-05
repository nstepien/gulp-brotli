# gulp-brotli

[![NPM Version][npm-badge]][npm-url] [![Build Status][travis-badge]][travis-url]

[gulp-brotli](https://www.npmjs.com/package/gulp-brotli) is a [gulp](https://github.com/gulpjs/gulp) plugin for file compression/decompression using the [brotli](https://github.com/google/brotli) compression library via [iltorb](https://github.com/MayhemYDG/iltorb).

## Usage

### Install

```
npm install gulp-brotli
```

## Options

### options `Object`

Object that is passed on to [iltorb](https://github.com/MayhemYDG/iltorb#brotliparams).

Besides the options for [iltorb](https://github.com/MayhemYDG/iltorb#brotliparams) the following properties can be set on the options object.

#### extension `String`

Appends a given extension to the filename. Defaults to `br`. Should not include a starting dot.

## Examples

### compress([options])

#### Default compression

Output files have the `.br` extension.

```javascript
var gulp   = require('gulp');
var brotli = require('gulp-brotli');

gulp.task('example', function() {
  return gulp.src('path/to/input')
    .pipe(brotli.compress())
    .pipe(gulp.dest('path/to/output'));
});
```

#### Custom compression

Files are processed with maximum compression and output files have the `.brotli` extension.

```javascript
var gulp   = require('gulp');
var brotli = require('gulp-brotli');

gulp.task('example', function() {
  return gulp.src('path/to/input')
    .pipe(brotli.compress({
      extension: 'brotli',
      mode: 0,
      quality: 11,
      lgblock: 0
    }))
    .pipe(gulp.dest('path/to/output'));
});
```

### decompress([options])

#### Default decompression

Output files will have the `.br` extension removed.

```javascript
var gulp   = require('gulp');
var brotli = require('gulp-brotli');

gulp.task('example', function() {
  return gulp.src('path/to/input')
    .pipe(brotli.decompress())
    .pipe(gulp.dest('path/to/output'));
});
```

#### Custom decompression

Files with the `.brotli` extension are processed. Output files will have the `.brotli` extension removed.

```javascript
var gulp   = require('gulp');
var brotli = require('gulp-brotli');

gulp.task('example', function() {
  return gulp.src('path/to/input')
    .pipe(brotli.decompress({
      extension: 'brotli'
    }))
    .pipe(gulp.dest('path/to/output'));
});
```

[npm-badge]: https://img.shields.io/npm/v/gulp-brotli.svg
[npm-url]: https://www.npmjs.com/package/gulp-brotli
[travis-badge]: https://img.shields.io/travis/MayhemYDG/gulp-brotli.svg
[travis-url]: https://travis-ci.org/MayhemYDG/gulp-brotli
