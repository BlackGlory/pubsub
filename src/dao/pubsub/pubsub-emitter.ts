import { Emitter } from './emitter'

let emitter = new Emitter<string>()

export function getPubSubEmitter(): Emitter<string> {
  return emitter
}

export function rebuildPubSubEmitter(): void {
  emitter = new Emitter<string>()
}
