import { resetEmitter } from '@dao/data-in-memory/pubsub/emitter-instance.js'
import { PubSubDAO } from '@dao/data-in-memory/pubsub/index.js'

beforeEach(resetEmitter)

describe('PubSubDAO', () => {
  test('publish, subscribe', done => {
    const namespace = 'namespace'
    const value = 'value'

    PubSubDAO.publish(namespace, value)
    PubSubDAO.subscribe(namespace, () => done.fail())
    setImmediate(done)
  })

  test('subscribe, publish', done => {
    const namespace = 'namespace'
    const value = 'value'

    PubSubDAO.subscribe(namespace, val => {
      expect(val).toBe(value)
      done()
    })
    PubSubDAO.publish(namespace, value)
  })

  test('subscribe, unsubscribe, publish', done => {
    const namespace = 'namespace'
    const value = 'value'

    const unsubscribe = PubSubDAO.subscribe(namespace, () => done.fail())
    unsubscribe()
    PubSubDAO.publish(namespace, value)
    setImmediate(done)
  })
})
