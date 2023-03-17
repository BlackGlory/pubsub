import { pubsub } from '@dao/pubsub.js'
import { setImmediate } from 'extra-timers'
import { firstValueFrom } from 'rxjs'

afterEach(() => pubsub.reset())

describe('PubSub', () => {
  describe('same namespace', () => {
    test('publish, subscribe', done => {
      const namespace = 'namespace'
      const channel = 'channel'
      const content = 'content'

      pubsub.publish(namespace, channel, content)
      pubsub.observe(namespace, channel).subscribe(() => {
        done.fail()
      })

      setImmediate(done)
    })

    test('subscribe, publish', async () => {
      const namespace = 'namespace'
      const channel = 'channel'
      const content = 'content'

      const promise = firstValueFrom(pubsub.observe(namespace, channel))
      pubsub.publish(namespace, channel, content)
      const result = await promise

      expect(result).toBe(content)
    })
  })

  describe('diff namespace', () => {
    test('subscribe, publish', done => {
      const namespace1 = 'namespace-1'
      const namespace2 = 'namespace-2'
      const channel = 'channel'
      const value = 'value'

      pubsub.observe(namespace1, channel).subscribe(() => {
        done.fail()
      })
      pubsub.observe(namespace2, channel).subscribe(() => {
        done()
      })
      pubsub.publish(namespace2, channel, value)
    })
  })
})
