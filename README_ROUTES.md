# ROUTES VÀ TRANG WEB - HỆ THỐNG RỬA XE TỰ ĐỘNG

Tài liệu này mô tả tất cả các routes và trang web trong hệ thống, bao gồm Server API, Trang Super Admin và Trang Tenant Admin.

---

## 1. SERVER API ROUTES (Backend)

### 1.1. Authentication Routes
```
POST   /api/auth/login              - Đăng nhập (Super Admin / Tenant Admin)
POST   /api/auth/logout             - Đăng xuất
POST   /api/auth/register           - Đăng ký (chỉ cho Super Admin tạo Tenant)
POST   /api/auth/refresh            - Làm mới token
GET    /api/auth/me                 - Lấy thông tin user hiện tại
POST   /api/auth/forgot-password    - Quên mật khẩu
POST   /api/auth/reset-password     - Đặt lại mật khẩu
```

### 1.2. Super Admin Routes
```
GET    /api/super-admin/tenants              - Danh sách tất cả tenants
GET    /api/super-admin/tenants/:id          - Chi tiết tenant
POST   /api/super-admin/tenants              - Tạo tenant mới
PUT    /api/super-admin/tenants/:id          - Cập nhật tenant
DELETE /api/super-admin/tenants/:id          - Xóa tenant
GET    /api/super-admin/tenants/:id/devices  - Danh sách thiết bị của tenant

GET    /api/super-admin/revenue              - Tổng doanh thu toàn hệ thống
GET    /api/super-admin/revenue/analytics    - Phân tích doanh thu
GET    /api/super-admin/revenue/compare      - So sánh doanh thu giữa tenants

GET    /api/super-admin/leads                - Danh sách leads
GET    /api/super-admin/leads/:id            - Chi tiết lead
POST   /api/super-admin/leads                - Tạo lead mới
PUT    /api/super-admin/leads/:id            - Cập nhật lead
DELETE /api/super-admin/leads/:id            - Xóa lead

GET    /api/super-admin/orders               - Danh sách đơn hàng
GET    /api/super-admin/orders/:id            - Chi tiết đơn hàng
POST   /api/super-admin/orders                - Tạo đơn hàng
PUT    /api/super-admin/orders/:id            - Cập nhật đơn hàng

GET    /api/super-admin/subscriptions         - Danh sách subscriptions
GET    /api/super-admin/subscriptions/:id     - Chi tiết subscription
POST   /api/super-admin/subscriptions         - Tạo subscription
PUT    /api/super-admin/subscriptions/:id     - Cập nhật subscription

GET    /api/super-admin/billing               - Danh sách hóa đơn
GET    /api/super-admin/billing/:id           - Chi tiết hóa đơn
POST   /api/super-admin/billing/generate      - Tạo hóa đơn tự động

GET    /api/super-admin/licenses              - Danh sách licenses
GET    /api/super-admin/licenses/:id          - Chi tiết license
POST   /api/super-admin/licenses              - Tạo license
PUT    /api/super-admin/licenses/:id          - Cập nhật license (kích hoạt/vô hiệu hóa)

GET    /api/super-admin/devices               - Tất cả thiết bị trong hệ thống
GET    /api/super-admin/devices/:id           - Chi tiết thiết bị
GET    /api/super-admin/devices/:id/status    - Trạng thái thiết bị

GET    /api/super-admin/system/monitoring     - Giám sát hệ thống
GET    /api/super-admin/system/stats          - Thống kê hệ thống
GET    /api/super-admin/system/heatmap       - Heatmap sử dụng

GET    /api/super-admin/tickets               - Danh sách tickets hỗ trợ
GET    /api/super-admin/tickets/:id           - Chi tiết ticket
POST   /api/super-admin/tickets               - Tạo ticket
PUT    /api/super-admin/tickets/:id           - Cập nhật ticket

GET    /api/super-admin/audit-logs            - Nhật ký kiểm tra
GET    /api/super-admin/export/revenue        - Export báo cáo doanh thu (CSV/Excel/PDF)
```

