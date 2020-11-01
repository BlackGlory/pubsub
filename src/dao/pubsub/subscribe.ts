import { Observable } from 'rxjs'
import { getPubSubEmitter } from './pubsub-emitter'

export function subscribe(key: string, listener: (value: unknown) => void): IUnsubscribe {
  const emitter = getPubSubEmitter()
  const observable = new Observable<unknown>(observer => {
    const listener = (value: unknown) => observer.next(value)
    emitter.on(key, listener)
    return () => emitter.off(key, listener)
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
