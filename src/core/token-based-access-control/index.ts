import {
  TOKEN_BASED_ACCESS_CONTROL
, READ_TOKEN_REQUIRED
, WRITE_TOKEN_REQUIRED
} from '@env/index.js'
import { AccessControlDAO } from '@dao/index.js'
import * as TokenPolicy from './token-policy.js'
import * as Token from './token.js'
import { CustomError } from '@blackglory/errors'

class Unauthorized extends CustomError {}

export const TBAC: ICore['TBAC'] = {
  isEnabled
, checkWritePermission
, checkReadPermission
, Unauthorized
, TokenPolicy
, Token
}

function isEnabled(): boolean {
  return TOKEN_BASED_ACCESS_CONTROL()
}

/**
 * @throws {Unauthorized}
 */
async function checkWritePermission(namespace: string, token?: string): Promise<void> {
  if (!isEnabled()) return

  const writeTokenRequired =
    (await TokenPolicy.get(namespace)).writeTokenRequired
  ?? WRITE_TOKEN_REQUIRED()

  if (writeTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchWriteToken({ token, namespace })) {
      throw new Unauthorized()
    }
  }
}

/**
 * @throws {Unauthorized}
 */
async function checkReadPermission(namespace: string, token?: string): Promise<void> {
  if (!isEnabled()) return

  const readTokenRequired =
    (await TokenPolicy.get(namespace)).readTokenRequired
  ?? READ_TOKEN_REQUIRED()

  if (readTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchReadToken({ token, namespace })) {
      throw new Unauthorized()
    }
  }
}
