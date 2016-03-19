var Stream = require('stream');

var StreamTest = {
  versions: ['v1', 'v2'],
  // Node lt 0.10 streams
  v1: {
    readable: function v1Readable(options) {
      var stream = new Stream(options);
      stream.readable = true;
      return stream;
    },
    fromObjects: function v1FromObjects(objects, timeout) {
      var stream = StreamTest.v1.readable();
      StreamTest.v1.__emitToStream(stream, objects || [], timeout);
      return stream;
    },
    fromErroredObjects: function v1FromErroredObjects(err, objects, timeout) {
      var stream = StreamTest.v1.readable();
      StreamTest.v1.__emitToStream(stream, objects || [], timeout, function() {
        stream.emit('error', err);
      });
      return stream;
    },
    fromChunks: function v1FromChunks() {
      return StreamTest.v1.fromObjects.apply(this, arguments);
    },
    fromErroredChunks: function v1FromErroredChunks() {
      return StreamTest.v1.fromErroredObjects.apply(this, arguments);
    },
    __emitToStream: function v1EmitToStream(stream, chunks, timeout, endcb) {
      setTimeout(function() {
        if(!chunks.length) {
          setTimeout(stream.emit.bind(stream, 'end'), timeout || 0);
          if(endcb) {
            endcb();
          }
        } else {
          stream.emit('data', chunks.shift());
          StreamTest.v1.__emitToStream(stream, chunks, timeout, endcb);
        }
      }, timeout || 0);
    },
    writable: function v1Writable(options) {
      var stream = new Stream(options);
      stream.writable = true;
      return stream;
    },
    toObjects: function v1ToObjects(cb) {
      var objs = [];
      var stream = StreamTest.v1.writable();
      stream.write = function(obj) {
        objs.push(obj);
      };
      stream.end = function() {
        cb(null, objs);
      };
      stream.on('error', function(err) {
        cb(err);
      });
      return stream;
    },
    toChunks: function v1ToChunks(cb) {
      var chunks = [];
      var stream = StreamTest.v1.writable();
      stream.write = function(chunk, encoding) {
        chunks.push(Buffer(chunk));
      };
      stream.end = function() {
        cb(null, chunks);
      };
      stream.on('error', function(err) {
        cb(err);
      });
      return stream;
    },
    toText: function v1ToText(cb) {
      return StreamTest.v1.toChunks(function(err, chunks) {
        if(err) {
          return cb(err);
        }
        cb(null, Buffer.concat(chunks).toString());
      });
    },
    syncReadableChunks: function v2SyncReadableChunks(chunks) {
      return StreamTest.v1.readable();
    },
    syncReadableObjects: function v2SyncReadableObjects(chunks) {
      return StreamTest.v1.readable();
    },
    syncWrite: function syncWrite(stream, chunks) {
      chunks = chunks || [];
      if(!chunks.length) {
        stream.emit('end');
      } else {
        stream.emit('data', chunks.shift());
        StreamTest.v1.syncWrite(stream, chunks);
      }
    },
    syncError: function v2SyncError(stream, err, chunks) {
      chunks = chunks || [];
      if(!chunks.length) {
        stream.emit('error', err);
        stream.emit('end');
      } else {
        stream.emit('data', chunks.shift());
        StreamTest.v1.syncWrite(stream, err, chunks);
      }
    }
  },

  // Node gte 0.10 streams
  v2: {
    readable: function v2Readable(options) {
      var stream = new Stream.Readable(options);
      return stream;
    },
    fromObjects: function v2FromObjects(objects, timeout) {
      var stream = StreamTest.v2.readable({objectMode: true});
      objects = objects || [];
      stream._read = function() {
        var object = null;
        if(objects.length) {
          object = objects.shift();
        }
        setTimeout(function() {
          stream.push(object);
        }, timeout || 0);
      };
      return stream;
    },
    fromErroredObjects: function v1FromErroredObjects(err, objects, timeout) {
      var stream = StreamTest.v2.readable({objectMode: true});
      objects = objects || [];
      stream._read = function() {
        var object = null;
        if(objects.length) {
          object = objects.shift();
        } else {
          setTimeout(function() {
            stream.emit('error', err);
          }, timeout || 0);
        }
        setTimeout(function() {
          stream.push(object);
        }, timeout || 0);
      };
      return stream;
    },
    fromChunks: function v2FromChunks(chunks, timeout) {
      var stream = StreamTest.v2.readable();
      chunks = chunks || [];
      stream._read = function() {
        var chunk = null;
        if(chunks.length) {
          chunk = chunks.shift();
        }
        setTimeout(function() {
          stream.push(chunk);
        }, timeout || 0);
      };
      return stream;
    },
    fromErroredChunks: function v2FromErroredChunks(err, chunks, timeout) {
      var stream = StreamTest.v2.readable();
      chunks = chunks || [];
      stream._read = function() {
        var chunk = null;
        if(chunks.length) {
          chunk = chunks.shift();
        } else {
          setTimeout(function() {
            stream.emit('error', err);
          }, timeout || 0);
        }
        setTimeout(function() {
          stream.push(chunk);
        }, timeout || 0);
      };
      return stream;
    },
    writable: function v2Writable(options) {
      var stream = new Stream.Writable(options);
      return stream;
    },
    toObjects: function v2ToObjects(cb) {
      var stream = new StreamTest.v2.writable({objectMode: true});
      var objs = [];
      stream._write = function (obj, unused, done) {
        objs.push(obj);
        done();
      };
      stream.on('finish', function() {
        cb(null, objs);
      });
      stream.on('error', function(err) {
        cb(err);
      });
      return stream;
    },
    toChunks: function v2ToChunks(cb) {
      var stream = new StreamTest.v2.writable();
      var chunks = [];
      stream._write = function (chunk, encoding, done) {
        if(encoding && 'buffer' != encoding) {
          chunk = Buffer(chunk.toString(encoding));
        }
        chunks.push(chunk);
        done();
      };
      stream.on('finish', function() {
        cb(null, chunks);
      });
      stream.on('error', function(err) {
        cb(err);
      });
      return stream;
    },
    toText: function v2ToText(cb) {
      return StreamTest.v2.toChunks(function(err, chunks) {
        if(err) {
          return cb(err);
        }
        cb(null, Buffer.concat(chunks).toString());
      });
    },
    syncReadableChunks: function v2SyncReadableChunks(chunks) {
      return new Stream.PassThrough();
    },
    syncReadableObjects: function v2SyncReadableObjects(chunks) {
      return new Stream.PassThrough({objectMode: true});
    },
    syncWrite: function v2SyncWrite(stream, chunks) {
      chunks = chunks || [];
      if(!chunks.length) {
        stream.end();
      } else {
        stream.write(chunks.shift());
        StreamTest.v2.syncWrite(stream, chunks);
      }
    },
    syncError: function v2SyncError(stream, err, chunks) {
      chunks = chunks || [];
      if(!chunks.length) {
        stream.emit('error', err);
        stream.end();
      } else {
        stream.write(chunks.shift());
        StreamTest.v2.syncError(stream, err, chunks);
      }
    }
  }
};

module.exports = StreamTest;
