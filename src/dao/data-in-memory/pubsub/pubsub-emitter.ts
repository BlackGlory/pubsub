import { Emitter } from './emitter'

let emitter = createPubSubEmitter()

export function getPubSubEmitter(): Emitter<string> {
  return emitter
}

export function rebuildPubSubEmitter(): void {
  emitter = createPubSubEmitter()
}

function createPubSubEmitter(): Emitter<string> {
  return new Emitter<string>()
}
