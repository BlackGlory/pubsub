import { IAPI } from '@src/contract.js'
import { publish } from './publish.js'
import { subscribe } from './subscribe.js'

export const API: IAPI = {
  publish
, subscribe
}
