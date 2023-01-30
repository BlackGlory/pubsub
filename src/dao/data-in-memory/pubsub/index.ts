import { publish } from './publish.js'
import { subscribe } from './subscribe.js'

export const PubSubDAO: IPubSubDAO = {
  publish
, subscribe
}
