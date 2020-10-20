import { getDatabase } from './database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT pubsub_id
      FROM pubsub_tbac;
  `).all()
  return result.map(x => x['pubsub_id'])
}

export function getAllTokens(id: string): Array<{ token: string, publish: boolean, subscribe: boolean }> {
  const result: Array<{
    token: string
    'publish_permission': number
    'subscribe_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , publish_permission
         , subscribe_permission
      FROM pubsub_tbac
     WHERE pubsub_id = $id;
  `).all({ id })
  return result.map(x => ({
    token: x['token']
  , publish: x['publish_permission'] === 1
  , subscribe: x['subscribe_permission'] === 1
  }))
}

export function hasPublishTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM pubsub_tbac
               WHERE pubsub_id = $id AND publish_permission=1
           ) AS publish_tokens_exist
  `).get({ id })
  return result['publish_tokens_exist'] === 1
}

export function matchPublishToken({ token, id }: {
  token: string
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM pubsub_tbac
               WHERE pubsub_id = $id AND token = $token AND publish_permission=1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setPublishToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT publish_permission
      FROM pubsub_tbac
     WHERE token = $token AND pubsub_id = $id;
  `).get({ token, id })
  if (row) {
    if (row['publish_permission'] === 0) {
      db.prepare(`
        UPDATE pubsub_tbac
           SET publish_permission = 1
         WHERE token = $token AND pubsub_id = $id;
      `).run({ token, id })
    }
  } else {
    db.prepare(`
      INSERT INTO pubsub_tbac (token, pubsub_id, subscribe_permission, publish_permission)
      VALUES ($token, $id, 0, 1);
    `).run({ token, id })
  }
}

export function unsetPublishToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    UPDATE pubsub_tbac
       SET publish_permission = 0
     WHERE token = $token AND pubsub_id = $id;
  `).run({ token, id })
}

export function hasSubscribeTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM pubsub_tbac
               WHERE pubsub_id = $id AND subscribe_permission=1
           ) AS subscribe_tokens_exist
  `).get({ id })
  return result['subscribe_tokens_exist'] === 1
}

export function matchSubscribeToken({ token, id }: {
  token: string;
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM pubsub_tbac
               WHERE pubsub_id = $id AND token = $token AND subscribe_permission=1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setSubscribeToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT subscribe_permission
      FROM pubsub_tbac
     WHERE token = $token AND pubsub_id = $id;
  `).get({ token, id })
  if (row) {
    if (row['subscribe_permission'] === 0) {
      db.prepare(`
        UPDATE pubsub_tbac
           SET subscribe_permission = 1
         WHERE token = $token AND pubsub_id = $id;
      `).run({ token, id })
    }
  } else {
    db.prepare(`
      INSERT INTO pubsub_tbac (token, pubsub_id, subscribe_permission, publish_permission)
      VALUES ($token, $id, 1, 0);
    `).run({ token, id })
  }
}

export function unsetSubscribeToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    UPDATE pubsub_tbac
       SET subscribe_permission = 0
     WHERE token = $token AND pubsub_id = $id;
  `).run({ token, id })
}
