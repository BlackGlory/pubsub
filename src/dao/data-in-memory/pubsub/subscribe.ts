import { Observable } from 'rxjs'
import { getEmitter } from './emitter-instance'

export function subscribe(key: string, listener: (value: string) => void): IUnsubscribe {
  const emitter = getEmitter()
  const observable = new Observable<string>(observer => {
    const listener = (value: string) => observer.next(value)
    emitter.on(key, listener)
    return () => emitter.off(key, listener)
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
