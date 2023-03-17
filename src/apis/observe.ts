import { Observable } from 'rxjs'
import { pubsub } from '@dao/pubsub.js'
import { JSONValue } from '@blackglory/prelude'

export function observe(namespace: string, channel: string): Observable<JSONValue> {
  return pubsub.observe(namespace, channel)
}
