'use strict';

const assert = require('assert');
const { Readable } = require('stream');
const { basename } = require('path');
const es = require('event-stream');
const File = require('vinyl');
const brotli = require('../');

describe('gulp-brotli', function() {
  describe('streaming mode', function() {
    it('should compress and decompress', function(done) {
      const fakeFile = new File({
        cwd: '/',
        base: '/test/',
        path: '/test/file',
        contents: new Readable({objectMode: true}).wrap(es.readArray(['stream', 'with', 'those', 'contents']))
      });

      const compresser = brotli.compress();
      compresser.write(fakeFile);
      assert.equal(basename(fakeFile.path), 'file.br');

      compresser.pipe(brotli.decompress()).once('data', function(file) {
        assert(file.isStream());
        assert.equal(basename(file.path), 'file');

        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data.toString(), 'streamwiththosecontents');
          done();
        }));
      });
    });
  });

  describe('custom extension', function() {
    it('should support custom extensions', function(done) {
      const fakeFile = new File({
        path: '/test/file',
        contents: new Readable({objectMode: true}).wrap(es.readArray(['this', 'is', 'custom', 'brotli']))
      });

      const compresser = brotli.compress({
        extension: 'brotli'
      });
      compresser.write(fakeFile);
      assert.equal(basename(fakeFile.path), 'file.brotli');

      compresser.pipe(brotli.decompress({ extension: 'brotli' })).once('data', function(file) {
        assert(file.isStream());
        assert.equal(basename(file.path), 'file');

        file.contents.pipe(es.wait(function(err, data) {
          assert.equal(data.toString(), 'thisiscustombrotli');
          done();
        }));
      });
    });
  });

  describe('buffer mode', function() {
    it('should compress and decompress', function(done) {
      const fakeFile = new File({
        path: '/test/file',
        contents: Buffer.from('abufferwiththiscontent')
      });

      const compresser = brotli.compress();
      compresser.write(fakeFile);
      assert.equal(basename(fakeFile.path), 'file.br');

      compresser.pipe(brotli.decompress()).once('data', function(file) {
        assert(file.isBuffer());
        assert.equal(basename(file.path), 'file');

        assert.equal(file.contents.toString(), 'abufferwiththiscontent');
        done();
      });
    });
  });

  describe('skip if larger', function() {
    it('should skip larger outputs', function(done) {
      const fakeFile = new File({
        path: '/test/file',
        contents: Buffer.from('tiny buffer')
      });

      const compresser = brotli.compress({ skipLarger: true });
      compresser.once('data', function(file) {
        assert.fail(file, null, 'This file should have been skipped.');
      });
      compresser.once('end', done);

      compresser.write(fakeFile);
      compresser.end();
    });

    it('should not skip smaller outputs', function(done) {
      const fakeFile = new File({
        path: '/test/file',
        contents: Buffer.from('ababababababababab')
      });

      const uncompressedSize = fakeFile.contents.length;
      const compresser = brotli.compress({ skipLarger: true });
      let compressed = false;
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
