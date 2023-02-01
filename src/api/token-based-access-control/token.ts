import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): string[] {
  return AccessControlDAO.Token.getAllNamespacesWithTokens()
}

export function getAll(namespace: string): Array<{
  token: string
  write: boolean
  read: boolean
}> {
  return AccessControlDAO.Token.getAllTokens(namespace)
}

export function setWriteToken(namespace: string, token: string): void {
  return AccessControlDAO.Token.setWriteToken({ namespace, token })
}

export function unsetWriteToken(namespace: string, token: string): void {
  return AccessControlDAO.Token.unsetWriteToken({ namespace, token })
}

export function setReadToken(namespace: string, token: string): void {
  return AccessControlDAO.Token.setReadToken({ namespace, token })
}

export function unsetReadToken(namespace: string, token: string): void {
  return AccessControlDAO.Token.unsetReadToken({ namespace, token })
}
