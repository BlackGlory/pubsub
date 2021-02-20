import { getDatabase } from '../database'

export function getAllBlacklistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT pubsub_id
      FROM pubsub_blacklist;
  `).all()

  return result.map(x => x['pubsub_id'])
}

export function inBlacklist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM pubsub_blacklist
              WHERE pubsub_id = $id
           ) AS exist_in_blacklist;
  `).get({ id })

  return result['exist_in_blacklist'] === 1
}

export function addBlacklistItem(id: string) {
  getDatabase().prepare(`
    INSERT INTO pubsub_blacklist (pubsub_id)
    VALUES ($id)
        ON CONFLICT
        DO NOTHING;
  `).run({ id })
}

export function removeBlacklistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM pubsub_blacklist
     WHERE pubsub_id = $id;
  `).run({ id })
}
