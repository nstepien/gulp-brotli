'use strict';

var assert = require('assert');
var es = require('event-stream');
var File = require('vinyl');
var brotli = require('../');

describe('gulp-brotli', function() {
  describe('streaming mode', function() {
    it('should compress and decompress', function(done) {
      var fakeFile = new File({
        path: '/test/file',
        contents: es.readArray(['stream', 'with', 'those', 'contents'])
      });

      var compresser = brotli.compress();
      compresser.write(fakeFile);
      assert.equal(fakeFile.path, '/test/file.br');

      compresser.pipe(brotli.decompress()).once('data', function(file) {
        assert(file.isStream());
        assert.equal(file.path, '/test/file');

        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data.toString(), 'streamwiththosecontents');
          done();
        }));
      });
    });
  });

  describe('buffer mode', function() {
    it('should compress and decompress', function(done) {
      var fakeFile = new File({
        path: '/test/file',
        contents: new Buffer('abufferwiththiscontent')
      });

      var compresser = brotli.compress();
      compresser.write(fakeFile);
      assert.equal(fakeFile.path, '/test/file.br');

      compresser.pipe(brotli.decompress()).once('data', function(file) {
        assert(file.isBuffer());
        assert.equal(file.path, '/test/file');

        assert.equal(file.contents.toString(), 'abufferwiththiscontent');
        done();
      });
    });
  });
});
