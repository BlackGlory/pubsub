import { resetEmitter } from '@dao/emitter.js'
import { publish } from '@dao/publish.js'
import { subscribe } from '@dao/subscribe.js'

afterEach(resetEmitter)

test('publish, subscribe', done => {
  const channel = 'channel'
  const value = 'value'

  publish(channel, value)
  subscribe(channel, () => {
    done.fail()
  })
  setImmediate(done)
})

test('subscribe, publish', done => {
  const channel = 'channel'
  const value = 'value'

  subscribe(channel, val => {
    expect(val).toBe(value)
    done()
  })
  publish(channel, value)
})

test('subscribe, unsubscribe, publish', done => {
  const channel = 'channel'
  const value = 'value'

  const unsubscribe = subscribe(channel, () => {
    done.fail()
  })
  unsubscribe()
  publish(channel, value)
  setImmediate(done)
})
