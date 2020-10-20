import { createPubSub } from '@core'

describe('PubSub', () => {
  test('publish,  subscribe', async done => {
    const pubsub = await createPubSub()
    const key = 'key'
    const value = 'value'

    pubsub.publish(key, value)
    pubsub.subscribe(key, () => done.fail())
    setImmediate(done)
  })

  test('subscribe, publish', async done => {
    const pubsub = await createPubSub()
    const key = 'key'
    const value = 'value'

    pubsub.subscribe(key, v => {
      expect(v).toBe(value)
      done()
    })
    pubsub.publish(key, value)
  })

  test('subscribe, unsubscribe, publish', async done => {
    const pubsub = await createPubSub()
    const key = 'key'
    const value = 'value'

    const unsubscribe = pubsub.subscribe(key, () => done.fail())
    unsubscribe()
    pubsub.publish(key, value)
    setImmediate(done)
  })
})
