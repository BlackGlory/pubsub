export type IUnsubscribe = () => void

export interface IPubSubDAO {
  publish(namespace: string, value: string): void
  subscribe(namespace: string, listener: (value: string) => void): IUnsubscribe
}
