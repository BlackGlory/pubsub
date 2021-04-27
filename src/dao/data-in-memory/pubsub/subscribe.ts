import { Observable } from 'rxjs'
import { getEmitter } from './emitter-instance'

export function subscribe(
  namespace: string
, listener: (value: string) => void
): IUnsubscribe {
  const emitter = getEmitter()
  const observable = new Observable<string>(observer => {
    const listener = (value: string) => observer.next(value)
    emitter.on(namespace, listener)
    return () => emitter.off(namespace, listener)
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
