import { ValueGetter } from 'value-getter'
import { isNumber } from '@blackglory/types'
import { Getter } from 'justypes'
import { assert } from '@blackglory/errors'
import { getCache } from '@env/cache'
import { path as appRoot } from 'app-root-path'
import * as path from 'path'

export enum ListBasedAccessControl {
  Disable
, Whitelist
, Blacklist
}

export enum NodeEnv {
  Test
, Development
, Production
}

export const NODE_ENV: Getter<NodeEnv | undefined> =
  env('NODE_ENV')
    .convert(val => {
      switch (val) {
        case 'test': return NodeEnv.Test
        case 'development': return NodeEnv.Development
        case 'production': return NodeEnv.Production
      }
    })
    .memoize(getCache)
    .get()

export const CI: Getter<boolean> =
  env('CI')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const DATA: Getter<string> =
  env('PUBSUB_DATA')
    .default(path.join(appRoot, 'data'))
    .memoize(getCache)
    .get()

export const HOST: Getter<string> =
  env('PUBSUB_HOST')
    .default('localhost')
    .memoize(getCache)
    .get()

export const PORT: Getter<number> =
  env('PUBSUB_PORT')
    .convert(toInteger)
    .default(8080)
    .memoize(getCache)
    .get()

export const HTTP2: Getter<boolean> =
  env('PUBSUB_HTTP2')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const PAYLOAD_LIMIT: Getter<number> =
  env('PUBSUB_PAYLOAD_LIMIT')
    .convert(toInteger)
    .default(1048576)
    .assert(shouldBePositive)
    .memoize(getCache)
    .get()

export const ADMIN_PASSWORD: Getter<string | undefined> =
  env('PUBSUB_ADMIN_PASSWORD')
    .memoize(getCache)
    .get()

export const LIST_BASED_ACCESS_CONTROL: Getter<ListBasedAccessControl> =
  env('PUBSUB_LIST_BASED_ACCESS_CONTROL')
    .convert(val => {
      switch (val) {
        case 'whitelist': return ListBasedAccessControl.Whitelist
        case 'blacklist': return ListBasedAccessControl.Blacklist
        default: return ListBasedAccessControl.Disable
      }
    })
    .memoize(getCache)
    .get()

export const TOKEN_BASED_ACCESS_CONTROL: Getter<boolean> =
  env('PUBSUB_TOKEN_BASED_ACCESS_CONTROL')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const READ_TOKEN_REQUIRED: Getter<boolean> =
  env('PUBSUB_READ_TOKEN_REQUIRED')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const WRITE_TOKEN_REQUIRED: Getter<boolean> =
  env('PUBSUB_WRITE_TOKEN_REQUIRED')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const JSON_VALIDATION: Getter<boolean> =
  env('PUBSUB_JSON_VALIDATION')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const DEFAULT_JSON_SCHEMA: Getter<object | undefined> =
  env('PUBSUB_DEFAULT_JSON_SCHEMA')
    .convert(toJsonObject)
    .memoize(getCache)
    .get()

export const JSON_PAYLOAD_ONLY: Getter<boolean> =
  env('PUBSUB_JSON_PAYLOAD_ONLY')
    .convert(toBool)
    .default(false)
    .memoize(getCache)
    .get()

export const PUBLISH_PAYLOAD_LIMIT: Getter<number> =
  env('PUBSUB_PUBLISH_PAYLOAD_LIMIT')
    .convert(toInteger)
    .default(PAYLOAD_LIMIT())
    .memoize(getCache)
    .get()

export const SSE_HEARTBEAT_INTERVAL: Getter<number> =
  env('PUBSUB_SSE_HEARTBEAT_INTERVAL')
    .convert(toInteger)
    .default(0)
    .assert(shouldBePositiveOrZero)
    .memoize(getCache)
    .get()

export const WS_HEARTBEAT_INTERVAL: Getter<number> =
  env('PUBSUB_WS_HEARTBEAT_INTERVAL')
    .convert(toInteger)
    .default(0)
    .assert(shouldBePositiveOrZero)
    .memoize(getCache)
    .get()

function env(name: string): ValueGetter<string | undefined> {
  return new ValueGetter(name, () => process.env[name])
}

function toBool(val: string | boolean | undefined): boolean | undefined {
  if (val) return val === 'true'
  return false
}

function toInteger(val: string | number | undefined ): number | undefined {
  if (isNumber(val)) return val
  if (val) return Number.parseInt(val, 10)
}

function toJsonObject(val: string | undefined): object | undefined {
  if (val) return JSON.parse(val)
}

function shouldBePositive(val: number) {
  assert(val > 0)
}

function shouldBePositiveOrZero(val: number) {
  assert(val === 0 || val > 0)
}
