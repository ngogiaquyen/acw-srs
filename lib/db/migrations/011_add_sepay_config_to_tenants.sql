-- Migration: Add SePay configuration columns to tenants table
-- This allows each tenant to have their own SePay bank account

ALTER TABLE tenants
ADD COLUMN sepay_bank_account VARCHAR(50) DEFAULT NULL,
ADD COLUMN sepay_bank_code VARCHAR(20) DEFAULT NULL,
ADD COLUMN sepay_account_name VARCHAR(100) DEFAULT NULL,
ADD COLUMN sepay_webhook_secret VARCHAR(255) DEFAULT NULL;
