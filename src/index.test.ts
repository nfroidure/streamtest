import { describe, test, expect } from '@jest/globals';
import StreamTest from './index.js';

describe('StreamTest', () => {
  test('should work with buffers', async () => {
    const expectedBuffers = [Buffer.from('test'), Buffer.from('test2')];
    const inputStream = StreamTest.fromChunks(expectedBuffers);
    const [outputStream, resultPromise] = StreamTest.toChunks();

    inputStream.pipe(outputStream);

    expect(await resultPromise).toEqual(expectedBuffers);
  });

  test('should report errors with buffers', async () => {
    const expectedBuffers = [Buffer.from('test'), Buffer.from('test2')];
    const expectedError = new Error('E_ERROR');
    const inputStream = StreamTest.fromErroredChunks(
      expectedError,
      expectedBuffers,
    );
    const [outputStream, resultPromise] = StreamTest.toChunks();

    inputStream.pipe(outputStream);
    inputStream.on('error', (err) => {
      outputStream.emit('error', err);
    });

    try {
      await resultPromise;
      throw new Error('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect(err).toEqual(expectedError);
    }
  });

  test('should report errors and end with buffers', async () => {
    const expectedBuffers = [Buffer.from('test'), Buffer.from('test2')];
    const expectedError = new Error('E_ERROR');
    const inputStream = StreamTest.fromErroredChunks(
      expectedError,
      expectedBuffers,
    );
    const [outputStream, resultPromise] = StreamTest.toChunks();
    let _err;

    inputStream.pipe(outputStream);
    inputStream.on('error', (err) => {
      _err = err;
    });

    await resultPromise;
    expect(_err).toEqual(expectedError);
  });

  test('should work when wanting whole text', async () => {
    const expectedBuffers = ['test', 'test2'];
    const inputStream = StreamTest.fromObjects(expectedBuffers);
    const [outputStream, resultPromise] = StreamTest.toText();

    inputStream.pipe(outputStream);

    expect(await resultPromise).toEqual(expectedBuffers.join(''));
  });

  test('should report errors when wanting whole text', async () => {
    const expectedBuffers = [Buffer.from('test'), Buffer.from('test2')];
    const expectedError = new Error('E_ERROR');
    const inputStream = StreamTest.fromErroredChunks(
      expectedError,
      expectedBuffers,
    );
    const [outputStream, resultPromise] = StreamTest.toText();

    inputStream.pipe(outputStream);
    inputStream.on('error', (err) => {
      outputStream.emit('error', err);
    });

    try {
      await resultPromise;
      throw new Error('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect(err).toEqual(expectedError);
    }
  });

  test('should work with objects', async () => {
    const expectedObjs = [
      {
        test: 'test',
      },
      {
        test: 'test2',
      },
    ];
    const inputStream = StreamTest.fromObjects(expectedObjs);
    const [outputStream, resultPromise] = StreamTest.toObjects();

    inputStream.pipe(outputStream);

    expect(await resultPromise).toEqual(expectedObjs);
  });

  test('should report errors with objects', async () => {
    const expectedObjs = [
      {
        test: 'test',
      },
      {
        test: 'test2',
      },
    ];
    const expectedError = new Error('E_ERROR');
    const inputStream = StreamTest.fromErroredObjects(
      expectedError,
      expectedObjs,
    );
    const [outputStream, resultPromise] = StreamTest.toObjects();

    inputStream.pipe(outputStream);
    inputStream.on('error', (err) => {
      outputStream.emit('error', err);
    });

    try {
      await resultPromise;
      throw new Error('E_UNEXPECTED_SUCCESS');
    } catch (err) {
      expect(err).toEqual(expectedError);
    }
  });

  test('should report errors with objects', async () => {
    const expectedObjs = [
      {
        test: 'test',
      },
      {
        test: 'test2',
      },
    ];
    const expectedError = new Error('E_ERROR');
    const inputStream = StreamTest.fromErroredObjects(
      expectedError,
      expectedObjs,
    );
    const [outputStream, resultPromise] = StreamTest.toObjects();
    let _err;

    inputStream.pipe(outputStream);
    inputStream.on('error', (err) => {
      _err = err;
    });

    await resultPromise;
    expect(_err).toEqual(expectedError);
  });
});
