# KẾ HOẠCH TRIỂN KHAI THEO TỪNG GIAI ĐOẠN

Tài liệu này chia nhỏ dự án thành các giai đoạn nhỏ, mỗi giai đoạn có thể được triển khai và test độc lập. Bạn có thể yêu cầu chat làm từng giai đoạn một.

---

## 📋 TỔNG QUAN CÁC GIAI ĐOẠN

**Tổng cộng: 20 giai đoạn nhỏ**

- **Phase 1: Setup & Foundation** (Giai đoạn 1-3)
- **Phase 2: Core System** (Giai đoạn 4-8)
- **Phase 3: Multi-Tenant** (Giai đoạn 9-12)
- **Phase 4: Super Admin** (Giai đoạn 13-15)
- **Phase 5: Tenant Admin** (Giai đoạn 16-18)
- **Phase 6: Advanced Features** (Giai đoạn 19-20)

---

## 🚀 PHASE 1: SETUP & FOUNDATION

### Giai đoạn 1: Khởi tạo dự án Next.js
**Mục tiêu:** Setup cơ bản Next.js với TypeScript và Tailwind CSS

**Công việc:**
- [x] Tạo dự án Next.js với TypeScript
- [x] Cài đặt và cấu hình Tailwind CSS
- [x] Setup cấu trúc thư mục cơ bản (app/, components/, lib/)
- [ ] Tạo file `.env.example` và `.env.local`
- [x] Cấu hình `tsconfig.json` và `next.config.js`
- [x] Tạo file `package.json` với các dependencies cơ bản

**Dependencies cần cài:**
```
next, react, react-dom, typescript
tailwindcss, postcss, autoprefixer
```

**Kết quả:** Dự án Next.js chạy được ở localhost:3000

**Lệnh test:**
```bash
npm run dev
```

---

### Giai đoạn 2: Setup Database MySQL
**Mục tiêu:** Kết nối MySQL và tạo database schema cơ bản

**Công việc:**
- [ ] Cài đặt MySQL2 hoặc Prisma
- [ ] Tạo file kết nối database (`lib/db/connection.ts`)
- [ ] Tạo database `car_wash_db`
- [ ] Tạo các bảng cơ bản: `users`, `tenants`
- [ ] Tạo migration script
- [ ] Test kết nối database

**Dependencies cần cài:**
```
mysql2
# hoặc
@prisma/client, prisma
```

**Kết quả:** Database được tạo và có thể kết nối từ Next.js

**Lệnh test:**
```bash
npm run migrate
```

---

### Giai đoạn 3: Authentication System Cơ bản
**Mục tiêu:** Hệ thống đăng nhập/đăng xuất cơ bản

**Công việc:**
- [ ] Cài đặt JWT và bcrypt
- [ ] Tạo API routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/register`
- [ ] Tạo middleware authentication
- [ ] Tạo trang login (`/login`)
- [ ] Tạo trang register (chỉ cho Super Admin)
- [ ] Hash password với bcrypt
- [ ] Tạo JWT token khi login

**Dependencies cần cài:**
```
jsonwebtoken, bcryptjs
@types/jsonwebtoken, @types/bcryptjs
```

**Kết quả:** Có thể đăng nhập và nhận JWT token

**Lệnh test:**
```bash
# Test API với Postman hoặc curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

---

## 🔧 PHASE 2: CORE SYSTEM

### Giai đoạn 4: User & Tenant Management (API)
**Mục tiêu:** API quản lý users và tenants

**Công việc:**
- [x] Tạo API `/api/super-admin/tenants` (GET, POST, PUT, DELETE)
- [x] Tạo API `/api/super-admin/tenants/:id`
- [x] Validation cho tenant data
- [x] Phân quyền (chỉ Super Admin)
- [x] Test CRUD operations

**Kết quả:** Có thể tạo, đọc, cập nhật, xóa tenant qua API

