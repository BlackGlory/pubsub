export interface IAPI {
  publish(namespace: string, channel: string, payload: string): void
  subscribe(namespace: string, channel: string, cb: (value: string) => void): () => void
}
