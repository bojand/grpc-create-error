const createMetadata = require('grpc-create-metadata')

module.exports = createGRPCError

/**
 * Utility function that creates an Error suitable for gRPC responses.
 * See tests for all examples
 * @param  {String|Number|Error|Object} message If <code>String</code> the error message
 *                                              If <code>Number</code> the error code
 *                                              If instanceof <code>Error</code>, the error to source data from. We still create a new
 *                                              <code>Error</code> instance, copy data from the passed error and assign / merge the rest
 *                                              of arguments. This can be used to mege metadata of existing error with
 *                                              additional metadata.
 *                                              If <code>Object</code>, assumed to be metadata, either plain object representation
 *                                              or actual <code>grpc.Metadata</code> instance. We use
 *                                              <code>grpc-create-metadata</code> module to create metadata for the
 *                                              return value.
 * @param  {Number|Object} code If <code>Number</code> the error code
 *                              If <code>Object</code>, assumed to be metadata, either plain object representation
 *                              or actual <code>grpc.Metadata</code> instance. We use
 *                              <code>grpc-create-metadata</code> module to create metadata for the
 *                              return value.
 * @param  {Object} metadata The error metadata. Either plain object representation or actual
 *                           <code>grpc.Metadata</code> instance. We use <code>grpc-create-metadata</code>
 *                           module to create metadata for the return value.
 * @return {Error} The new Error
 * @example
 * const createGRPCError = require('create-grpc-error')
 *
 * const err = createGRPCError('Boom', 2000, { ERROR_CODE: 'INVALID_TOKEN' })
 * console.log(err.message) // 'Boom'
 * console.log(err.code) // 2000
 * console.log(err.metadata instanceof grpc.Metadata) // true
 * console.log(err.metadata.getMap()) // { error_code: 'INVALID_TOKEN' }
 *
 * @example <caption>Source from error and merge metadatas</caption>
 * const createGRPCError = require('create-grpc-error')
 *
 * const existingError = new Error('Boom')
 * existingError.metadata = new grpc.Metadata()
 * existingError.metadata.add('foo', 'bar')
 *
 * const err = createGRPCError(existingError, 2000, { ERROR_CODE: 'INVALID_TOKEN' })
 * console.log(err.message) // 'Boom'
 * console.log(err.code) // 2000
 * console.log(err.metadata instanceof grpc.Metadata) // true
 * console.log(err.metadata.getMap()) // { foo: 'bar', error_code: 'INVALID_TOKEN' }
 */
function createGRPCError (message, code, metadata) {
  const err = new Error()
  return applyCreate(err, message, code, metadata)
}

/**
 * Actual function that does all the work.
 * Same as createGRPCError but applies cretion to the existing error.
 * @param  {Error} err The error to apply creation to
 * @param  {String|Number|Error|Object} message See <code>createGRPCError</code> description
 * @param  {Number|Object} code See <code>createGRPCError</code> description
 * @param  {Object} metadata See <code>createGRPCError</code> description
 * @return {Error} See <code>createGRPCError</code> description
 */
function applyCreate (err, message, code, metadata) {
  if (err instanceof Error === false) {
    throw new Error('Source error must be an instance of Error')
  }

  if (message instanceof Error) {
    err.message = message.message.toString()
    if (typeof message.code === 'number') {
      err.code = message.code
    }
    if (typeof message.metadata === 'object') {
      err.metadata = createMetadata(message.metadata)
    }
  }

  const isMsgMD = message instanceof Error
  if (message && typeof message === 'object' && !isMsgMD) {
    metadata = message
    message = ''
    code = null
  }

  if (typeof message === 'number') {
    metadata = code
    code = message
    message = ''
  }

  if (code && typeof code === 'object') {
    metadata = code
    code = null
  }

  if (!metadata) {
    metadata = null
  }

  if (typeof message === 'string') {
    err.message = message
  }

  if (typeof code === 'number') {
    err.code = code
  }

  if (metadata && typeof metadata === 'object') {
    if (err.metadata) {
      const existingMeta = err.metadata && typeof err.metadata.getMap === 'function'
        ? err.metadata.getMap()
        : null

      const md = typeof metadata.getMap === 'function'
        ? metadata.getMap()
        : metadata

      if (existingMeta || md) {
        err.metadata = createMetadata(Object.assign({}, existingMeta || {}, md || {}))
      }
    } else {
      err.metadata = createMetadata(metadata)
    }
  }

  return err
}

createGRPCError.applyCreate = applyCreate
