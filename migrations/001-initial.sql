--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- pubsub资源本身是松散的, 无需专门创建表

CREATE TABLE pubsub_json_schema (
  pubsub_id     VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);

CREATE TABLE pubsub_blacklist (
  pubsub_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE pubsub_whitelist (
  pubsub_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE pubsub_tbac (
  token              VARCHAR(255) NOT NULL
, pubsub_id            VARCHAR(255) NOT NULL
, subscribe_permission BOOLEAN      NOT NULL CHECK(subscribe_permission IN (0,1))
, publish_permission BOOLEAN      NOT NULL CHECK(publish_permission IN (0,1))
, UNIQUE (token, pubsub_id)
);

CREATE TRIGGER auto_delete_after_insert_pubsub_tbac
 AFTER INSERT ON pubsub_tbac
  WHEN NEW.subscribe_permission = 0
   AND NEW.publish_permission = 0
BEGIN
  DELETE FROM pubsub_tbac
   WHERE pubsub_tbac.token = NEW.token AND pubsub_tbac.pubsub_id = NEW.pubsub_id;
END;

CREATE TRIGGER auto_delete_after_update_pubsub_tbac
 AFTER UPDATE ON pubsub_tbac
  WHEN NEW.subscribe_permission = 0
   AND NEW.publish_permission = 0
BEGIN
  DELETE FROM pubsub_tbac
   WHERE pubsub_tbac.token = NEW.token AND pubsub_tbac.pubsub_id = NEW.pubsub_id;
END;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE pubsub_json_schema;
DROP TABLE pubsub_blacklist;
DROP TABLE pubsub_whitelist;
DROP TABLE pubsub_tbac;
