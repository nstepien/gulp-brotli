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

  describe('custom extension', function() {
    it('should support custom extensions', function(done) {
      var fakeFile = new File({
        path: '/test/file',
        contents: es.readArray(['this', 'is', 'custom', 'brotli'])
      });

      var compresser = brotli.compress({
        extension: 'brotli'
      });
      compresser.write(fakeFile);
      assert.equal(fakeFile.path, '/test/file.brotli');

      compresser.pipe(brotli.decompress({ extension: 'brotli' })).once('data', function(file) {
        assert(file.isStream());
        assert.equal(file.path, '/test/file');

        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data.toString(), 'thisiscustombrotli');
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

  describe('skip if larger', function() {
    it('should skip larger outputs', function(done) {
      var fakeFile = new File({
        path: '/test/file',
        contents: new Buffer('tiny buffer')
      });

      var compresser = brotli.compress({ skipLarger: true });
      compresser.once('data', function(file) {
        assert.fail(file, null, 'This file should have been skipped.');
      });
      compresser.once('end', done);

      compresser.write(fakeFile);
      compresser.end();
    });

    it('should not skip smaller outputs', function(done) {
      var fakeFile = new File({
        path: '/test/file',
        contents: new Buffer('ababababababababab')
      });

      var uncompressedSize = fakeFile.contents.length;
      var compresser = brotli.compress({ skipLarger: true });
      var compressed = false;
      compresser.once('data', function(file) {
        compressed = true;
        assert(file.contents.length < uncompressedSize);
      });
      compresser.once('end', function() {
        assert(compressed);
        done();
      });

      compresser.write(fakeFile);
      compresser.end();
    });
  });
});
