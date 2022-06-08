import { Observable } from 'rxjs'
import { getEmitter } from './emitter-instance'

export function subscribe(
  namespace: string
, listener: (value: string) => void
): IUnsubscribe {
  const emitter = getEmitter()
  const observable = new Observable<string>(observer => {
    const removeListener = emitter.once(
      namespace
    , (value: string) => observer.next(value)
    )
    return () => removeListener()
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
