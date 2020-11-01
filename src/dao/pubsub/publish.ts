import { getPubSubEmitter } from './pubsub-emitter'

export function publish(key: string, value: unknown): void {
  const emitter = getPubSubEmitter()
  emitter.emit(key, value)
}
