import { emitter } from './emitter.js'

export function publish(channel: string, value: string): void {
  emitter.get()
    .emit(channel, value)
}
