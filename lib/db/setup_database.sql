-- ============================================
-- SCRIPT SETUP DATABASE (CLEAN - NO STATIONS)
-- Hệ thống quản lý rửa xe tự động
-- ============================================

CREATE DATABASE IF NOT EXISTS car_wash_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE car_wash_db;

-- ============================================
-- 1) TENANTS
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  license_max_devices INT DEFAULT 0,
  subscription_status ENUM('active', 'suspended', 'expired') DEFAULT 'active',
  subscription_start_date DATE,
  subscription_end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  sepay_bank_account VARCHAR(50) DEFAULT NULL,
  sepay_bank_code VARCHAR(20) DEFAULT NULL,
  sepay_account_name VARCHAR(100) DEFAULT NULL,
  sepay_webhook_secret VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 2) USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'TENANT_ADMIN') NOT NULL,
  tenant_id INT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);

-- ============================================
-- 3) DEVICES (NO station_id)
-- ============================================
CREATE TABLE IF NOT EXISTS devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  device_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status ENUM('online', 'offline', 'maintenance') DEFAULT 'offline',
  last_heartbeat TIMESTAMP NULL,
  firmware_version VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  price_per_minute DECIMAL(10, 2) DEFAULT NULL,
  payment_code VARCHAR(50) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- ============================================
-- 4) TRANSACTIONS (NO station_id)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  device_id INT NOT NULL,
  pricing_package_id INT NULL,
  qr_code VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  duration_minutes INT NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  started_at TIMESTAMP NULL,
  ended_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_transactions_tenant_id (tenant_id),
  INDEX idx_transactions_device_id (device_id),
  INDEX idx_transactions_pricing_package_id (pricing_package_id)
);

-- ============================================
-- 5) DEVICE COMMANDS
-- ============================================
CREATE TABLE IF NOT EXISTS device_commands (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id INT NOT NULL,
  command_type ENUM('start', 'stop', 'restart', 'update_firmware', 'config') NOT NULL,
  command_data JSON NULL,
  status ENUM('pending', 'sent', 'executed', 'failed') DEFAULT 'pending',
  response_data JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_device_status_created (device_id, status, created_at)
);

-- ============================================
-- 6) DEVICE LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS device_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id INT NOT NULL,
  log_level ENUM('info', 'warning', 'error') DEFAULT 'info',
  message TEXT NOT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_device_created (device_id, created_at)
);

-- ============================================
-- 7) SUBSCRIPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  billing_cycle ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'past_due', 'cancelled', 'expired') NOT NULL DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  INDEX idx_subscriptions_tenant_id (tenant_id),
  INDEX idx_subscriptions_status (status),
  INDEX idx_subscriptions_end_date (end_date)
);

-- ============================================
-- 8) INVOICES
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  subscription_id INT NULL,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'VND',
  due_date DATE NOT NULL,
  paid_at DATETIME NULL,
  status ENUM('pending', 'paid', 'overdue', 'cancelled') NOT NULL DEFAULT 'pending',
  description TEXT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  INDEX idx_invoices_tenant_id (tenant_id),
  INDEX idx_invoices_status (status),
  INDEX idx_invoices_due_date (due_date)
);

-- ============================================
-- 9) LEADS
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  address TEXT,
  message TEXT,
  source VARCHAR(100) DEFAULT 'website',
  status ENUM('new', 'contacted', 'qualified', 'converted', 'lost') DEFAULT 'new',
  assigned_to INT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_leads_status (status),
  INDEX idx_leads_email (email),
  INDEX idx_leads_created_at (created_at)
);

-- ============================================
-- 10) ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lead_id INT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  customer_address TEXT,
  package_name VARCHAR(255) NOT NULL,
  package_description TEXT,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'VND',
  status ENUM('draft', 'pending', 'confirmed', 'processing', 'delivered', 'completed', 'cancelled') DEFAULT 'draft',
  payment_status ENUM('unpaid', 'partial', 'paid', 'refunded') DEFAULT 'unpaid',
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  tenant_id INT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
  INDEX idx_orders_status (status),
  INDEX idx_orders_order_number (order_number),
  INDEX idx_orders_lead_id (lead_id),
  INDEX idx_orders_tenant_id (tenant_id),
  INDEX idx_orders_created_at (created_at)
);

-- ============================================
-- 11) SEED SUPER ADMIN
-- ============================================
INSERT INTO users (email, password_hash, role, tenant_id, name, phone, is_active)
VALUES (
  'admin@example.com',
  '$2b$10$nN7.S.BA4dYI/JzcNiTrseCpS.ua.0svTl9k0d2k7SECJiWh/aBmW',
  'SUPER_ADMIN',
  NULL,
  'Super Admin',
  NULL,
  TRUE
)
ON DUPLICATE KEY UPDATE email = email;

-- ============================================
-- DONE
-- ============================================
SELECT 'Database setup completed successfully!' AS message;
SELECT 'Super Admin created: admin@example.com / admin123' AS credentials;
