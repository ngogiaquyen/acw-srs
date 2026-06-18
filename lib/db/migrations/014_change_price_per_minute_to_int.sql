-- Migration: Change price_per_minute from DECIMAL to INT in devices table
-- Up
ALTER TABLE devices MODIFY price_per_minute INT DEFAULT NULL;
