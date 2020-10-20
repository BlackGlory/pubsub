export enum RBAC {
  Disable
, Whitelist
, Blacklist
}

export function PORT() {
  return Number(process.env.PUBSUB_PORT) || 8080
}

export function HOST() {
  return process.env.PUBSUB_HOST || 'localhost'
}

export function ADMIN_PASSWORD() {
  return process.env.PUBSUB_ADMIN_PASSWORD
}

export function LIST_BASED_ACCESS_CONTROL() {
  switch (process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return RBAC.Whitelist
    case 'blacklist': return RBAC.Blacklist
    default: return RBAC.Disable
  }
}

export function TOKEN_BASED_ACCESS_CONTROL() {
  return process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL === 'true'
}

export function DISABLE_NO_TOKENS() {
  return process.env.PUBSUB_DISABLE_NO_TOKENS === 'true'
}

export function HTTP2() {
  return process.env.PUBSUB_HTTP2 === 'true'
}

export function JSON_VALIDATION() {
  return process.env.PUBSUB_JSON_VALIDATION === 'true'
}

export function DEFAULT_JSON_SCHEMA() {
  return process.env.PUBSUB_DEFAULT_JSON_SCHEMA
}

export function JSON_PAYLOAD_ONLY() {
  return process.env.PUBSUB_JSON_PAYLOAD_ONLY === 'true'
}