### 1.3. Tenant Admin Routes
```
GET    /api/tenant/dashboard                  - Dashboard tổng quan
GET    /api/tenant/stations                   - Danh sách trạm rửa xe
GET    /api/tenant/stations/:id               - Chi tiết trạm
POST   /api/tenant/stations                   - Tạo trạm mới
PUT    /api/tenant/stations/:id               - Cập nhật trạm
DELETE /api/tenant/stations/:id               - Xóa trạm

GET    /api/tenant/devices                    - Danh sách thiết bị ESP32
GET    /api/tenant/devices/:id                - Chi tiết thiết bị
POST   /api/tenant/devices                    - Đăng ký thiết bị mới
PUT    /api/tenant/devices/:id                - Cập nhật thiết bị
DELETE /api/tenant/devices/:id                - Xóa thiết bị
POST   /api/tenant/devices/:id/command        - Gửi lệnh đến thiết bị
GET    /api/tenant/devices/:id/status         - Trạng thái thiết bị

GET    /api/tenant/pricing                    - Danh sách gói giá
GET    /api/tenant/pricing/:id                - Chi tiết gói giá
POST   /api/tenant/pricing                    - Tạo gói giá mới
PUT    /api/tenant/pricing/:id                - Cập nhật gói giá
DELETE /api/tenant/pricing/:id               - Xóa gói giá

GET    /api/tenant/transactions               - Danh sách giao dịch
GET    /api/tenant/transactions/:id           - Chi tiết giao dịch
GET    /api/tenant/transactions/stats         - Thống kê giao dịch

GET    /api/tenant/revenue                    - Doanh thu
GET    /api/tenant/revenue/analytics          - Phân tích doanh thu
GET    /api/tenant/revenue/export             - Export báo cáo doanh thu

GET    /api/tenant/qr-codes                   - Danh sách QR codes
GET    /api/tenant/qr-codes/:id               - Chi tiết QR code
POST   /api/tenant/qr-codes                   - Tạo QR code mới
PUT    /api/tenant/qr-codes/:id               - Cập nhật QR code

GET    /api/tenant/profile                    - Thông tin profile
PUT    /api/tenant/profile                    - Cập nhật profile

GET    /api/tenant/support/tickets            - Danh sách tickets của tenant
POST   /api/tenant/support/tickets            - Tạo ticket hỗ trợ
```

### 1.4. Public/End-User Routes
```
GET    /api/public/qr/:code                  - Lấy thông tin từ QR code
POST   /api/public/payment/init              - Khởi tạo thanh toán
POST   /api/public/payment/callback          - Callback từ cổng thanh toán
POST   /api/public/device/:deviceId/start    - Bắt đầu sử dụng (từ ESP32)
POST   /api/public/device/:deviceId/stop      - Dừng sử dụng (từ ESP32)
GET    /api/public/device/:deviceId/status   - Trạng thái thiết bị (public)
```

### 1.5. ESP32/IoT Routes
```
POST   /api/iot/device/register              - Đăng ký thiết bị ESP32
POST   /api/iot/device/heartbeat             - Gửi heartbeat (keep-alive)
POST   /api/iot/device/status                - Cập nhật trạng thái thiết bị
GET    /api/iot/device/:id/commands          - Lấy lệnh chờ xử lý
POST   /api/iot/device/:id/response          - Phản hồi lệnh
POST   /api/iot/device/:id/logs              - Gửi logs từ ESP32
```

---

## 2. TRANG SUPER ADMIN (Frontend Routes)

### 2.1. Authentication Pages
```
/login                              - Trang đăng nhập Super Admin
/forgot-password                    - Quên mật khẩu
/reset-password                     - Đặt lại mật khẩu
```

### 2.2. Dashboard
```
/super-admin                        - Dashboard tổng quan (redirect)
/super-admin/dashboard              - Dashboard chính với tổng quan hệ thống
```

### 2.3. Quản lý Tenant
```
/super-admin/tenants                - Danh sách tenants
/super-admin/tenants/new            - Tạo tenant mới
/super-admin/tenants/:id            - Chi tiết tenant
/super-admin/tenants/:id/edit       - Chỉnh sửa tenant
/super-admin/tenants/:id/devices    - Danh sách thiết bị của tenant
```

### 2.4. Quản lý Doanh thu
```
/super-admin/revenue                - Tổng doanh thu toàn hệ thống
/super-admin/revenue/analytics      - Phân tích doanh thu (biểu đồ, xu hướng)
/super-admin/revenue/compare        - So sánh doanh thu giữa các tenant
```

### 2.5. Quản lý Bán hàng
```
/super-admin/sales/leads            - Danh sách leads
/super-admin/sales/leads/new        - Tạo lead mới
/super-admin/sales/leads/:id        - Chi tiết lead
/super-admin/sales/orders           - Danh sách đơn hàng
/super-admin/sales/orders/:id       - Chi tiết đơn hàng
/super-admin/sales/orders/new       - Tạo đơn hàng mới
```

### 2.6. Quản lý Subscription & Billing
```
/super-admin/subscriptions          - Danh sách subscriptions
/super-admin/subscriptions/:id      - Chi tiết subscription
/super-admin/billing                - Danh sách hóa đơn
/super-admin/billing/:id            - Chi tiết hóa đơn
/super-admin/billing/generate       - Tạo hóa đơn tự động
```

### 2.7. Quản lý License
```
/super-admin/licenses               - Danh sách licenses
/super-admin/licenses/new           - Tạo license mới
/super-admin/licenses/:id           - Chi tiết license
```

