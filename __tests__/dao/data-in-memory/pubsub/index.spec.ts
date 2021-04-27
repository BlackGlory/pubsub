import { resetEmitter } from '@dao/data-in-memory/pubsub/emitter-instance'
import { PubSubDAO } from '@dao/data-in-memory/pubsub'

beforeEach(resetEmitter)

describe('PubSubDAO', () => {
  test('publish, subscribe', async done => {
    const namespace = 'namespace'
    const value = 'value'

    PubSubDAO.publish(namespace, value)
    PubSubDAO.subscribe(namespace, () => done.fail())
    setImmediate(done)
  })

  test('subscribe, publish', async done => {
    const namespace = 'namespace'
    const value = 'value'

    PubSubDAO.subscribe(namespace, val => {
      expect(val).toBe(value)
      done()
    })
    PubSubDAO.publish(namespace, value)
  })

  test('subscribe, unsubscribe, publish', async done => {
    const namespace = 'namespace'
    const value = 'value'

    const unsubscribe = PubSubDAO.subscribe(namespace, () => done.fail())
    unsubscribe()
    PubSubDAO.publish(namespace, value)
    setImmediate(done)
  })
})
