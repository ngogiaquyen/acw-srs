-- Migration: Drop pricing_packages table and add price_per_minute and payment_code to devices

-- Step 1: Drop foreign key from transactions table
ALTER TABLE transactions DROP FOREIGN KEY IF EXISTS transactions_ibfk_4;

-- Step 2: Remove pricing_package_id column from transactions (or set to nullable)
ALTER TABLE transactions MODIFY pricing_package_id INT NULL;

-- Step 3: Drop the pricing_packages table
DROP TABLE IF EXISTS pricing_packages;

-- Step 4: Add columns to devices
ALTER TABLE devices ADD COLUMN price_per_minute DECIMAL(10,2) DEFAULT NULL;
ALTER TABLE devices ADD COLUMN payment_code VARCHAR(50) DEFAULT NULL;