**Đã triển khai:**
- ✅ API routes đầy đủ CRUD operations
- ✅ Validation utility (`lib/utils/validation.ts`) với các rules:
  - Email format validation
  - Phone number validation (Vietnam format)
  - Date format và date range validation
  - Subscription status validation
  - License max devices validation
  - Name và address validation
- ✅ Phân quyền Super Admin được enforce ở tất cả endpoints
- ✅ Error handling cải thiện với thông báo lỗi chi tiết
- ✅ Response messages rõ ràng và consistent

**Test cases:**
- Tạo tenant mới
- Lấy danh sách tenants
- Cập nhật tenant
- Xóa tenant

---

### Giai đoạn 5: Station Management (API)
**Mục tiêu:** API quản lý trạm rửa xe

**Công việc:**
- [x] Tạo bảng `stations` trong database
- [x] Tạo API `/api/tenant/stations` (GET, POST, PUT, DELETE)
- [x] Tạo API `/api/tenant/stations/:id`
- [x] Validation và phân quyền (Tenant Admin chỉ thấy trạm của mình)
- [x] Test CRUD operations

**Kết quả:** Tenant Admin có thể quản lý trạm của mình qua API

**Đã triển khai:**
- ✅ Migration cho bảng `stations` (`003_create_stations_table.ts`)
- ✅ Database functions (`lib/db/stations.ts`) với các hàm:
  - `getStationsByTenantId()` - Lấy danh sách stations theo tenant
  - `getStationById()` - Lấy chi tiết station
  - `getStationByIdAndTenantId()` - Kiểm tra ownership
  - `createStation()` - Tạo station mới
  - `updateStation()` - Cập nhật station
  - `softDeleteStation()` - Xóa station (soft delete)
- ✅ Validation utility cho stations:
  - Station name validation (2-255 characters)
  - QR code validation (alphanumeric, hyphens, underscores)
  - Latitude/longitude validation
  - Address validation
- ✅ API routes đầy đủ CRUD operations:
  - `GET /api/tenant/stations` - Lấy danh sách (Tenant Admin chỉ thấy của mình, Super Admin có thể filter theo tenant_id)
  - `POST /api/tenant/stations` - Tạo station mới
  - `GET /api/tenant/stations/:id` - Lấy chi tiết
  - `PUT /api/tenant/stations/:id` - Cập nhật
  - `DELETE /api/tenant/stations/:id` - Xóa (soft delete)
- ✅ Phân quyền Tenant Admin:
  - Tenant Admin chỉ thấy và quản lý stations của tenant mình
  - Super Admin có thể xem tất cả (với query param tenant_id)
  - Ownership được kiểm tra ở tất cả operations
- ✅ Error handling với thông báo lỗi chi tiết

---

### Giai đoạn 6: Device Management (API)
**Mục tiêu:** API quản lý thiết bị ESP32

**Công việc:**
- [x] Tạo bảng `devices` trong database
- [x] Tạo API `/api/tenant/devices` (GET, POST, PUT, DELETE)
- [x] Tạo API `/api/tenant/devices/:id`
- [x] Tạo API `/api/iot/device/register` (cho ESP32 đăng ký)
- [x] Tạo API `/api/iot/device/heartbeat` (keep-alive)
- [x] Tracking device status (online/offline)
- [x] Test device registration và heartbeat

**Kết quả:** ESP32 có thể đăng ký và gửi heartbeat, hệ thống track được status

**Đã triển khai:**
- ✅ Migration cho bảng `devices` (`004_create_devices_table.ts`)
- ✅ Database functions (`lib/db/devices.ts`) với các hàm:
  - `getDevicesByTenantId()` - Lấy danh sách devices theo tenant (có thể filter theo station)
  - `getDeviceById()` - Lấy chi tiết device
  - `getDeviceByDeviceId()` - Lấy device theo ESP32 unique ID
  - `getDeviceByIdAndTenantId()` - Kiểm tra ownership
  - `createDevice()` - Tạo device mới
  - `updateDevice()` - Cập nhật device
  - `updateDeviceHeartbeat()` - Cập nhật heartbeat và set status = online
  - `updateDeviceStatus()` - Cập nhật device status
  - `softDeleteDevice()` - Xóa device (soft delete)
  - `markOfflineDevices()` - Đánh dấu devices offline (không có heartbeat trong X phút)
