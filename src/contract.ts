import { Observable } from 'rxjs'

export interface IAPI {
  publish(namespace: string, channel: string, payload: string): void
  observe(namespace: string, channel: string): Observable<string>
}
