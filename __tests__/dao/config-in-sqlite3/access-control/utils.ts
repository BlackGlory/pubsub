import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawBlacklist {
  pubsub_id: string
}

interface IRawWhitelist {
  pubsub_id: string
}

interface IRawTokenPolicy {
  pubsub_id: string
  write_token_required: number | null
  read_token_required: number | null
}

interface IRawToken {
  token: string
  pubsub_id: string
  write_permission: number
  read_permission: number
}

export function setRawBlacklist(props: IRawBlacklist): void {
  getDatabase().prepare(`
    INSERT INTO pubsub_blacklist (pubsub_id)
    VALUES ($pubsub_id);
  `).run(props)
}

export function hasRawBlacklist(id: string): boolean {
  return !!getRawBlacklist(id)
}

export function getRawBlacklist(id: string): IRawBlacklist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM pubsub_blacklist
     WHERE pubsub_id = $id;
  `).get({ id })
}

export function setRawWhitelist(props: IRawWhitelist): void {
  getDatabase().prepare(`
    INSERT INTO pubsub_whitelist (pubsub_id)
    VALUES ($pubsub_id);
  `).run(props)
}

export function hasRawWhitelist(id: string): boolean {
  return !!getRawWhitelist(id)
}

export function getRawWhitelist(id: string): IRawWhitelist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM pubsub_whitelist
     WHERE pubsub_id = $id;
  `).get({ id })
}

export function setRawTokenPolicy(props: IRawTokenPolicy): void {
  getDatabase().prepare(`
    INSERT INTO pubsub_token_policy (
      pubsub_id
    , write_token_required
    , read_token_required
    )
    VALUES (
      $pubsub_id
    , $write_token_required
    , $read_token_required
    );
  `).run(props)
}

export function hasRawTokenPolicy(id: string): boolean {
  return !!getRawTokenPolicy(id)
}

export function getRawTokenPolicy(id: string): IRawTokenPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM pubsub_token_policy
     WHERE pubsub_id = $id;
  `).get({ id })
}

export function setRawToken(props: IRawToken): void {
  getDatabase().prepare(`
    INSERT INTO pubsub_token (
      token
    , pubsub_id
    , write_permission
    , read_permission
    )
    VALUES (
      $token
    , $pubsub_id
    , $write_permission
    , $read_permission
    );
  `).run(props)
}

export function hasRawToken(token: string, id: string): boolean {
  return !!getRawToken(token, id)
}

export function getRawToken(token: string, id: string): IRawToken | null {
  return getDatabase().prepare(`
    SELECT *
      FROM pubsub_token
     WHERE token = $token
       AND pubsub_id = $id;
  `).get({ token, id })
}