- ✅ Validation utility cho devices:
  - Device ID validation (alphanumeric, hyphens, underscores)
  - Device name validation (2-255 characters)
  - Device status validation (online, offline, maintenance)
  - Firmware version validation (max 50 characters)
- ✅ API routes đầy đủ CRUD operations:
  - `GET /api/tenant/devices` - Lấy danh sách (Tenant Admin chỉ thấy của mình, Super Admin có thể filter theo tenant_id, có thể filter theo station_id)
  - `POST /api/tenant/devices` - Tạo device mới
  - `GET /api/tenant/devices/:id` - Lấy chi tiết
  - `PUT /api/tenant/devices/:id` - Cập nhật
  - `DELETE /api/tenant/devices/:id` - Xóa (soft delete)
- ✅ IoT APIs cho ESP32:
  - `POST /api/iot/device/register` - Đăng ký device (nếu đã tồn tại thì cập nhật heartbeat)
  - `POST /api/iot/device/heartbeat` - Gửi heartbeat (keep-alive), tự động set status = online
- ✅ Device status tracking:
  - Tự động cập nhật `last_heartbeat` khi nhận heartbeat
  - Tự động set status = 'online' khi nhận heartbeat
  - Có thể cập nhật status thủ công (online/offline/maintenance)
  - Function `markOfflineDevices()` để đánh dấu devices offline (có thể chạy cron job)
- ✅ Phân quyền Tenant Admin:
  - Tenant Admin chỉ thấy và quản lý devices của tenant mình
  - Super Admin có thể xem tất cả (với query param tenant_id)
  - Ownership được kiểm tra ở tất cả operations

---

### Giai đoạn 7: Pricing Management (API)
**Mục tiêu:** API quản lý gói giá

**Công việc:**
- [x] Tạo bảng `pricing_packages` trong database
- [x] Tạo API `/api/tenant/pricing` (GET, POST, PUT, DELETE)
- [x] Tạo API `/api/tenant/pricing/:id`
- [x] Validation pricing rules
- [x] Test CRUD operations

**Kết quả:** Tenant Admin có thể tạo và quản lý gói giá

**Đã triển khai:**
- ✅ Migration cho bảng `pricing_packages` (`005_create_pricing_packages_table.ts`)
- ✅ Database functions (`lib/db/pricing.ts`) với các hàm:
  - `getPricingPackagesByTenantId()` - Lấy danh sách pricing packages theo tenant (có thể filter theo station)
  - `getPricingPackageById()` - Lấy chi tiết pricing package
  - `getPricingPackageByIdAndTenantId()` - Kiểm tra ownership
  - `createPricingPackage()` - Tạo pricing package mới
  - `updatePricingPackage()` - Cập nhật pricing package
  - `softDeletePricingPackage()` - Xóa pricing package (soft delete)
- ✅ Validation utility cho pricing packages:
  - Pricing package name validation (2-255 characters)
  - Price validation (>= 0, max 2 decimal places)
  - Duration minutes validation (positive integer)
  - Station ID validation (optional)
- ✅ API routes đầy đủ CRUD operations:
  - `GET /api/tenant/pricing` - Lấy danh sách (Tenant Admin chỉ thấy của mình, Super Admin có thể filter theo tenant_id, có thể filter theo station_id)
  - `POST /api/tenant/pricing` - Tạo pricing package mới
  - `GET /api/tenant/pricing/:id` - Lấy chi tiết
  - `PUT /api/tenant/pricing/:id` - Cập nhật
  - `DELETE /api/tenant/pricing/:id` - Xóa (soft delete)
