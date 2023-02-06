export interface IAPI {
  publish(namespace: string, payload: string): void
  subscribe(namespace: string, cb: (value: string) => void): () => void
}
