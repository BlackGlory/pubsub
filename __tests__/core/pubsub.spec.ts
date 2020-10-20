import { createPubSub } from '@core'

describe('PubSub', () => {
  it('publish, subscribe', async done => {
    const pubsub = await createPubSub()
    const key = 'key'
    const value = 'value'

    pubsub.subscribe(key, v => {
      expect(v).toBe(value)
      done()
    })
    pubsub.publish(key, value)
  })

  it('unsubscribe', async done => {
    const pubsub = await createPubSub()
    const key = 'key'
    const value = 'value'

    const unsubscribe = pubsub.subscribe(key, () => done.fail())
    unsubscribe()
    pubsub.publish(key, value)
    setImmediate(done)
  })
})