- ✅ Tính năng đặc biệt:
  - `station_id = NULL` có nghĩa là áp dụng cho tất cả stations của tenant
  - `station_id = specific_id` có nghĩa là chỉ áp dụng cho station đó
  - Khi filter theo station_id, sẽ trả về cả packages có station_id = NULL (áp dụng cho tất cả)
- ✅ Phân quyền Tenant Admin:
  - Tenant Admin chỉ thấy và quản lý pricing packages của tenant mình
  - Super Admin có thể xem tất cả (với query param tenant_id)
  - Ownership được kiểm tra ở tất cả operations

---

### Giai đoạn 8: Transaction & Payment (API)
**Mục tiêu:** API xử lý giao dịch và thanh toán

**Công việc:**
- [x] Tạo bảng `transactions` trong database
- [x] Tạo API `/api/public/payment/init` (khởi tạo thanh toán)
- [x] Tạo API `/api/public/payment/callback` (callback từ payment gateway)
- [x] Tạo API `/api/public/device/:deviceId/start` (bắt đầu sử dụng)
- [x] Tạo API `/api/public/device/:deviceId/stop` (dừng sử dụng)
- [x] Tích hợp payment gateway cơ bản (VNPay hoặc mock)
- [x] Test payment flow

**Kết quả:** Có thể tạo giao dịch và xử lý thanh toán

**Đã triển khai:**
- ✅ Migration cho bảng `transactions` (`006_create_transactions_table.ts`)
- ✅ Database functions (`lib/db/transactions.ts`) với các hàm:
  - `getTransactionsByTenantId()` - Lấy danh sách transactions theo tenant (có thể filter theo station, device, status)
  - `getTransactionById()` - Lấy chi tiết transaction
  - `getTransactionByPaymentTransactionId()` - Lấy transaction theo payment transaction ID
  - `getTransactionByQRCode()` - Lấy transaction theo QR code
  - `getActiveTransactionByDeviceId()` - Lấy transaction đang active của device
  - `createTransaction()` - Tạo transaction mới
  - `updateTransaction()` - Cập nhật transaction
  - `startTransaction()` - Bắt đầu transaction (set started_at và status = completed)
  - `endTransaction()` - Kết thúc transaction (set ended_at)
  - `updateTransactionStatus()` - Cập nhật transaction status
- ✅ Payment Gateway Mock (`lib/payment/mock.ts`):
  - `initPayment()` - Khởi tạo thanh toán (mock - có thể thay bằng VNPay)
  - `verifyPaymentCallback()` - Xác thực callback từ payment gateway (mock)
  - Sẵn sàng để tích hợp VNPay hoặc payment gateway thật
- ✅ API routes đầy đủ:
  - `POST /api/public/payment/init` - Khởi tạo thanh toán:
    - Validate device, pricing package, station
    - Tạo transaction với status = 'pending'
    - Trả về payment URL và transaction ID
  - `GET /api/public/payment/callback` - Callback từ payment gateway:
    - Verify payment callback
    - Cập nhật transaction status (completed/failed)
    - Redirect về trang success/failed
  - `POST /api/public/device/:deviceId/start` - Bắt đầu sử dụng:
    - Kiểm tra device available và online
    - Kiểm tra transaction đã completed
    - Kiểm tra không có transaction đang active
    - Set started_at và status = 'completed'
  - `POST /api/public/device/:deviceId/stop` - Dừng sử dụng:
    - Có thể chỉ định transaction_id hoặc tự động lấy transaction đang active
    - Set ended_at
    - Tính thời gian sử dụng thực tế
- ✅ Business logic:
  - Kiểm tra device online và available trước khi start
  - Kiểm tra pricing package áp dụng cho station
  - Kiểm tra transaction đã completed trước khi start
  - Ngăn chặn multiple active transactions trên cùng device
  - Tính toán thời gian sử dụng thực tế
- ✅ Transaction status flow:
  - `pending` → `completed` (sau khi thanh toán thành công)
  - `pending` → `failed` (nếu thanh toán thất bại)
  - Transaction được start khi `status = completed` và chưa có `started_at`