### 2.8. Giám sát Hệ thống
```
/super-admin/monitoring              - Giám sát hệ thống (tổng quan)
/super-admin/monitoring/devices      - Giám sát thiết bị
/super-admin/monitoring/map          - Bản đồ địa lý (nếu có GPS)
/super-admin/monitoring/heatmap      - Heatmap sử dụng
```

### 2.9. Hỗ trợ & Tickets
```
/super-admin/support                - Danh sách tickets
/super-admin/support/:id            - Chi tiết ticket
```

### 2.10. Báo cáo & Export
```
/super-admin/reports                - Trang báo cáo
/super-admin/reports/revenue        - Báo cáo doanh thu
/super-admin/reports/financial      - Báo cáo tài chính
```

### 2.11. Cài đặt
```
/super-admin/settings               - Cài đặt hệ thống
/super-admin/settings/profile       - Profile Super Admin
/super-admin/settings/system        - Cài đặt hệ thống
/super-admin/settings/integrations  - Tích hợp bên thứ ba
```

---

## 3. TRANG TENANT ADMIN (Frontend Routes)

### 3.1. Authentication Pages
```
/tenant/login                       - Trang đăng nhập Tenant Admin
/tenant/forgot-password             - Quên mật khẩu
/tenant/reset-password              - Đặt lại mật khẩu
```

### 3.2. Dashboard
```
/tenant                             - Dashboard tổng quan (redirect)
/tenant/dashboard                   - Dashboard chính với thống kê
```

### 3.3. Quản lý Trạm
```
/tenant/stations                    - Danh sách trạm rửa xe
/tenant/stations/new                - Tạo trạm mới
/tenant/stations/:id                - Chi tiết trạm
/tenant/stations/:id/edit           - Chỉnh sửa trạm
```

### 3.4. Quản lý Thiết bị ESP32
```
/tenant/devices                    - Danh sách thiết bị ESP32
/tenant/devices/new                - Đăng ký thiết bị mới
/tenant/devices/:id                - Chi tiết thiết bị
/tenant/devices/:id/edit           - Chỉnh sửa thiết bị
/tenant/devices/:id/monitoring     - Giám sát thiết bị real-time
```

### 3.5. Quản lý Gói giá
```
/tenant/pricing                    - Danh sách gói giá
/tenant/pricing/new                - Tạo gói giá mới
/tenant/pricing/:id                - Chi tiết gói giá
/tenant/pricing/:id/edit           - Chỉnh sửa gói giá
```

### 3.6. Quản lý Giao dịch
```
/tenant/transactions               - Danh sách giao dịch
/tenant/transactions/:id           - Chi tiết giao dịch
```

### 3.7. Quản lý Doanh thu
```
/tenant/revenue                    - Doanh thu
/tenant/revenue/analytics          - Phân tích doanh thu
/tenant/revenue/export             - Export báo cáo
```

### 3.8. Quản lý QR Codes
```
/tenant/qr-codes                   - Danh sách QR codes
/tenant/qr-codes/new               - Tạo QR code mới
/tenant/qr-codes/:id               - Chi tiết QR code
/tenant/qr-codes/:id/download     - Tải QR code (PNG/PDF)
```

### 3.9. Hỗ trợ
```
/tenant/support                    - Danh sách tickets của tenant
/tenant/support/new                - Tạo ticket hỗ trợ
/tenant/support/:id                - Chi tiết ticket
```

### 3.10. Cài đặt
```
/tenant/settings                   - Cài đặt
/tenant/settings/profile           - Profile Tenant Admin
/tenant/settings/account           - Cài đặt tài khoản
/tenant/settings/notifications     - Cài đặt thông báo
```

---

## 4. TRANG PUBLIC (Nếu cần)

```
/                                   - Landing page (giới thiệu giải pháp)
/pricing                           - Bảng giá
/contact                           - Liên hệ
/demo                              - Form đăng ký demo
/qr/:code                          - Trang quét QR code (cho end-user)
/payment/:transactionId            - Trang thanh toán
```

---

## 5. MIDDLEWARE & PROTECTION

### 5.1. Authentication Middleware
- Tất cả routes `/api/*` (trừ public) cần authentication
- Routes `/super-admin/*` cần role `SUPER_ADMIN`
- Routes `/tenant/*` cần role `TENANT_ADMIN`

### 5.2. Tenant Isolation
- Tenant Admin chỉ truy cập được dữ liệu của chính họ
- Super Admin có quyền truy cập tất cả

### 5.3. Rate Limiting
- API routes có rate limiting
- ESP32 routes có rate limiting riêng

---

## 6. NOTES

- Tất cả routes sử dụng Next.js App Router (app directory)
- API routes nằm trong `app/api/`
- Frontend routes nằm trong `app/`
- Sử dụng middleware để bảo vệ routes
- Sử dụng TypeScript cho type safety
