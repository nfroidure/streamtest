'use strict';

const Stream = require('stream');

const StreamTest = {
  versions: ['v1', 'v2'],
  // Node lt 0.10 streams
  v1: {
    readable: function v1Readable(options) {
      const stream = new Stream(options);

      stream.readable = true;
      return stream;
    },
    fromObjects: function v1FromObjects(objects, timeout) {
      const stream = StreamTest.v1.readable();

      StreamTest.v1.__emitToStream(stream, objects || [], timeout);
      return stream;
    },
    fromErroredObjects: function v1FromErroredObjects(err, objects, timeout) {
      const stream = StreamTest.v1.readable();

      StreamTest.v1.__emitToStream(stream, objects || [], timeout, () => {
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
      chunks = chunks.slice();
      setTimeout(() => {
        if (!chunks.length) {
          setTimeout(stream.emit.bind(stream, 'end'), timeout || 0);
          if (endcb) {
            endcb();
          }
        } else {
          stream.emit('data', chunks.shift());
          StreamTest.v1.__emitToStream(stream, chunks, timeout, endcb);
        }
      }, timeout || 0);
    },
    writable: function v1Writable(options) {
      const stream = new Stream(options);

      stream.writable = true;
      return stream;
    },
    toObjects: function v1ToObjects(cb) {
      const objs = [];
      const stream = StreamTest.v1.writable();

      stream.write = (obj) => {
        objs.push(obj);
      };
      stream.end = () => {
        cb(null, objs);
      };
      stream.on('error', (err) => {
        cb(err);
      });
      return stream;
    },
    toChunks: function v1ToChunks(cb) {
      const chunks = [];
      const stream = StreamTest.v1.writable();

      stream.write = (chunk) => {
        chunks.push(Buffer.from(chunk));
      };
      stream.end = () => {
        cb(null, chunks);
      };
      stream.on('error', (err) => {
        cb(err);
      });
      return stream;
    },
    toText: function v1ToText(cb) {
      return StreamTest.v1.toChunks((err, chunks) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null, Buffer.concat(chunks).toString());
      });
    },
    syncReadableChunks: function v1SyncReadableChunks() {
      return StreamTest.v1.readable();
    },
    syncReadableObjects: function v1SyncReadableObjects() {
      return StreamTest.v1.readable();
    },
    syncWrite: function syncWrite(stream, chunks) {
      chunks = chunks || [];
      if (!chunks.length) {
        stream.emit('end');
      } else {
        stream.emit('data', chunks.shift());
        StreamTest.v1.syncWrite(stream, chunks);
      }
    },
    syncError: function v1SyncError(stream, err, chunks) {
      chunks = chunks || [];
      if (!chunks.length) {
        stream.emit('error', err);
        stream.emit('end');
      } else {
        stream.emit('data', chunks.shift());
        StreamTest.v1.syncWrite(stream, err, chunks);
      }
    },
  },

  // Node gte 0.10 streams
  v2: {
    readable: function v2Readable(options) {
      const stream = new Stream.Readable(options);

      return stream;
    },
    fromObjects: function v2FromObjects(objects, timeout) {
      const stream = StreamTest.v2.readable({ objectMode: true });

      objects = objects ? objects.slice() : [];
      stream._read = () => {
        let object = null;

        if (objects.length) {
          object = objects.shift();
        }
        setTimeout(() => {
          stream.push(object);
        }, timeout || 0);
      };
      return stream;
    },
    fromErroredObjects: function v2FromErroredObjects(err, objects, timeout) {
      const stream = StreamTest.v2.readable({ objectMode: true });

      objects = objects ? objects.slice() : [];
      stream._read = () => {
        let object = null;

        if (objects.length) {
          object = objects.shift();
        } else {
          setTimeout(() => {
            stream.emit('error', err);
          }, timeout || 0);
        }
        setTimeout(() => {
          stream.push(object);
        }, timeout || 0);
      };
      return stream;
    },
    fromChunks: function v2FromChunks(chunks, timeout) {
      const stream = StreamTest.v2.readable();

      chunks = chunks ? chunks.slice() : [];
      stream._read = () => {
        let chunk = null;

        if (chunks.length) {
          chunk = chunks.shift();
        }
        setTimeout(() => {
          stream.push(chunk);
        }, timeout || 0);
      };
      return stream;
    },
    fromErroredChunks: function v2FromErroredChunks(err, chunks, timeout) {
      const stream = StreamTest.v2.readable();

      chunks = chunks ? chunks.slice() : [];
      stream._read = () => {
        let chunk = null;

        if (chunks.length) {
          chunk = chunks.shift();
        } else {
          setTimeout(() => {
            stream.emit('error', err);
          }, timeout || 0);
        }
        setTimeout(() => {
          stream.push(chunk);
        }, timeout || 0);
      };
      return stream;
    },
    writable: function v2Writable(options) {
      const stream = new Stream.Writable(options);

      return stream;
    },
    toObjects: function v2ToObjects(cb) {
      const stream = StreamTest.v2.writable({ objectMode: true });
      const objs = [];

      stream._write = (obj, unused, done) => {
        objs.push(obj);
        done();
      };
      stream.on('finish', () => {
        cb(null, objs);
      });
      stream.on('error', (err) => {
        cb(err);
      });
      return stream;
    },
    toChunks: function v2ToChunks(cb) {
      const stream = StreamTest.v2.writable();
      const chunks = [];

      stream._write = (chunk, encoding, done) => {
        if (encoding && 'buffer' !== encoding) {
          chunk = Buffer.from(chunk.toString(encoding));
        }
        chunks.push(chunk);
        done();
      };
      stream.on('finish', () => {
        cb(null, chunks);
      });
      stream.on('error', (err) => {
        cb(err);
      });
      return stream;
    },
    toText: function v2ToText(cb) {
      return StreamTest.v2.toChunks((err, chunks) => {
        if (err) {
          cb(err);
          return;
        }
        cb(null, Buffer.concat(chunks).toString());
      });
    },
    syncReadableChunks: function v2SyncReadableChunks() {
      return new Stream.PassThrough();
    },
    syncReadableObjects: function v2SyncReadableObjects() {
      return new Stream.PassThrough({ objectMode: true });
    },
    syncWrite: function v2SyncWrite(stream, chunks) {
      chunks = chunks || [];
      if (!chunks.length) {
        stream.end();
      } else {
        stream.write(chunks.shift());
        StreamTest.v2.syncWrite(stream, chunks);
      }
    },
    syncError: function v2SyncError(stream, err, chunks) {
      chunks = chunks || [];
      if (!chunks.length) {
        stream.emit('error', err);
        stream.end();
      } else {
        stream.write(chunks.shift());
        StreamTest.v2.syncError(stream, err, chunks);
      }
    },
  },
};

module.exports = StreamTest;
