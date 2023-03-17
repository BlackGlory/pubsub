import { IAPI } from '@src/contract.js'
import { publish } from './publish.js'
import { observe } from './observe.js'

export const API: IAPI = {
  publish
, observe
}
