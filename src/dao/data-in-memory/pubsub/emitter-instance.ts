import { Emitter } from '@blackglory/structures'

let emitter = createEmitter()

export function getEmitter(): Emitter<string> {
  return emitter
}

export function resetEmitter(): void {
  emitter = createEmitter()
}

function createEmitter(): Emitter<string> {
  return new Emitter<string>()
}
