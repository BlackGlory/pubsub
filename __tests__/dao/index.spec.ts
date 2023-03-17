import { resetEmitter } from '@dao/emitter.js'
import { publish } from '@dao/publish.js'
import { observe } from '@dao/subscribe.js'

afterEach(resetEmitter)

describe('same namespace', () => {
  test('publish, subscribe', done => {
    const namespace = 'namespace'
    const channel = 'channel'
    const value = 'value'

    publish(namespace, channel, value)
    observe(namespace, channel).subscribe(() => {
      done.fail()
    })
    setImmediate(done)
  })

  test('subscribe, publish', done => {
    const namespace = 'namespace'
    const channel = 'channel'
    const value = 'value'

    observe(namespace, channel).subscribe(val => {
      expect(val).toBe(value)
      done()
    })
    publish(namespace, channel, value)
  })

  test('subscribe, unsubscribe, publish', done => {
    const namespace = 'namespace'
    const channel = 'channel'
    const value = 'value'

    const subscription = observe(namespace, channel).subscribe(() => {
      done.fail()
    })
    subscription.unsubscribe()
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

    observe(namespace1, channel).subscribe(val => {
      done.fail()
    })
    observe(namespace2, channel).subscribe(val => {
      done()
    })
    publish(namespace2, channel, value)
  })
})
