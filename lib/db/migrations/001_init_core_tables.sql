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
  -- SePay configuration per tenant
  sepay_bank_account VARCHAR(50) DEFAULT NULL,
  sepay_bank_code VARCHAR(20) DEFAULT NULL,
  sepay_account_name VARCHAR(100) DEFAULT NULL,
  sepay_webhook_secret VARCHAR(255) DEFAULT NULL,
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

