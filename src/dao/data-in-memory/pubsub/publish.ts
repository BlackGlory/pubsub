import { getEmitter } from './emitter-instance'

export function publish(namespace: string, value: string): void {
  const emitter = getEmitter()
  emitter.emit(namespace, value)
}
