--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE pubsub_blacklist
RENAME COLUMN pubsub_id TO namespace;

ALTER TABLE pubsub_whitelist
RENAME COLUMN pubsub_id TO namespace;

ALTER TABLE pubsub_token_policy
RENAME COLUMN pubsub_id TO namespace;

ALTER TABLE pubsub_token
RENAME COLUMN pubsub_id TO namespace;

ALTER TABLE pubsub_json_schema
RENAME COLUMN pubsub_id TO namespace;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE pubsub_blacklist
RENAME COLUMN namespace TO pubsub_id;

ALTER TABLE pubsub_whitelist
RENAME COLUMN namespace TO pubsub_id;

ALTER TABLE pubsub_token_policy
RENAME COLUMN namespace TO pubsub_id;

ALTER TABLE pubsub_token
RENAME COLUMN namespace TO pubsub_id;

ALTER TABLE pubsub_json_schema
RENAME COLUMN namespace TO pubsub_id;
