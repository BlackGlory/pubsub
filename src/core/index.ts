import { isAdmin } from './admin'
import * as PubSub from './pubsub'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import { TBAC } from './token-based-access-control'

export const Core: ICore = {
  isAdmin
, PubSub
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
