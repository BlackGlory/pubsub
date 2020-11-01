type IUnsubscribe = () => void

interface IPubSubDAO<T> {
  publish(key: string, value: T): void
  subscribe(key: string, listener: (value: T) => void): IUnsubscribe
}
