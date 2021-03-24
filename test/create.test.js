import test from 'ava'
import { status, Metadata } from '@grpc/grpc-js'

import create from '../'

test('create an error just from message', t => {
  const err = create('Boom')
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.true(typeof err.code === 'undefined')
  t.true(typeof err.metadata === 'undefined')
})

test('create an error from message and code as integer', t => {
  const err = create('Boom', 1000)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(typeof err.metadata === 'undefined')
})

test('create an error from message and grpc status code', t => {
  const err = create('Boom', status.INVALID_ARGUMENT)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, status.INVALID_ARGUMENT)
  t.true(typeof err.metadata === 'undefined')
})

test('create an error from message and ignore string error code', t => {
  const err = create('Boom', '1000')
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.true(typeof err.code === 'undefined')
  t.true(typeof err.metadata === 'undefined')
})

test('create an error from message and code as integer and metadata object', t => {
  const err = create('Boom', 1000, { foo: 'bar' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message and code as undefined and metadata object', t => {
  const err = create('Boom', undefined, { foo: 'bar' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.true(typeof err.code === 'undefined')
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message and code as integer and metadata as Metadata', t => {
  const md = new Metadata()
  md.add('foo', 'bar')
  const err = create('Boom', 1000, md)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message and code as metadata object', t => {
  const err = create('Boom', { foo: 'bar' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.true(typeof err.code === 'undefined')
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message and code as Metadata', t => {
  const md = new Metadata()
  md.add('foo', 'bar')
  const err = create('Boom', md)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.true(typeof err.code === 'undefined')
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as metadata object', t => {
  const err = create({ foo: 'bar' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.falsy(err.message)
  t.true(typeof err.code === 'undefined')
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as Metadata', t => {
  const md = new Metadata()
  md.add('foo', 'bar')
  const err = create(md)
  t.truthy(err)
  t.true(err instanceof Error)
  t.falsy(err.message)
  t.true(typeof err.code === 'undefined')
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as Error with just a message', t => {
  const e = new Error('Boom')
  const err = create(e)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.true(typeof err.code === 'undefined')
  t.true(typeof err.metadata === 'undefined')
})

test('create an error from message as Error with a message and integer code', t => {
  const e = new Error('Boom')
  e.code = 1000
  const err = create(e)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(typeof err.metadata === 'undefined')
})

test('create an error from message as Error with a message and ignore string code', t => {
  const e = new Error('Boom')
  e.code = '1000'
  const err = create(e)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.true(typeof err.code === 'undefined')
  t.true(typeof err.metadata === 'undefined')
})

test('create an error from message as Error with a message and integer code and object metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = { foo: 'bar' }
  const err = create(e)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as Error with a message and integer code and Metadata metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = new Metadata()
  e.metadata.add('foo', 'bar')
  const err = create(e)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as Error(message, code<int>, metadata<objcet>) and passed metadata as object', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = { foo: 'bar' }
  const err = create(e, { ERROR_CODE: 'INVALID_TOKEN' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    error_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<Metadata>) and passed metadata as object', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = new Metadata()
  e.metadata.add('foo', 'bar')
  const err = create(e, { ERROR_CODE: 'INVALID_TOKEN' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    error_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<object>) and passed integer code and metadata as object', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = { foo: 'bar' }
  const err = create(e, 2000, { ERROR_CODE: 'INVALID_TOKEN' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 2000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    error_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<Metadata>) and passed integer code and metadata as object', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = new Metadata()
  e.metadata.add('foo', 'bar')
  const err = create(e, 2000, { ERROR_CODE: 'INVALID_TOKEN' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 2000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    error_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<object>) and passed string code and metadata as object', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = { foo: 'bar' }
  const err = create(e, '2000', { ERROR_CODE: 'INVALID_TOKEN' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    error_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<object>) and passed string code and metadata as Metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = new Metadata()
  e.metadata.add('foo', 'bar')
  const err = create(e, '2000', { ERROR_CODE: 'INVALID_TOKEN' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    error_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<object>) and passed integer code and no pased metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = { foo: 'bar' }
  const err = create(e, 2000)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 2000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as Error(message, code<int>, metadata<Metadata>) and passed integer code and no metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = new Metadata()
  e.metadata.add('foo', 'bar')
  const err = create(e, 2000)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 2000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as Error(message, code<int>, metadata<object>) and passed string code and no metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = { foo: 'bar' }
  const err = create(e, '2000')
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as Error(message, code<int>, metadata<Metadata>) and passed string code and no metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = new Metadata()
  e.metadata.add('foo', 'bar')
  const err = create(e, '2000')
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), { foo: 'bar' })
})

test('create an error from message as Error(message, code<int>, metadata<object>) and passed string code and object metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = { foo: 'bar' }
  const err = create(e, '2000', { STATUS_CODE: 'INVALID_TOKEN' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    status_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<Metadata>) and passed string code and Metadata metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = new Metadata()
  e.metadata.add('foo', 'bar')
  const md = new Metadata()
  md.add('STATUS_CODE', 'INVALID_TOKEN')
  const err = create(e, '2000', md)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 1000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    status_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<object>) and passed integer code and object metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = { foo: 'bar' }
  const err = create(e, 2000, { STATUS_CODE: 'INVALID_TOKEN' })
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 2000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    status_code: 'INVALID_TOKEN'
  })
})

test('create an error from message as Error(message, code<int>, metadata<Metadata>) and passed ingeter code and Metadata metadata', t => {
  const e = new Error('Boom')
  e.code = 1000
  e.metadata = new Metadata()
  e.metadata.add('foo', 'bar')
  const md = new Metadata()
  md.add('STATUS_CODE', 'INVALID_TOKEN')
  const err = create(e, 2000, md)
  t.truthy(err)
  t.true(err instanceof Error)
  t.is(err.message, 'Boom')
  t.is(err.code, 2000)
  t.true(err.metadata instanceof Metadata)
  t.deepEqual(err.metadata.getMap(), {
    foo: 'bar',
    status_code: 'INVALID_TOKEN'
  })
})