---

## 🏢 PHASE 3: MULTI-TENANT

### Giai đoạn 9: Multi-Tenant Middleware
**Mục tiêu:** Đảm bảo tenant isolation

**Công việc:**
- [ ] Tạo middleware để tự động filter theo `tenant_id`
- [ ] Update tất cả API routes để sử dụng middleware
- [ ] Đảm bảo Tenant Admin chỉ thấy dữ liệu của mình
- [ ] Test tenant isolation

**Kết quả:** Dữ liệu của các tenant được cách ly hoàn toàn

---

### Giai đoạn 10: QR Code Generation
**Mục tiêu:** Tạo và quản lý QR codes

**Công việc:**
- [ ] Cài đặt thư viện QR code
- [ ] Tạo API `/api/tenant/qr-codes` (GET, POST)
- [ ] Tạo API `/api/tenant/qr-codes/:id/download`
- [ ] Tạo API `/api/public/qr/:code` (lấy thông tin từ QR)
- [ ] Generate QR code image (PNG/PDF)
- [ ] Link QR code với station và device

**Dependencies cần cài:**
```
qrcode, @types/qrcode
```

**Kết quả:** Có thể tạo và download QR code

---

### Giai đoạn 11: Device Commands System
**Mục tiêu:** Hệ thống gửi lệnh đến ESP32

**Công việc:**
- [ ] Tạo bảng `device_commands` trong database
- [ ] Tạo API `/api/tenant/devices/:id/command` (gửi lệnh)
- [ ] Tạo API `/api/iot/device/:id/commands` (ESP32 lấy lệnh)
- [ ] Tạo API `/api/iot/device/:id/response` (ESP32 phản hồi)
- [ ] Queue system cho lệnh chờ xử lý
- [ ] Test command flow

**Kết quả:** Có thể gửi lệnh đến ESP32 và nhận phản hồi

---

### Giai đoạn 12: Device Monitoring & Alerts
**Mục tiêu:** Giám sát thiết bị và cảnh báo

**Công việc:**
- [ ] Tạo bảng `device_logs` trong database
- [ ] Tạo API `/api/iot/device/:id/logs` (ESP32 gửi logs)
- [ ] Tạo API `/api/tenant/devices/:id/monitoring` (real-time status)
- [ ] Logic phát hiện thiết bị offline > 5 phút
- [ ] Tạo alert system (có thể chỉ log, chưa cần email/SMS)
- [ ] Test monitoring và alerts

**Kết quả:** Hệ thống phát hiện và cảnh báo khi thiết bị offline

---

## 👑 PHASE 4: SUPER ADMIN DASHBOARD

### Giai đoạn 13: Super Admin Layout & Navigation
**Mục tiêu:** Layout và navigation cho Super Admin

**Công việc:**
- [ ] Tạo layout component cho Super Admin (`components/super-admin/Layout.tsx`)
- [ ] Tạo sidebar navigation
- [ ] Tạo header với user info và logout
- [ ] Tạo protected route middleware cho `/super-admin/*`
- [ ] Tạo trang `/super-admin/dashboard` cơ bản

**Kết quả:** Có layout và navigation cho Super Admin

---

### Giai đoạn 14: Super Admin - Quản lý Tenant
**Mục tiêu:** Trang quản lý tenant cho Super Admin

**Công việc:**
- [ ] Tạo trang `/super-admin/tenants` (danh sách)
- [ ] Tạo trang `/super-admin/tenants/new` (tạo mới)
- [ ] Tạo trang `/super-admin/tenants/:id` (chi tiết)
- [ ] Tạo trang `/super-admin/tenants/:id/edit` (chỉnh sửa)
- [ ] Tạo components: TenantList, TenantForm, TenantDetail
- [ ] Tích hợp với API đã tạo ở giai đoạn 4
- [ ] Test CRUD operations

**Kết quả:** Super Admin có thể quản lý tenants qua UI

---

