import { emitter } from './emitter.js'

export function publish(namespace: string, value: string): void {
  emitter.get()
    .emit(namespace, value)
}
