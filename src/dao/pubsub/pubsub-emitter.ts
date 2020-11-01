import { Emitter } from './emitter'

let emitter = new Emitter<unknown>()

export function getPubSubEmitter(): Emitter<unknown> {
  return emitter
}

export function rebuildPubSubEmitter(): void {
  emitter = new Emitter<unknown>()
}
