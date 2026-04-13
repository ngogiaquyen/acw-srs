-- Migration: Add web credentials columns to devices table
-- These credentials are used for logging into the ESP device's built-in web interface
-- web_username defaults to the tenant admin email, web_password is stored in plaintext

ALTER TABLE devices
ADD COLUMN web_username VARCHAR(255) DEFAULT NULL AFTER payment_code,
ADD COLUMN web_password VARCHAR(255) DEFAULT NULL AFTER web_username;
