import { Readable, Writable } from 'node:stream';

/** @namespace */
const StreamTest = {
  /**
   * Create a readable stream streaming `objects` each
   *  `timeout` milliseconds and then end. Usefull for
   *  testing objectMode based streams.
   * @function
   * @param objects Array<Object>
   * @param timeout number
   * @returns Readable
   */
  fromObjects: function fromObjects<T>(
    objects: T[] = [],
    timeout = 0,
  ): Readable {
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
  /**
   * Create a readable stream streaming `objects` each
   *  `timeout` milliseconds, emit the `err` error and
   *  then end. Usefull for testing `objectMode` based
   *  streams.
   * @function
   * @param err Error
   * @param objects Object[]
   * @param timeout number
   * @returns Readable
   */
  fromErroredObjects: function fromErroredObjects<T>(
    err: Error,
    objects: T[] = [],
    timeout = 0,
  ): Readable {
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
          stream.emit('error', err);
          setTimeout(() => {
            stream.push(null);
          }, timeout);
        }, timeout);
      }
    };
    return stream;
  },
  /**
   * Create a readable stream streaming `chunks` each
   *  `timeout` milliseconds and then end. Usefull for
   *  testing buffer based streams.
   * @function
   * @param chunks Uint8Array[]
   * @param timeout number
   * @returns Readable
   */
  fromChunks: function fromChunks(
    chunks: (Buffer | Uint8Array)[] = [],
    timeout = 0,
  ): Readable {
    const stream = new Readable();
    const chunksLeft = chunks.slice();

    stream._read = () => {
      if (chunksLeft.length) {
        const chunk: Uint8Array = chunksLeft.shift() as Uint8Array;

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
  /**
   * Create a readable stream streaming `chunks` each
   *  `timeout` milliseconds, emit the `err` error and
   *  then end. Usefull for testing buffer based streams.
   * @function
   * @param err Error
   * @param objects Object[]
   * @param timeout number
   * @returns Readable
   */
  fromErroredChunks: function fromErroredChunks(
    err: Error,
    chunks: (Buffer | Uint8Array)[] = [],
    timeout = 0,
  ) {
    const stream = new Readable();
    const chunksLeft = chunks.slice();

    stream._read = () => {
      if (chunksLeft.length) {
        const chunk: Uint8Array = chunksLeft.shift() as Uint8Array;

        setTimeout(() => {
          stream.push(chunk);
        }, timeout);
      } else {
        setTimeout(() => {
          stream.emit('error', err);
          setTimeout(() => {
            stream.push(null);
          }, timeout);
        }, timeout);
      }
    };
    return stream;
  },
  /**
   * Create a writable stream collecting written `objects`
   *  and a promise that resolves when it finishes with
   *  the objects collected.
   * @function
   * @returns [Writable, Promise<Object>]
   */
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
  /**
   * Create a writable stream collecting written `chunks`
   *  and a promise that resolves when it finishes with
   *  the chunks collected.
   * @function
   * @returns [Writable, Promise<Uint8Array[]>]
   */
  toChunks: function toChunks(): [Writable, Promise<Uint8Array[]>] {
    const stream = new Writable();
    const promise = new Promise<Uint8Array[]>((resolve, reject) => {
      const chunks: Uint8Array[] = [];

      stream._write = (chunk, encoding, done) => {
        if (encoding === 'binary') {
          chunks.push(chunk);
        } else {
          chunks.push(
            new Uint8Array(Buffer.alloc(chunk.length, chunk, encoding)),
          );
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
  /**
   * Create a writable stream collecting written text
   *  and a promise that resolves when it finishes with
   *  the whole text content.
   * @function
   * @returns [Writable, Promise<string>]
   */
  toText: function toText(): [Writable, Promise<string>] {
    const [stream, promise] = StreamTest.toChunks();

    return [stream, promise.then((chunks) => Buffer.concat(chunks).toString())];
  },
};

export default StreamTest;
