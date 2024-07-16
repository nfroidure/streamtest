# API
<a name="StreamTest"></a>

## StreamTest : <code>object</code>
**Kind**: global namespace  

* [StreamTest](#StreamTest) : <code>object</code>
    * [.fromObjects(objects, timeout)](#StreamTest.fromObjects) ⇒
    * [.fromErroredObjects(err, objects, timeout)](#StreamTest.fromErroredObjects) ⇒
    * [.fromChunks(chunks, timeout)](#StreamTest.fromChunks) ⇒
    * [.fromErroredChunks(err, objects, timeout)](#StreamTest.fromErroredChunks) ⇒
    * [.toObjects()](#StreamTest.toObjects) ⇒
    * [.toChunks()](#StreamTest.toChunks) ⇒
    * [.toText()](#StreamTest.toText) ⇒

<a name="StreamTest.fromObjects"></a>

### StreamTest.fromObjects(objects, timeout) ⇒
Create a readable stream streaming `objects` each
 `timeout` milliseconds and then end. Usefull for
 testing objectMode based streams.

**Kind**: static method of [<code>StreamTest</code>](#StreamTest)  
**Returns**: Readable  

| Param | Description |
| --- | --- |
| objects | Array<Object> |
| timeout | number |

<a name="StreamTest.fromErroredObjects"></a>

### StreamTest.fromErroredObjects(err, objects, timeout) ⇒
Create a readable stream streaming `objects` each
 `timeout` milliseconds, emit the `err` error and
 then end. Usefull for testing `objectMode` based
 streams.

**Kind**: static method of [<code>StreamTest</code>](#StreamTest)  
**Returns**: Readable  

| Param | Description |
| --- | --- |
| err | Error |
| objects | Object[] |
| timeout | number |

<a name="StreamTest.fromChunks"></a>

### StreamTest.fromChunks(chunks, timeout) ⇒
Create a readable stream streaming `chunks` each
 `timeout` milliseconds and then end. Usefull for
 testing buffer based streams.

**Kind**: static method of [<code>StreamTest</code>](#StreamTest)  
**Returns**: Readable  

| Param | Description |
| --- | --- |
| chunks | Buffer[] |
| timeout | number |

<a name="StreamTest.fromErroredChunks"></a>

### StreamTest.fromErroredChunks(err, objects, timeout) ⇒
Create a readable stream streaming `chunks` each
 `timeout` milliseconds, emit the `err` error and
 then end. Usefull for testing buffer based streams.

**Kind**: static method of [<code>StreamTest</code>](#StreamTest)  
**Returns**: Readable  

| Param | Description |
| --- | --- |
| err | Error |
| objects | Object[] |
| timeout | number |

<a name="StreamTest.toObjects"></a>

### StreamTest.toObjects() ⇒
Create a writable stream collecting written `objects`
 and a promise that resolves when it finishes with
 the objects collected.

**Kind**: static method of [<code>StreamTest</code>](#StreamTest)  
**Returns**: [Writable, Promise<Object>]  
<a name="StreamTest.toChunks"></a>

### StreamTest.toChunks() ⇒
Create a writable stream collecting written `chunks`
 and a promise that resolves when it finishes with
 the chunks collected.

**Kind**: static method of [<code>StreamTest</code>](#StreamTest)  
**Returns**: [Writable, Promise<Buffer[]>]  
<a name="StreamTest.toText"></a>

### StreamTest.toText() ⇒
Create a writable stream collecting written text
 and a promise that resolves when it finishes with
 the whole text content.

**Kind**: static method of [<code>StreamTest</code>](#StreamTest)  
**Returns**: [Writable, Promise<string>]  
