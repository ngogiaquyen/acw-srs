-- Migration: Drop qr_codes table and remove qr_code column from stations

DROP TABLE IF EXISTS qr_codes;

ALTER TABLE stations DROP COLUMN IF EXISTS qr_code;
