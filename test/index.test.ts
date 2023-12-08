import { deepStrictEqual, doesNotThrow, equal } from 'node:assert'
import { test } from 'node:test'

import { e as createEvents } from '../index.js'

test('is empty from the beginning', () => {
  let ee = createEvents()
  deepStrictEqual(ee.e, {})
})

test('adds listeners', () => {
  let ee = createEvents()

  ee.on('one', () => true)
  ee.on('two', () => true)
  ee.on('two', () => true)

  deepStrictEqual(Object.keys(ee.e), ['one', 'two'])
  equal(ee.e.one?.length, 1)
  equal(ee.e.two?.length, 2)
})

test('calls listener', () => {
  let ee = createEvents()
  let calls: number[][] = []
  ee.on('event', (...args) => {
    calls.push(args)
  })

  ee.emit('event')
  ee.emit('event', 11)
  ee.emit('event', 12)
  ee.emit('event', 13)
  ee.emit('event', 14)

  deepStrictEqual(calls, [[undefined], [11], [12], [13], [14]])
})

test('unbinds listener', () => {
  let ee = createEvents()

  let calls1: number[] = []
  let unbind = ee.on('event', a => {
    calls1.push(a)
  })

  let calls2: number[] = []
  ee.on('event', a => {
    calls2.push(a)
  })

  ee.emit('event', 1)
  unbind()
  ee.emit('event', 2)

  deepStrictEqual(calls1, [1])
  deepStrictEqual(calls2, [1, 2])
})

test('calls unbind after cleaning events', () => {
  let ee = createEvents()
  let unbind = ee.on('event', () => undefined)
  ee.e = {}
  doesNotThrow(() => {
    unbind()
  })
})

test('removes event on no listeners', () => {
  let ee = createEvents()
  let unbind1 = ee.on('one', () => {})
  let unbind2 = ee.on('one', () => {})

  unbind1()
  equal(ee.e.one?.filter(Boolean).length, 1)

  unbind1()
  equal(ee.e.one?.filter(Boolean).length, 1)

  unbind2()
  equal(ee.e.one?.filter(Boolean).length, 0)

  unbind2()
  equal(ee.e.one?.filter(Boolean).length, 0)
})

test('removes listener during event', () => {
  let ee = createEvents()

  let calls: number[] = []
  let remove1 = ee.on('event', () => {
    remove1()
    calls.push(1)
  })
  ee.on('event', () => {
    calls.push(2)
  })

  ee.emit('event')
  deepStrictEqual(calls, [1, 2])
})

test('allows to use arrow function to bind a context', () => {
  let ee = createEvents()
  let app = {
    check: ['a'],

    getListener() {
      return () => {
        this.check = this.value.split('')
      }
    },

    value: 'test'
  }

  let unbind = ee.on('event', app.getListener())

  doesNotThrow(() => {
    ee.emit('event')
  })

  deepStrictEqual(app.check, ['t', 'e', 's', 't'])

  unbind()
})
