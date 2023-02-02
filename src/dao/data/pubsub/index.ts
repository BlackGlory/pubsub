import { publish } from './publish.js'
import { subscribe } from './subscribe.js'
import { IPubSubDAO } from './contract.js'

export const PubSubDAO: IPubSubDAO = {
  publish
, subscribe
}
