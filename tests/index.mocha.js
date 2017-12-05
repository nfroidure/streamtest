/* eslint max-nested-callbacks:[0], no-magic-numbers:[0] */
'use strict';

const assert = require('assert');
const StreamTest = require('../src');

describe('StreamTest', () => {
  describe('.versions', () => {
    it('should contain versions', () => {
      assert.equal(StreamTest.versions.join(','), 'v1,v2');
    });
  });

  StreamTest.versions.forEach(version => {
    describe('for ' + version + ' streams', () => {
      it('should work with buffers', done => {
        const expectedBuffers = [new Buffer('test'), new Buffer('test2')];
        const inputStream = StreamTest[version].fromChunks(expectedBuffers);
        const outputStream = StreamTest[version].toChunks((err, buffers) => {
          if (err) {
            done(err);
            return;
          }
          assert.deepEqual(buffers, expectedBuffers);
          done();
        });

        inputStream.pipe(outputStream);
      });

      it('should report errors with buffers', done => {
        const expectedBuffers = [new Buffer('test'), new Buffer('test2')];
        const inputStream = StreamTest[version].fromErroredChunks(
          new Error('Ooops'),
          expectedBuffers
        );
        const outputStream = StreamTest[version].toChunks((err, buffers) => {
          assert(err);
          assert(!buffers);
          done();
        });

        inputStream.on('error', err => {
          outputStream.emit('error', err);
        });
        inputStream.pipe(outputStream);
      });

      it('should work when wanting whole text', done => {
        const expectedBuffers = ['test', 'test2'];
        const inputStream = StreamTest[version].fromObjects(expectedBuffers);
        const outputStream = StreamTest[version].toText((err, buffers) => {
          if (err) {
            done(err);
            return;
          }
          assert.deepEqual(buffers, expectedBuffers.join(''));
          done();
        });

        inputStream.pipe(outputStream);
      });

      it('should report errors when wanting whole text', done => {
        const expectedBuffers = [new Buffer('test'), new Buffer('test2')];
        const inputStream = StreamTest[version].fromErroredChunks(
          new Error('Ooops'),
          expectedBuffers
        );
        const outputStream = StreamTest[version].toText((err, buffers) => {
          assert(err);
          assert(!buffers);
          done();
        });

        inputStream.on('error', err => {
          outputStream.emit('error', err);
        });

        inputStream.pipe(outputStream);
      });

      it('should work with objects', done => {
        const expectedObjs = [
          {
            test: 'test',
          },
          {
            test: 'test2',
          },
        ];
        const inputStream = StreamTest[version].fromObjects(expectedObjs);
        const outputStream = StreamTest[version].toObjects((err, objs) => {
          if (err) {
            done(err);
            return;
          }
          assert.deepEqual(objs, expectedObjs);
          done();
        });

        inputStream.pipe(outputStream);
      });

      it('should report errors with objects', done => {
        const expectedObjs = [
          {
            test: 'test',
          },
          {
            test: 'test2',
          },
        ];
        const inputStream = StreamTest[version].fromErroredObjects(
          new Error('Ooops'),
          expectedObjs
        );
        const outputStream = StreamTest[version].toObjects((err, objs) => {
          assert(err);
          assert(!objs);
          done();
        });

        inputStream.on('error', err => {
          outputStream.emit('error', err);
        });

        inputStream.pipe(outputStream);
      });
    });
  });
});
