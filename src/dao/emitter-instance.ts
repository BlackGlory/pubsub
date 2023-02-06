import { Emitter } from '@blackglory/structures'

let emitter = createEmitter()

export function getEmitter(): Emitter<Record<string, [string]>> {
  return emitter
}

export function resetEmitter(): void {
  emitter = createEmitter()
}

function createEmitter(): Emitter<Record<string, [string]>> {
  return new Emitter<Record<string, [string]>>()
}
