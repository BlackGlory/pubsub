import { isAdmin } from './admin.js'
import * as PubSub from './pubsub.js'
import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import * as JSONSchema from './json-schema.js'
import { TBAC } from './token-based-access-control/index.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, PubSub
, Blacklist
, Whitelist
, JSONSchema
, TBAC
}
