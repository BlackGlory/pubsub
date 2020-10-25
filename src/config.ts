export enum RBAC {
  Disable
, Whitelist
, Blacklist
}

export function PORT(): number {
  return Number(process.env.PUBSUB_PORT) || 8080
}

export function HOST(): string {
  return process.env.PUBSUB_HOST || 'localhost'
}

export function ADMIN_PASSWORD(): string | undefined {
  return process.env.PUBSUB_ADMIN_PASSWORD
}

export function LIST_BASED_ACCESS_CONTROL(): RBAC {
  switch (process.env.PUBSUB_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return RBAC.Whitelist
    case 'blacklist': return RBAC.Blacklist
    default: return RBAC.Disable
  }
}

export function TOKEN_BASED_ACCESS_CONTROL(): boolean {
  return process.env.PUBSUB_TOKEN_BASED_ACCESS_CONTROL === 'true'
}

export function DISABLE_NO_TOKENS(): boolean {
  return process.env.PUBSUB_DISABLE_NO_TOKENS === 'true'
}

export function HTTP2(): boolean {
  return process.env.PUBSUB_HTTP2 === 'true'
}

export function JSON_VALIDATION(): boolean {
  return process.env.PUBSUB_JSON_VALIDATION === 'true'
}

export function DEFAULT_JSON_SCHEMA(): string | undefined {
  return process.env.PUBSUB_DEFAULT_JSON_SCHEMA
}

export function JSON_PAYLOAD_ONLY(): boolean {
  return process.env.PUBSUB_JSON_PAYLOAD_ONLY === 'true'
}

export function CI(): boolean {
  return process.env.CI === 'true'
}

export function PAYLOAD_LIMIT(): number {
  if (process.env.MPMC_PAYLOAD_LIMIT) {
    return Number(process.env.MPMC_PAYLOAD_LIMIT)
  } else {
    return 1048576
  }
}

export function PUBLISH_PAYLOAD_LIMIT(): number {
  if (process.env.PUBSUB_PUBLISH_PAYLOAD_LIMIT) {
    return Number(process.env.PUBSUB_PUBLISH_PAYLOAD_LIMIT)
  } else {
    return PAYLOAD_LIMIT()
  }
}
