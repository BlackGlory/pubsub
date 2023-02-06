import { getEmitter } from './emitter-instance.js'

export function publish(namespace: string, value: string): void {
  const emitter = getEmitter()
  emitter.emit(namespace, value)
}
