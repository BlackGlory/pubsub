import { resetEmitter } from '@dao/emitter.js'
import { publish } from '@dao/publish.js'
import { subscribe } from '@dao/subscribe.js'

afterEach(resetEmitter)

describe('same namespace', () => {
  test('publish, subscribe', done => {
    const namespace = 'namespace'
    const channel = 'channel'
    const value = 'value'

    publish(namespace, channel, value)
    subscribe(namespace, channel, () => {
      done.fail()
    })
    setImmediate(done)
  })

  test('subscribe, publish', done => {
    const namespace = 'namespace'
    const channel = 'channel'
    const value = 'value'

    subscribe(namespace, channel, val => {
      expect(val).toBe(value)
      done()
    })
    publish(namespace, channel, value)
  })

  test('subscribe, unsubscribe, publish', done => {
    const namespace = 'namespace'
    const channel = 'channel'
    const value = 'value'

    const unsubscribe = subscribe(namespace, channel, () => {
      done.fail()
    })
    unsubscribe()
    publish(namespace, channel, value)
    setImmediate(done)
  })
})

describe('diff namespace', () => {
  test('subscribe, publish', done => {
    const namespace1 = 'namespace-1'
    const namespace2 = 'namespace-2'
    const channel = 'channel'
    const value = 'value'

    subscribe(namespace1, channel, val => {
      done.fail()
    })
    subscribe(namespace2, channel, val => {
      done()
    })
    publish(namespace2, channel, value)
  })
})
