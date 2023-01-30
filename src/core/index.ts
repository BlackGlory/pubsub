import { isAdmin } from './admin.js'
import * as PubSub from './pubsub.js'
import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import * as JsonSchema from './json-schema.js'
import { TBAC } from './token-based-access-control/index.js'

export const Core: ICore = {
  isAdmin
, PubSub
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
