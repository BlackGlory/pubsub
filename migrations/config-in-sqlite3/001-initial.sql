--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- pubsub资源本身是松散的, 没有自己的表

CREATE TABLE pubsub_blacklist (
  pubsub_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE pubsub_whitelist (
  pubsub_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE pubsub_token_policy (
  pubsub_id            VARCHAR(255) NOT NULL UNIQUE
, write_token_required BOOLEAN
, read_token_required  BOOLEAN
);

CREATE TABLE pubsub_token (
  pubsub_id        VARCHAR(255) NOT NULL
, token            VARCHAR(255) NOT NULL
, read_permission  BOOLEAN      NOT NULL DEFAULT 0 CHECK(read_permission IN (0,1))
, write_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(write_permission IN (0,1))
, UNIQUE (token, pubsub_id)
);

CREATE TABLE pubsub_json_schema (
  pubsub_id   VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE pubsub_blacklist;
DROP TABLE pubsub_whitelist;
DROP TABLE pubsub_token_policy;
DROP TABLE pubsub_token;
DROP TABLE pubsub_json_schema;
