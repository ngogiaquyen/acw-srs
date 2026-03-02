-- ============================================
-- SCRIPT SETUP DATABASE HOÀN CHỈNH
-- Hệ thống quản lý rửa xe tự động
-- ============================================

-- Tạo database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS car_wash_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE car_wash_db;

-- ============================================
-- 1. TẠO BẢNG CORE
-- ============================================

-- Create tenants table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'TENANT_ADMIN') NOT NULL,
  tenant_id INT NULL,  -- NULL for SUPER_ADMIN
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);

-- ============================================
-- 2. TẠO BẢNG STATIONS
-- ============================================

-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  qr_code VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- ============================================
-- 3. TẠO BẢNG DEVICES
-- ============================================

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  station_id INT NULL,
  device_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  status ENUM('online', 'offline', 'maintenance') DEFAULT 'offline',
  last_heartbeat TIMESTAMP NULL,
  firmware_version VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE SET NULL
);

-- ============================================
-- 4. TẠO BẢNG PRICING PACKAGES
-- ============================================

-- Create pricing_packages table
CREATE TABLE IF NOT EXISTS pricing_packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  station_id INT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- ============================================
-- 5. TẠO BẢNG TRANSACTIONS
-- ============================================

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  station_id INT NOT NULL,
  device_id INT NOT NULL,
  pricing_package_id INT NOT NULL,
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
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  FOREIGN KEY (pricing_package_id) REFERENCES pricing_packages(id) ON DELETE CASCADE
);

-- ============================================
-- 6. TẠO BẢNG QR CODES
-- ============================================

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  station_id INT NULL,
  device_id INT NULL,
  code VARCHAR(255) UNIQUE NOT NULL,
  label VARCHAR(255) NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE SET NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

-- ============================================
-- 7. TẠO BẢNG DEVICE COMMANDS
-- ============================================

-- Create device_commands table
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
-- 8. TẠO BẢNG DEVICE LOGS
-- ============================================

-- Create device_logs table
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
-- 9. TẠO BẢNG SUBSCRIPTIONS & INVOICES
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
-- 10. TẠO BẢNG LEADS & ORDERS
-- ============================================

-- Create leads table
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

-- Create orders table
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
-- 11. INSERT SUPER ADMIN USER
-- ============================================

-- Insert Super Admin user
-- Email: admin@example.com
-- Password: admin123
-- Password hash được tạo bằng bcrypt với salt rounds 10
-- Lưu ý: Bạn có thể tạo hash mới bằng script: node lib/db/generate_password_hash.js <password>

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
-- HOÀN TẤT
-- ============================================

SELECT 'Database setup completed successfully!' AS message;
SELECT 'Super Admin created: admin@example.com / admin123' AS credentials;
