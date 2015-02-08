var assert = require('assert');
var StreamTest = require('../src');

describe('StreamTest', function() {

  describe('.versions', function() {
  
    it('should contains versions', function() {
      assert.equal(StreamTest.versions.join(','), 'v1,v2')
    })
    
  });
  
  StreamTest.versions.forEach(function(version) {
    describe('for ' + version + ' streams', function() {

      it('should work with buffers', function(done) {
        var expectedBuffers = [Buffer('test'), Buffer('test2')];
        var inputStream = StreamTest[version].fromChunks(expectedBuffers.slice(0));
        var outputStream = StreamTest[version].toChunks(function(err, buffers) {
          if(err) {
            return done(err);
          }
          assert.deepEqual(buffers, expectedBuffers);
          done();
        });
        
        inputStream.pipe(outputStream);
      });

      it('should report errors with buffers', function(done) {
        var expectedBuffers = [Buffer('test'), Buffer('test2')];
        var inputStream = StreamTest[version].fromErroredChunks(new Error('Ooops'), expectedBuffers.slice(0));
        inputStream.on('error', function(err) {
          outputStream.emit('error', err);
        });
        var outputStream = StreamTest[version].toChunks(function(err, buffers) {
          assert(err);
          assert(!buffers);
          done();
        });
        
        inputStream.pipe(outputStream);
      });

      it('should work when wanting whole text', function(done) {
        var expectedBuffers = ['test', 'test2'];
        var inputStream = StreamTest[version].fromObjects(expectedBuffers.slice(0));
        var outputStream = StreamTest[version].toText(function(err, buffers) {
          if(err) {
            return done(err);
          }
          assert.deepEqual(buffers, expectedBuffers.join(''));
          done();
        });
        
        inputStream.pipe(outputStream);
      });

      it('should report errors when wanting whole text', function(done) {
        var expectedBuffers = [Buffer('test'), Buffer('test2')];
        var inputStream = StreamTest[version].fromErroredChunks(new Error('Ooops'), expectedBuffers.slice(0));
        inputStream.on('error', function(err) {
          outputStream.emit('error', err);
        });
        var outputStream = StreamTest[version].toText(function(err, buffers) {
          assert(err);
          assert(!buffers);
          done();
        });
        
        inputStream.pipe(outputStream);
      });

      it('should work with objects', function(done) {
        var expectedObjs = [{
          test: 'test'
        }, {
          test: 'test2'
        }];
        var inputStream = StreamTest[version].fromObjects(expectedObjs.slice(0));
        var outputStream = StreamTest[version].toObjects(function(err, objs) {
          if(err) {
            return done(err);
          }
          assert.deepEqual(objs, expectedObjs);
          done();
        });
        
        inputStream.pipe(outputStream);
      });

      it('should report errors with objects', function(done) {
        var expectedObjs = [{
          test: 'test'
        }, {
          test: 'test2'
        }];
        var inputStream = StreamTest[version].fromErroredObjects(new Error('Ooops'), expectedObjs.slice(0));
        inputStream.on('error', function(err) {
          outputStream.emit('error', err);
        });
        var outputStream = StreamTest[version].toObjects(function(err, objs) {
          assert(err);
          assert(!objs);
          done();
        });
        
        inputStream.pipe(outputStream);
      });

    });

  });
  
});

