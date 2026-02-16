import { describe, test, afterEach, expect } from 'vitest'
import { pubsub } from '@dao/pubsub.js'
import { firstValueFrom } from 'rxjs'
import { Deferred, timeout, TimeoutError } from 'extra-promise'

afterEach(() => pubsub.reset())

describe('PubSub', () => {
  describe('same namespace', () => {
    test('publish, subscribe', async () => {
      const namespace = 'namespace'
      const channel = 'channel'
      const content = 'content'
      const deferred = new Deferred<void>()

      pubsub.publish(namespace, channel, content)
      pubsub.observe(namespace, channel).subscribe(() => {
        deferred.resolve()
      })

      try {
        await Promise.race([
          deferred
        , timeout(1000)
        ])
      } catch (e) {
        if (e instanceof TimeoutError) return
        throw e
      }
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
    test('subscribe, publish', async () => {
      const namespace1 = 'namespace-1'
      const namespace2 = 'namespace-2'
      const channel = 'channel'
      const value = 'value'
      const deferred = new Deferred<void>()

      pubsub.observe(namespace1, channel).subscribe(() => {
        deferred.reject(new Error('Oops!'))
      })
      pubsub.observe(namespace2, channel).subscribe(() => {
        deferred.resolve()
      })
      pubsub.publish(namespace2, channel, value)

      await deferred
    })
  })
})