### Giai đoạn 15: Super Admin - Dashboard & Reports
**Mục tiêu:** Dashboard tổng quan và báo cáo

**Công việc:**
- [ ] Tạo API `/api/super-admin/revenue` (tổng doanh thu)
- [ ] Tạo API `/api/super-admin/revenue/analytics`
- [ ] Tạo trang `/super-admin/dashboard` với:
  - Cards tổng quan (số tenant, số thiết bị, doanh thu)
  - Biểu đồ doanh thu (sử dụng Recharts)
  - Top tenants
- [ ] Tạo trang `/super-admin/revenue` với biểu đồ chi tiết
- [ ] Tạo trang `/super-admin/revenue/compare` (so sánh tenant)
- [ ] Test dashboard và reports

**Dependencies cần cài:**
```
recharts
```

**Kết quả:** Super Admin có dashboard với thống kê và biểu đồ

---

## 🏪 PHASE 5: TENANT ADMIN DASHBOARD

### Giai đoạn 16: Tenant Admin Layout & Navigation
**Mục tiêu:** Layout và navigation cho Tenant Admin

**Công việc:**
- [ ] Tạo layout component cho Tenant Admin (`components/tenant/Layout.tsx`)
- [ ] Tạo sidebar navigation
- [ ] Tạo header với user info và logout
- [ ] Tạo protected route middleware cho `/tenant/*`
- [ ] Tạo trang `/tenant/dashboard` cơ bản

**Kết quả:** Có layout và navigation cho Tenant Admin

---

### Giai đoạn 17: Tenant Admin - Quản lý Trạm & Thiết bị
**Mục tiêu:** Trang quản lý trạm và thiết bị cho Tenant Admin

**Công việc:**
- [ ] Tạo trang `/tenant/stations` (danh sách trạm)
- [ ] Tạo trang `/tenant/stations/new` (tạo trạm mới)
- [ ] Tạo trang `/tenant/stations/:id` (chi tiết trạm + QR code)
- [ ] Tạo trang `/tenant/devices` (danh sách thiết bị)
- [ ] Tạo trang `/tenant/devices/new` (đăng ký thiết bị)
- [ ] Tạo trang `/tenant/devices/:id` (chi tiết + monitoring)
- [ ] Tạo components: StationList, StationForm, DeviceList, DeviceForm
- [ ] Tích hợp với API đã tạo ở giai đoạn 5, 6
- [ ] Test CRUD operations

**Kết quả:** Tenant Admin có thể quản lý trạm và thiết bị qua UI

---

### Giai đoạn 18: Tenant Admin - Gói giá, Giao dịch & Doanh thu
**Mục tiêu:** Trang quản lý gói giá, xem giao dịch và doanh thu

**Công việc:**
- [ ] Tạo trang `/tenant/pricing` (danh sách gói giá)
- [ ] Tạo trang `/tenant/pricing/new` (tạo gói giá mới)
- [ ] Tạo trang `/tenant/transactions` (danh sách giao dịch)
- [ ] Tạo trang `/tenant/revenue` (doanh thu)
- [ ] Tạo trang `/tenant/revenue/analytics` (phân tích)
- [ ] Tạo API `/api/tenant/revenue` và `/api/tenant/revenue/analytics`
- [ ] Tạo components: PricingList, TransactionList, RevenueChart
- [ ] Tích hợp với API đã tạo ở giai đoạn 7, 8
- [ ] Test các trang

**Kết quả:** Tenant Admin có thể quản lý gói giá và xem giao dịch/doanh thu

---

## 🚀 PHASE 6: ADVANCED FEATURES

### Giai đoạn 19: Subscription & Billing System
**Mục tiêu:** Hệ thống subscription và billing

