-- Migration: Add last_ip column to devices table
-- Stores the most recent local IP of the ESP device (sent during heartbeat)
-- Used to build the direct web config URL: http://<last_ip>/

ALTER TABLE devices
ADD COLUMN last_ip VARCHAR(45) DEFAULT NULL AFTER last_heartbeat;
