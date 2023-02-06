import { emitter } from './emitter.js'

export function publish(namespace: string, channel: string, value: string): void {
  const eventName = `${namespace}-${channel}`

  emitter.get()
    .emit(eventName, value)
}
