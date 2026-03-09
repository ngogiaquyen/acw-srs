# CẤU TRÚC DỰ ÁN - HỆ THỐNG RỬA XE TỰ ĐỘNG

Tài liệu này mô tả cấu trúc thư mục, database schema, và hướng dẫn setup dự án.

---

## 1. CẤU TRÚC THƯ MỤC

```
esp32/
├── app/                              # Next.js App Router
│   ├── (auth)/                      # Auth routes group
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── super-admin/                 # Super Admin routes
│   │   ├── dashboard/
│   │   ├── tenants/
│   │   │   ├── [id]/
│   │   │   └── new/
│   │   ├── revenue/
│   │   ├── sales/
│   │   │   ├── leads/
│   │   │   └── orders/
│   │   ├── subscriptions/
│   │   ├── billing/
│   │   ├── licenses/
│   │   ├── monitoring/
│   │   ├── support/
│   │   ├── reports/
│   │   └── settings/
│   │
│   ├── tenant/                      # Tenant Admin routes
│   │   ├── dashboard/
│   │   ├── stations/
│   │   ├── devices/
│   │   ├── pricing/
│   │   ├── transactions/
│   │   ├── revenue/
│   │   ├── qr-codes/
│   │   ├── support/
│   │   └── settings/
│   │
│   ├── api/                         # API Routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── register/
│   │   │   └── me/
│   │   │
│   │   ├── super-admin/
│   │   │   ├── tenants/
│   │   │   ├── revenue/
│   │   │   ├── leads/
│   │   │   ├── orders/
│   │   │   ├── subscriptions/
│   │   │   ├── billing/
│   │   │   ├── licenses/
│   │   │   ├── devices/
│   │   │   ├── system/
│   │   │   └── tickets/
│   │   │
│   │   ├── tenant/
│   │   │   ├── dashboard/
│   │   │   ├── stations/
│   │   │   ├── devices/
│   │   │   ├── pricing/
│   │   │   ├── transactions/
│   │   │   ├── revenue/
│   │   │   ├── qr-codes/
│   │   │   └── support/
│   │   │
│   │   ├── public/
│   │   │   ├── qr/
│   │   │   └── payment/
│   │   │
│   │   └── iot/
│   │       └── device/
│   │
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── globals.css                  # Global styles
│
├── components/                      # React Components
│   ├── ui/                         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Chart.tsx
│   │   └── ...
│   │
│   ├── super-admin/                # Super Admin components
│   │   ├── Dashboard/
│   │   ├── Tenants/
│   │   ├── Revenue/
│   │   └── ...
│   │
│   ├── tenant/                     # Tenant Admin components
│   │   ├── Dashboard/
│   │   ├── Stations/
│   │   ├── Devices/
│   │   └── ...
│   │
│   └── shared/                     # Shared components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── Layout.tsx
│       └── ...
│
├── lib/                            # Utilities & Libraries
│   ├── db/                         # Database
│   │   ├── connection.ts           # MySQL connection
│   │   ├── migrations/             # Database migrations
│   │   └── seeds/                  # Seed data
│   │
│   ├── auth/                       # Authentication
│   │   ├── jwt.ts
│   │   ├── middleware.ts
│   │   └── session.ts
│   │
│   ├── api/                        # API utilities
│   │   ├── client.ts               # API client
│   │   └── errors.ts               # Error handling
│   │
│   ├── utils/                      # Helper functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── ...
│   │
│   └── types/                      # TypeScript types
│       ├── user.ts
│       ├── tenant.ts
│       ├── device.ts
│       └── ...
│
├── middleware.ts                    # Next.js middleware
├── types/                           # Global types
├── public/                          # Static files
│   ├── images/
│   └── qr-codes/
│
├── .env.local                      # Environment variables
├── .env.example                    # Example env file
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

---

## 2. DATABASE SCHEMA (MySQL)

### 2.1. Users Table
```sql
CREATE TABLE users (
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
```

### 2.2. Tenants Table
```sql
CREATE TABLE tenants (
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
```

### 2.3. Stations Table
```sql
CREATE TABLE stations (
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
```

### 2.4. Devices Table
```sql
CREATE TABLE devices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  station_id INT NULL,
  device_id VARCHAR(255) UNIQUE NOT NULL,  -- ESP32 unique ID
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
```

### 2.5. Pricing Packages Table
```sql
CREATE TABLE pricing_packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  station_id INT NULL,  -- NULL means apply to all stations
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_minutes INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);
```

### 2.6. Transactions Table
```sql
CREATE TABLE transactions (
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
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  FOREIGN KEY (pricing_package_id) REFERENCES pricing_packages(id) ON DELETE CASCADE
);
```

### 2.7. Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  plan_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  billing_cycle ENUM('monthly', 'yearly') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active', 'suspended', 'expired', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);
```

### 2.8. Invoices Table
```sql
CREATE TABLE invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  subscription_id INT NULL,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);
```

### 2.9. Leads Table
```sql
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  message TEXT,
  status ENUM('new', 'contacted', 'qualified', 'converted', 'lost') DEFAULT 'new',
  source VARCHAR(100),  -- website, referral, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2.10. Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lead_id INT NULL,
  tenant_id INT NULL,  -- NULL until converted
  order_number VARCHAR(100) UNIQUE NOT NULL,
  package_name VARCHAR(255) NOT NULL,
  hardware_price DECIMAL(10, 2) NOT NULL,
  setup_fee DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('draft', 'pending', 'confirmed', 'delivered', 'completed', 'cancelled') DEFAULT 'draft',
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);
```

### 2.11. Device Commands Table
```sql
CREATE TABLE device_commands (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id INT NOT NULL,
  command_type ENUM('start', 'stop', 'restart', 'update_firmware', 'config') NOT NULL,
  command_data JSON,
  status ENUM('pending', 'sent', 'executed', 'failed') DEFAULT 'pending',
  response_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  executed_at TIMESTAMP NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);
```

### 2.12. Device Logs Table
```sql
CREATE TABLE device_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  device_id INT NOT NULL,
  log_level ENUM('info', 'warning', 'error') DEFAULT 'info',
  message TEXT NOT NULL,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_device_created (device_id, created_at)
);
```

### 2.13. Support Tickets Table
```sql
CREATE TABLE support_tickets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NULL,  -- NULL for super admin tickets
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.14. Ticket Comments Table
```sql
CREATE TABLE ticket_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ticket_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2.15. Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_created (user_id, created_at),
  INDEX idx_entity (entity_type, entity_id)
);
```

---

## 3. SETUP HƯỚNG DẪN

### 3.1. Yêu cầu hệ thống
- Node.js 18+ 
- MySQL 8.0+
- npm hoặc yarn

### 3.2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### 3.3. Cấu hình môi trường
Tạo file `.env.local`:
```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/car_wash_db

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=30d

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Payment Gateway SePay (tùy chọn)
SEPAY_QR_BASE_URL=https://qr.sepay.vn/img
SEPAY_BANK_ACCOUNT=your-bank-account
SEPAY_BANK_CODE=MB
SEPAY_ACCOUNT_NAME=YOUR_ACCOUNT_NAME
SEPAY_WEBHOOK_SECRET=your-webhook-secret

# Email (tùy chọn)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password

# MQTT (cho ESP32)
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password
```

### 3.4. Setup Database
```bash
# Tạo database
mysql -u root -p
CREATE DATABASE car_wash_db;

# Chạy migrations (sẽ tạo sau)
npm run migrate

# Seed data (sẽ tạo sau)
npm run seed
```

### 3.5. Chạy development server
```bash
npm run dev
# hoặc
yarn dev
```

Truy cập: http://localhost:3000

---

## 4. CÔNG NGHỆ SỬ DỤNG

### 4.1. Frontend
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui** (UI components - tùy chọn)
- **Recharts** (cho charts)
- **React Hook Form** (form handling)
- **Zod** (validation)

### 4.2. Backend
- **Next.js API Routes**
- **MySQL2** (database driver)
- **Prisma** hoặc **Drizzle ORM** (tùy chọn)
- **JWT** (authentication)
- **bcrypt** (password hashing)
- **MQTT.js** (cho ESP32 communication)

### 4.3. Utilities
- **date-fns** (date manipulation)
- **axios** (HTTP client)
- **qrcode** (QR code generation)
- **ExcelJS** (Excel export)
- **PDFKit** (PDF generation)

---

## 5. SCRIPTS

Thêm vào `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "migrate": "node lib/db/migrate.js",
    "seed": "node lib/db/seed.js"
  }
}
```

---

## 6. GHI CHÚ

- Sử dụng Next.js App Router (không phải Pages Router)
- Tất cả API routes nằm trong `app/api/`
- Sử dụng Server Components khi có thể
- Client Components chỉ khi cần interactivity
- Middleware để bảo vệ routes
- TypeScript strict mode
- Environment variables validation

---

## 7. NEXT STEPS

1. Tạo database schema
2. Setup authentication
3. Tạo API routes cơ bản
4. Tạo UI components
5. Implement Super Admin dashboard
6. Implement Tenant Admin dashboard
7. Tích hợp ESP32 communication
8. Testing và deployment
