# gulp-brotli

[![NPM Version][npm-badge]][npm-url] [![Build Status][travis-badge]][travis-url]

[gulp-brotli](https://www.npmjs.com/package/gulp-brotli) is a [gulp](https://github.com/gulpjs/gulp) plugin for file compression/decompression using the [brotli](https://github.com/google/brotli) compression library via [iltorb](https://github.com/MayhemYDG/iltorb).

## Usage

### Install

```
npm install gulp-brotli
```

### Options

You can specify an optional `options` object that is passed on to [iltorb](https://github.com/MayhemYDG/iltorb#brotliparams) for compression, and accepts the following additional properties:

#### extension `String`

Defaults to `br`. Should not include a starting dot.

#### skipLarger `Boolean`

Enable this option to skip the compressed buffer if it is bigger than the input.

Defaults to `false`.

Note: this option will be ignored if the input is not passed to `gulp-brotli` as a buffer. For example by setting the `gulp.src` "[buffer](https://github.com/gulpjs/gulp/blob/master/docs/API.md#optionsbuffer)" option to false.

---

### compress([options])

#### Default compression

Output files will have the `.br` extension.

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

Files are processed with maximum compression, output files will have the `.brotli` extension, and compressed outputs that are larger than the input will not be written to disk.

```javascript
var gulp   = require('gulp');
var brotli = require('gulp-brotli');

gulp.task('example', function() {
  return gulp.src('path/to/input')
    .pipe(brotli.compress({
      extension: 'brotli',
      skipLarger: true,
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

Output files will have the `.brotli` extension removed.

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
