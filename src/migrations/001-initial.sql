--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- mpmc资源, pubsub资源和它们的token是松散的, 无需专门创建表

-- MPMC

CREATE TABLE mpmc_blacklist (
  mpmc_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mpmc_whitelist (
  mpmc_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE mpmc_tbac (
  token            VARCHAR(255) NOT NULL
, mpmc_id          VARCHAR(255) NOT NULL
, read_permission  BOOLEAN      NOT NULL CHECK(read_permission IN (0,1))
, write_permission BOOLEAN      NOT NULL CHECK(write_permission IN (0,1))
, UNIQUE (mpmc_id, token)
);

CREATE TRIGGER auto_delete_after_insert_mpmc_tbac
 AFTER INSERT ON mpmc_tbac
  WHEN NEW.read_permission = 0
   AND NEW.write_permission = 0
BEGIN
  DELETE FROM mpmc_tbac
   WHERE mpmc_tbac.token = NEW.token AND mpmc_tbac.mpmc_id = NEW.mpmc_id;
END;

CREATE TRIGGER auto_delete_after_update_mpmc_tbac
 AFTER UPDATE ON mpmc_tbac
  WHEN NEW.read_permission = 0
   AND NEW.write_permission = 0
BEGIN
  DELETE FROM mpmc_tbac
   WHERE mpmc_tbac.token = NEW.token AND mpmc_tbac.mpmc_id = NEW.mpmc_id;
END;

-- PubSub

CREATE TABLE pubsub_blacklist (
  pubsub_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE pubsub_whitelist (
  pubsub_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE pubsub_tbac (
  token            VARCHAR(255) NOT NULL
, pubsub_id        VARCHAR(255) NOT NULL
, read_permission  BOOLEAN      NOT NULL CHECK(read_permission IN (0,1))
, write_permission BOOLEAN      NOT NULL CHECK(write_permission IN (0,1))
, UNIQUE (pubsub_id, token)
);

CREATE TRIGGER auto_delete_after_insert_pubsub_tbac
 AFTER INSERT ON pubsub_tbac
  WHEN NEW.read_permission = 0
   AND NEW.write_permission = 0
BEGIN
  DELETE FROM pubsub_tbac
   WHERE pubsub_tbac.token = NEW.token AND pubsub_tbac.pubsub_id = NEW.pubsub_id;
END;

CREATE TRIGGER auto_delete_after_update_pubsub_tbac
 AFTER UPDATE ON pubsub_tbac
  WHEN NEW.read_permission = 0
   AND NEW.write_permission = 0
BEGIN
  DELETE FROM pubsub_tbac
   WHERE pubsub_tbac.token = NEW.token AND pubsub_tbac.pubsub_id = NEW.pubsub_id;
END;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE mpmc_blacklist;
DROP TABLE mpmc_whitelist;
DROP TABLE mpmc_tbac;

DROP TABLE pubsub_blacklist;
DROP TABLE pubsub_whitelist;
DROP TABLE pubsub_tbac;
