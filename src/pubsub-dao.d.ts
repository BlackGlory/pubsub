type IUnsubscribe = () => void

interface IPubSubDAO {
  publish(namespace: string, value: string): void
  subscribe(namespace: string, listener: (value: string) => void): IUnsubscribe
}
