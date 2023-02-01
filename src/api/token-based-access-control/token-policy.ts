import { AccessControlDAO } from '@dao/index.js'

export function getAllNamespaces(): string[] {
  return AccessControlDAO.TokenPolicy.getAllNamespacesWithTokenPolicies()
}

export function get(namespace: string): {
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
} {
  return AccessControlDAO.TokenPolicy.getTokenPolicies(namespace)
}

export function setWriteTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setWriteTokenRequired(namespace, val)
}

export function unsetWriteTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetWriteTokenRequired(namespace)
}

export function setReadTokenRequired(namespace: string, val: boolean): void {
  AccessControlDAO.TokenPolicy.setReadTokenRequired(namespace, val)
}

export function unsetReadTokenRequired(namespace: string): void {
  AccessControlDAO.TokenPolicy.unsetReadTokenRequired(namespace)
}
