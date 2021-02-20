import { getDatabase } from '../database'

export function getAllWhitelistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT pubsub_id
      FROM pubsub_whitelist;
  `).all()

  return result.map(x => x['pubsub_id'])
}

export function inWhitelist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM pubsub_whitelist
              WHERE pubsub_id = $id
           ) AS exist_in_whitelist;
  `).get({ id })

  return result['exist_in_whitelist'] === 1
}

export function addWhitelistItem(id: string) {
  getDatabase().prepare(`
    INSERT INTO pubsub_whitelist (pubsub_id)
    VALUES ($id)
        ON CONFLICT
        DO NOTHING;
  `).run({ id })
}

export function removeWhitelistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM pubsub_whitelist
     WHERE pubsub_id = $id;
  `).run({ id })
}
