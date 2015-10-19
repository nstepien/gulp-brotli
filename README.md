# gulp-brotli

[![NPM Version][npm-badge]][npm-url] [![Build Status][travis-badge]][travis-url]

[gulp-brotli](https://www.npmjs.com/package/gulp-brotli) is a [gulp](https://github.com/gulpjs/gulp) plugin for file compression/decompression using the [brotli](https://github.com/google/brotli) compression library via [iltorb](https://github.com/MayhemYDG/iltorb).

## Usage

### Install

```
npm install gulp-brotli
```

### compress([brotliParams])

Output files will have the `.br` suffix added.

The `brotliParams` object will be passed on to [iltorb](https://github.com/MayhemYDG/iltorb#brotliparams);

```javascript
const gulp   = require('gulp');
const brotli = require('gulp-brotli');

gulp.task('example', function() {
  return gulp.src('path/to/input')
    .pipe(brotli.compress())
    .pipe(gulp.dest('path/to/output'));
});
```

### decompress()

Output files will have the `.br` suffix removed.

```javascript
const gulp   = require('gulp');
const brotli = require('gulp-brotli');

gulp.task('example', function() {
  return gulp.src('path/to/input')
    .pipe(brotli.decompress())
    .pipe(gulp.dest('path/to/output'));
});
```

[npm-badge]: https://img.shields.io/npm/v/gulp-brotli.svg
[npm-url]: https://www.npmjs.com/package/gulp-brotli
[travis-badge]: https://img.shields.io/travis/MayhemYDG/gulp-brotli.svg
[travis-url]: https://travis-ci.org/MayhemYDG/gulp-brotli