**Công việc:**
- [ ] Tạo bảng `subscriptions` và `invoices` trong database
- [ ] Tạo API `/api/super-admin/subscriptions` (CRUD)
- [ ] Tạo API `/api/super-admin/billing` (tạo hóa đơn)
- [ ] Tạo trang `/super-admin/subscriptions` (quản lý subscription)
- [ ] Tạo trang `/super-admin/billing` (quản lý hóa đơn)
- [ ] Tạo cron job để tạo hóa đơn tự động hàng tháng
- [ ] Tạo logic vô hiệu hóa tenant nếu quá hạn
- [ ] Test subscription và billing flow

**Kết quả:** Hệ thống tự động tạo hóa đơn và quản lý subscription

---

### Giai đoạn 20: Lead & Order Management
**Mục tiêu:** Quản lý leads và đơn hàng

**Công việc:**
- [ ] Tạo bảng `leads` và `orders` trong database
- [ ] Tạo API `/api/super-admin/leads` (CRUD)
- [ ] Tạo API `/api/super-admin/orders` (CRUD)
- [ ] Tạo trang `/super-admin/sales/leads` (quản lý leads)
- [ ] Tạo trang `/super-admin/sales/orders` (quản lý đơn hàng)
- [ ] Tạo logic tự động tạo tenant khi đơn hàng được xác nhận
- [ ] Tạo form đăng ký demo ở trang public
- [ ] Test lead và order flow

**Kết quả:** Super Admin có thể quản lý leads và đơn hàng, tự động tạo tenant

---

## 📝 HƯỚNG DẪN SỬ DỤNG

### Cách yêu cầu chat làm từng giai đoạn:

**Ví dụ 1:**
```
Bạn làm cho tôi Giai đoạn 1: Khởi tạo dự án Next.js
```

**Ví dụ 2:**
```
Tôi muốn triển khai Giai đoạn 5: Station Management (API)
```

**Ví dụ 3:**
```
Làm cho tôi Giai đoạn 13: Super Admin Layout & Navigation
```

### Lưu ý khi làm từng giai đoạn:

1. **Kiểm tra dependencies:** Mỗi giai đoạn có thể cần cài thêm packages
2. **Test sau mỗi giai đoạn:** Đảm bảo giai đoạn trước hoạt động trước khi làm tiếp
3. **Tham khảo README khác:** 
   - `README_ROUTES.md` - để biết routes cần tạo
   - `README_FEATURES.md` - để biết chi tiết chức năng
   - `README_STRUCTURE.md` - để biết cấu trúc database và code

### Thứ tự ưu tiên:

**Bắt buộc theo thứ tự:**
- Giai đoạn 1 → 2 → 3 (Foundation)
- Giai đoạn 4 → 5 → 6 → 7 → 8 (Core API)
- Giai đoạn 9 (Multi-tenant middleware) phải làm trước các giai đoạn sau
- Giai đoạn 13 → 14 → 15 (Super Admin)
- Giai đoạn 16 → 17 → 18 (Tenant Admin)

**Có thể làm song song:**
- Giai đoạn 10, 11, 12 (sau khi có giai đoạn 9)
- Giai đoạn 19, 20 (sau khi có Super Admin cơ bản)

---

## ✅ CHECKLIST TỔNG QUAN

Sau khi hoàn thành tất cả giai đoạn, bạn sẽ có:

- [x] Hệ thống authentication hoàn chỉnh
- [x] Multi-tenant system với tenant isolation
- [x] Quản lý trạm, thiết bị, gói giá
- [x] Hệ thống thanh toán và giao dịch
- [x] QR code generation
- [x] Device monitoring và alerts
- [x] Super Admin dashboard đầy đủ
- [x] Tenant Admin dashboard đầy đủ
- [x] Subscription và billing system
- [x] Lead và order management

---

## 🎯 NEXT STEPS SAU KHI HOÀN THÀNH

1. Testing toàn bộ hệ thống
2. Tối ưu performance
3. Security audit
4. Documentation
5. Deployment

---

**Lưu ý:** Mỗi giai đoạn được thiết kế để có thể test độc lập. Nếu gặp lỗi ở giai đoạn nào, hãy fix trước khi chuyển sang giai đoạn tiếp theo.
