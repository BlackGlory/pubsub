import { subscribe as _subscribe } from '@dao/subscribe.js'

export function subscribe(
  namespace: string
, channel: string
, cb: (value: string) => void
): () => void {
  return _subscribe(namespace, channel, cb)
}
