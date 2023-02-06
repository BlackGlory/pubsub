import { subscribe as _subscribe } from '@dao/subscribe.js'

export function subscribe(channel: string, cb: (value: string) => void): () => void {
  return _subscribe(channel, cb)
}
