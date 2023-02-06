import { resetEmitter } from '@dao/emitter-instance.js'
import { publish } from '@dao/publish.js'
import { subscribe } from '@dao/subscribe.js'

beforeEach(resetEmitter)

test('publish, subscribe', done => {
  const namespace = 'namespace'
  const value = 'value'

  publish(namespace, value)
  subscribe(namespace, () => {
    done.fail()
  })
  setImmediate(done)
})

test('subscribe, publish', done => {
  const namespace = 'namespace'
  const value = 'value'

  subscribe(namespace, val => {
    expect(val).toBe(value)
    done()
  })
  publish(namespace, value)
})

test('subscribe, unsubscribe, publish', done => {
  const namespace = 'namespace'
  const value = 'value'

  const unsubscribe = subscribe(namespace, () => {
    done.fail()
  })
  unsubscribe()
  publish(namespace, value)
  setImmediate(done)
})
