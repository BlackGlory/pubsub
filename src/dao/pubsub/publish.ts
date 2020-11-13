import { getPubSubEmitter } from './pubsub-emitter'

export function publish(key: string, value: string): void {
  const emitter = getPubSubEmitter()
  emitter.emit(key, value)
}
