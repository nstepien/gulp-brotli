'use strict';

exports.compress = compress;
exports.decompress = decompress;

var brotli  = require('iltorb');
var through = require('through2');

function compress(params) {
  params = params || {};

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    file.path += '.br';

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
        file.contents = output;
        cb(null, file);
      });
    }
  });
}

function decompress() {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    file.path = file.path.replace(/\.br$/i, '');

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
