'use strict';

exports.compress = compress;
exports.decompress = decompress;

const brotli  = require('iltorb');
const through = require('through2');

function getExtension(params) {
  return params && params.extension || 'br';
}

function compress(params) {
  params = params || {};

  const extension = getExtension(params);

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    file.path += '.' + extension;

    if (file.isStream()) {
      file.contents = file.contents.pipe(brotli.compressStream(params));
      cb(null, file);
      return;
    }

    if (file.isBuffer()) {
      brotli.compress(file.contents, params, function(err, output) {
        if (err) {
          cb(err);
          return;
        }
        const skipLarger = params.skipLarger || false;
        if (skipLarger && output.length > file.contents.length) {
          cb();
        } else {
          file.contents = output;
          cb(null, file);
        }
      });
    }
  });
}

function decompress(params) {
  const extension = getExtension(params);
  const reExtension = new RegExp('\\.' + extension + '$', 'i');

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    file.path = file.path.replace(reExtension, '');

    if (file.isStream()) {
      file.contents = file.contents.pipe(brotli.decompressStream());
      cb(null, file);
      return;
    }

    if (file.isBuffer()) {
      brotli.decompress(file.contents, function(err, output) {
        if (err) {
          cb(err);
          return;
        }
        file.contents = output;
        cb(null, file);
      });
    }
  });
}
