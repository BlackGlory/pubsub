import { Observable } from 'rxjs'
import { getEmitter } from './emitter-instance.js'

export function subscribe(
  namespace: string
, listener: (value: string) => void
): () => void {
  const emitter = getEmitter()
  const observable = new Observable<string>(observer => {
    const removeListener = emitter.on(
      namespace
    , (value: string) => observer.next(value)
    )
    return () => removeListener()
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
