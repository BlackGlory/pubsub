import { Box, Emitter } from '@blackglory/structures'

export const emitter = new Box(new Emitter<Record<string, [string]>>())

export function resetEmitter(): void {
  emitter.set(new Emitter())
}
