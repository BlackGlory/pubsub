import { getDatabase } from './database'

export function getAllIdsWithTokenPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT pubsub_id
      FROM pubsub_token_policy;
  `).all()
  return result.map(x => x['pubsub_id'])
}

export function getTokenPolicies(id: string): {
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
} {
  const row: {
    'write_token_required': number | null
  , 'read_token_required': number | null
  } = getDatabase().prepare(`
    SELECT write_token_required
         , read_token_required
      FROM pubsub_token_policy
     WHERE pubsub_id = $id;
  `).get({ id })
  if (row) {
    const writeTokenRequired = row['write_token_required']
    const readTokenRequired = row['read_token_required']
    return {
      writeTokenRequired: writeTokenRequired === null
                          ? null
                          : numberToBoolean(writeTokenRequired)
    , readTokenRequired: readTokenRequired === null
                        ? null
                        : numberToBoolean(readTokenRequired)
    }
  } else {
    return { writeTokenRequired: null, readTokenRequired: null }
  }
}

export function setWriteTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO pubsub_token_policy (pubsub_id, write_token_required)
    VALUES ($id, $writeTokenRequired)
        ON CONFLICT(pubsub_id)
        DO UPDATE SET write_token_required = $writeTokenRequired;
  `).run({ id, writeTokenRequired: booleanToNumber(val) })
}

export function unsetWriteTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE pubsub_token_policy
         SET write_token_required = NULL
       WHERE pubsub_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

export function setReadTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO pubsub_token_policy (pubsub_id, read_token_required)
    VALUES ($id, $readTokenRequired)
        ON CONFLICT(pubsub_id)
        DO UPDATE SET read_token_required = $readTokenRequired;
  `).run({ id, readTokenRequired: booleanToNumber(val) })
}

export function unsetReadTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE pubsub_token_policy
         SET read_token_required = NULL
       WHERE pubsub_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

function deleteNoPoliciesRow(id: string): void {
  getDatabase().prepare(`
    DELETE FROM pubsub_token_policy
     WHERE pubsub_id = $id
       AND write_token_required = NULL
       AND read_token_required = NULL
  `).run({ id })
}

function numberToBoolean(val: number): boolean {
  if (val === 0) {
    return false
  } else {
    return true
  }
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}
