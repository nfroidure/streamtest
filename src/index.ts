import { Readable, Writable } from 'node:stream';

const StreamTest = {
    fromObjects: function fromObjects<T>(objects: T[] = [], timeout: number = 0): Readable {
      const stream = new Readable({ objectMode: true });
      const objectsLeft = objects.slice();

      stream._read = () => {
        if (objectsLeft.length) {
          const object: T = objectsLeft.shift() as T;

          setTimeout(() => {
            stream.push(object);
          }, timeout);
        } else {
          setTimeout(() => {
            stream.push(null);
          }, timeout);
        }
      };
      return stream;
    },
    fromErroredObjects: function fromErroredObjects<T>(err: Error, objects: T[] = [], timeout = 0) {
      const stream = new Readable({ objectMode: true });
      const objectsLeft = objects.slice();
      let emitted = false;

      stream._read = () => {
        
        if (objectsLeft.length) {
          const object:T = objectsLeft.shift() as T;

          setTimeout(() => {
            stream.push(object);
          }, timeout);
        } else if(!emitted) {
          setTimeout(() => {
            stream.emit('error', err);
          }, timeout);
          emitted = true;
        } else {
          setTimeout(() => {
            stream.push(null);
          }, timeout);
        }
      };
      return stream;
    },
    fromChunks: function fromChunks(chunks: Buffer[] = [], timeout: number = 0) {
      const stream = new Readable();
      const chunksLeft = chunks.slice();

      stream._read = () => {
        if (chunksLeft.length) {
          const chunk: Buffer = chunksLeft.shift() as Buffer;

          setTimeout(() => {
            stream.push(chunk);
          }, timeout);
        } else {
          setTimeout(() => {
            stream.push(null);
          }, timeout);
        }
      };
      return stream;
    },
    fromErroredChunks: function fromErroredChunks(err: Error, chunks: Buffer[] = [], timeout: number = 0) {
      const stream = new Readable();
      const chunksLeft = chunks.slice();
      let emitted = false;

      stream._read = () => {
        if (chunksLeft.length) {
          const chunk: Buffer = chunksLeft.shift() as Buffer;

          setTimeout(() => {
            stream.push(chunk);
          }, timeout);
        } else if(!emitted) {
          setTimeout(() => {
            stream.emit('error', err);
          }, timeout);
          emitted = true;
        } else {
          setTimeout(() => {
            stream.push(null);
          }, timeout);
        }
      };
      return stream;
    },
    toObjects: function toObjects<T>(): [Writable, Promise<T[]>] {
      const stream = new Writable({ objectMode: true });
      const promise = new Promise<T[]>((resolve, reject) => {
        const objs: T[] = [];

        stream._write = (obj: T, _unused, done) => {
          objs.push(obj);
          done();
        };
        stream.on('error', (err) => {
          reject(err);
        });
        stream.on('finish', () => {
          resolve(objs);
        });
      });
  
      return [stream, promise];
    },
    toChunks: function toChunks(): [Writable, Promise<Buffer[]>] {
      const stream = new Writable();
        const promise = new Promise<Buffer[]>((resolve, reject) => {
          const chunks: Buffer[] = [];

          stream._write = (chunk: Buffer, encoding, done) => {
            if (encoding === 'binary') {
              chunks.push(chunk);
            } else {
              chunks.push(Buffer.alloc(chunk.length, chunk, encoding));
            }
            done();
          };
          stream.on('finish', () => {
            resolve(chunks);
          });
          stream.on('error', (err) => {
            reject(err);
          });
        });
    
        return [stream, promise];
    },
    toText: function toText(): [Writable, Promise<string>] {
      const [stream, promise] = StreamTest.toChunks();

      return [stream, promise.then(chunks => 
        Buffer.concat(chunks).toString()
      )]
    },
};

export default StreamTest;
