# create-grpc-error

Utility function that creates an Error suitable for gRPC responses

[![npm version](https://img.shields.io/npm/v/create-grpc-error.svg?style=flat-square)](https://www.npmjs.com/package/create-grpc-error)
[![build status](https://img.shields.io/travis/bojand/create-grpc-error/master.svg?style=flat-square)](https://travis-ci.org/bojand/create-grpc-error)

### Related

[grpc-error](https://github.com/bojand/grpc-error) - `GRPCError` class that uses this module

## API

<a name="createGRPCError"></a>

### createGRPCError(message, code, metadata) ⇒ <code>Error</code>
Utility function that creates an Error suitable for gRPC responses.
See tests for all examples

**Kind**: global function  
**Returns**: <code>Error</code> - The new Error  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> &#124; <code>Number</code> &#124; <code>Error</code> &#124; <code>Object</code> | If <code>String</code> the error message                                              If <code>Number</code> the error code                                              If instanceof <code>Error</code>, the error to source data from. We still create a new                                              <code>Error</code> instance, copy data from the passed error and assign / merge the rest                                              of arguments. This can be used to mege metadata of existing error with                                              additional metadata.                                              If <code>Object</code>, assumed to be metadata, either plain object representation                                              or actual <code>grpc.Metadata</code> instance. We use                                              <code>grpc-create-metadata</code> module to create metadata for the                                              return value. |
| code | <code>Number</code> &#124; <code>Object</code> | If <code>Number</code> the error code                              If <code>Object</code>, assumed to be metadata, either plain object representation                              or actual <code>grpc.Metadata</code> instance. We use                              <code>grpc-create-metadata</code> module to create metadata for the                              return value. |
| metadata | <code>Object</code> | The error metadata. Either plain object representation or actual                           <code>grpc.Metadata</code> instance. We use <code>grpc-create-metadata</code>                           module to create metadata for the return value. |

**Example**  

```js
const createGRPCError = require('create-grpc-error')

const err = createGRPCError('Boom', 2000, { ERROR_CODE: 'INVALID_TOKEN' })
console.log(err.message) // 'Boom'
console.log(err.code) // 2000
console.log(err.metadata instanceof grpc.Metadata) // true
console.log(err.metadata.getMap()) // { error_code: 'INVALID_TOKEN' }
```

**Example** *(Source from error and merge metadatas)*  

```js
const createGRPCError = require('create-grpc-error')

const existingError = new Error('Boom')
existingError.metadata = new grpc.Metadata()
existingError.metadata.add('foo', 'bar')

const err = createGRPCError(existingError, 2000, { ERROR_CODE: 'INVALID_TOKEN' })
console.log(err.message) // 'Boom'
console.log(err.code) // 2000
console.log(err.metadata instanceof grpc.Metadata) // true
console.log(err.metadata.getMap()) // { foo: 'bar', error_code: 'INVALID_TOKEN' }
```

<a name="applyCreate"></a>

### applyCreate(err, message, code, metadata) ⇒ <code>Error</code>
Actual function that does all the work.
Same as createGRPCError but applies cretion to the existing error.

**Kind**: global function  
**Returns**: <code>Error</code> - See <code>createGRPCError</code> description  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | The error to apply creation to |
| message | <code>String</code> &#124; <code>Number</code> &#124; <code>Error</code> &#124; <code>Object</code> | See <code>createGRPCError</code> description |
| code | <code>Number</code> &#124; <code>Object</code> | See <code>createGRPCError</code> description |
| metadata | <code>Object</code> | See <code>createGRPCError</code> description |

## License

  Apache-2.0
