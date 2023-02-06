export interface IAPI {
  publish(channel: string, payload: string): void
  subscribe(channel: string, cb: (value: string) => void): () => void
}
