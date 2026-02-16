import { test, beforeEach, afterEach, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json } from 'extra-request/transformers'
import { observe } from '@apis/observe.js'
import { firstValueFrom } from 'rxjs'

beforeEach(startService)
afterEach(stopService)

test('publish', async () => {
  const namespace = 'namespace'
  const channel = 'channel'
  const content = 'content'

  const promise = firstValueFrom(observe(namespace, channel))
  const res = await fetch(post(
    url(getAddress())
  , pathname(`/namespaces/${namespace}/channels/${channel}`)
  , json(content)
  ))

  expect(res.status).toBe(204)
  expect(await promise).toStrictEqual(content)
})
