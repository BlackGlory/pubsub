import { rebuildPubSubEmitter } from '@dao/data-in-memory/pubsub/pubsub-emitter'
import { PubSubDAO } from '@dao/data-in-memory/pubsub'

beforeEach(() => {
  rebuildPubSubEmitter()
})

describe('PubSubDAO', () => {
  test('publish, subscribe', async done => {
    const key = 'key'
    const value = 'value'

    PubSubDAO.publish(key, value)
    PubSubDAO.subscribe(key, () => done.fail())
    setImmediate(done)
  })

  test('subscribe, publish', async done => {
    const key = 'key'
    const value = 'value'

    PubSubDAO.subscribe(key, val => {
      expect(val).toBe(value)
      done()
    })
    PubSubDAO.publish(key, value)
  })

  test('subscribe, unsubscribe, publish', async done => {
    const key = 'key'
    const value = 'value'

    const unsubscribe = PubSubDAO.subscribe(key, () => done.fail())
    unsubscribe()
    PubSubDAO.publish(key, value)
    setImmediate(done)
  })
})
