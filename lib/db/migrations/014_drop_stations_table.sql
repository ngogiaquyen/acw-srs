-- Migration: Drop stations table completely
-- DB state expected: devices/transactions no longer reference station_id

START TRANSACTION;

DROP TABLE IF EXISTS stations;

COMMIT;
