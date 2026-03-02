# CHỨC NĂNG CHI TIẾT - HỆ THỐNG RỬA XE TỰ ĐỘNG

Tài liệu này mô tả chi tiết các chức năng cần triển khai cho từng phần của hệ thống.

---

## 1. SERVER (Backend API)

### 1.1. Authentication & Authorization
**Chức năng:**
- Đăng nhập/đăng xuất cho Super Admin và Tenant Admin
- JWT token-based authentication
- Refresh token mechanism
- Phân quyền theo role (SUPER_ADMIN, TENANT_ADMIN)
- Quên mật khẩu và đặt lại mật khẩu
- Multi-factor authentication (tùy chọn)

**Yêu cầu kỹ thuật:**
- Hash password bằng bcrypt
- Token expiration và refresh
- Session management
- Audit log cho mọi hành động đăng nhập

---

### 1.2. Multi-Tenant Management
**Chức năng:**
- Tạo/sửa/xóa tenant
- Mỗi tenant có không gian dữ liệu riêng biệt
- Tenant isolation (dữ liệu cách ly hoàn toàn)
- Quản lý license cho từng tenant (số lượng thiết bị được phép)
- Kích hoạt/vô hiệu hóa tenant dựa trên subscription

**Yêu cầu kỹ thuật:**
- Database schema hỗ trợ multi-tenant (tenant_id trong mọi bảng)
- Middleware tự động filter theo tenant_id
- Soft delete cho tenant

---

### 1.3. Device Management (ESP32)
**Chức năng:**
- Đăng ký thiết bị ESP32 với ID duy nhất
- Liên kết thiết bị với tenant cụ thể
- Gửi lệnh đến thiết bị (start, stop, update firmware)
- Nhận heartbeat từ thiết bị (keep-alive)
- Theo dõi trạng thái thiết bị (online/offline)
- Cảnh báo khi thiết bị offline > 5 phút
- Quản lý firmware (cập nhật hàng loạt)
- Nhận logs từ ESP32

**Yêu cầu kỹ thuật:**
- MQTT hoặc WebSocket cho real-time communication
- Queue system cho lệnh chờ xử lý
- Device status tracking với timestamp
- Alert system (email/SMS khi thiết bị offline)

---

### 1.4. Station Management
**Chức năng:**
- Tạo/sửa/xóa trạm rửa xe
- Mỗi trạm có QR code riêng
- Liên kết trạm với thiết bị ESP32
- Quản lý thông tin trạm (tên, địa chỉ, GPS nếu có)

**Yêu cầu kỹ thuật:**
- QR code generation (UUID hoặc custom code)
- QR code storage (database + file system)
- GPS coordinates (nếu có)

---

### 1.5. Pricing Management
**Chức năng:**
- Tenant Admin tự định nghĩa gói giá
- Tỷ lệ tiền/thời gian sử dụng (ví dụ: 10.000 VNĐ = 10 phút)
- Nhiều gói giá cho một trạm
- Áp dụng gói giá theo thời gian (giờ cao điểm/giờ thường)

**Yêu cầu kỹ thuật:**
- Flexible pricing model
- Time-based pricing rules
- Validation pricing rules

---

### 1.6. Transaction & Payment
**Chức năng:**
- Xử lý giao dịch thanh toán
- Tích hợp nhiều cổng thanh toán (Ví điện tử, Banking)
- Callback từ cổng thanh toán
- Quản lý trạng thái giao dịch (pending, success, failed)
- Refund handling
- Transaction history

**Yêu cầu kỹ thuật:**
- Payment gateway integration (VNPay, MoMo, ZaloPay, etc.)
- Webhook handling cho payment callbacks
- Idempotency cho payment requests
- Transaction logging đầy đủ

---

### 1.7. Revenue & Analytics
**Chức năng:**
- Tính toán doanh thu theo tenant
- Tổng doanh thu toàn hệ thống (Super Admin)
- Phân tích doanh thu theo thời gian (ngày, tuần, tháng, năm)
- So sánh doanh thu giữa các tenant
- Export báo cáo (CSV, Excel, PDF)
- Dự báo doanh thu (tùy chọn)

**Yêu cầu kỹ thuật:**
- Aggregation queries cho revenue calculation
- Caching cho analytics (Redis nếu cần)
- Report generation library (ExcelJS, PDFKit)
- Scheduled jobs cho báo cáo tự động

---

### 1.8. Subscription & Billing
**Chức năng:**
- Quản lý subscription của tenant (tháng/năm)
- Tạo hóa đơn tự động hàng tháng
- Theo dõi trạng thái thanh toán
- Tự động vô hiệu hóa tenant nếu quá hạn thanh toán
- Gửi email nhắc nhở thanh toán

**Yêu cầu kỹ thuật:**
- Cron job cho billing automation
- Invoice generation (PDF)
- Payment tracking
- Email service integration

---

### 1.9. Lead & Order Management
**Chức năng:**
- Quản lý leads (khách hàng tiềm năng)
- Tạo đơn hàng từ lead
- Theo dõi trạng thái đơn hàng
- Tích hợp form đăng ký từ website
- Tự động tạo tenant sau khi đơn hàng được xác nhận

**Yêu cầu kỹ thuật:**
- CRM-like functionality
- Order workflow (draft, confirmed, delivered, completed)
- Auto tenant creation on order confirmation

---

### 1.10. System Monitoring
**Chức năng:**
- Giám sát trạng thái hệ thống
- Thống kê tổng quan (số tenant, số thiết bị, số giao dịch)
- Heatmap sử dụng (giờ cao điểm)
- Bản đồ địa lý (nếu ESP32 có GPS)
- System health checks

**Yêu cầu kỹ thuật:**
- Real-time monitoring
- WebSocket cho real-time updates
- Map integration (Google Maps/Mapbox)
- Health check endpoints

---

### 1.11. Support & Tickets
**Chức năng:**
- Tạo ticket hỗ trợ
- Quản lý ticket (open, in-progress, resolved, closed)
- Chat support (tùy chọn)
- Gửi email thông báo khi có ticket mới

**Yêu cầu kỹ thuật:**
- Ticket system với status workflow
- Email notifications
- Real-time chat (WebSocket nếu cần)

---

### 1.12. Audit Logging
**Chức năng:**
- Ghi log mọi hành động quan trọng
- Theo dõi ai làm gì, khi nào
- Export audit logs
- Security audit trail

**Yêu cầu kỹ thuật:**
- Audit log table
- Middleware để tự động log actions
- Log retention policy

---

## 2. TRANG SUPER ADMIN

### 2.1. Dashboard Tổng quan
**Chức năng hiển thị:**
- Tổng số tenants
- Tổng số thiết bị đang hoạt động
- Tổng doanh thu hôm nay/tuần/tháng
- Số giao dịch hôm nay
- Biểu đồ doanh thu theo thời gian
- Top tenants theo doanh thu
- Thiết bị offline (cảnh báo)
- Tickets chưa xử lý

**UI Components:**
- Cards với số liệu tổng quan
- Line chart cho doanh thu
- Bar chart cho so sánh tenant
- Alert notifications
- Quick actions

---

### 2.2. Quản lý Tenant
**Chức năng:**
- Danh sách tenants với filter và search
- Tạo tenant mới (form với validation)
- Chi tiết tenant (thông tin, thiết bị, doanh thu)
- Chỉnh sửa tenant
- Xóa tenant (soft delete)
- Kích hoạt/vô hiệu hóa tenant
- Xem danh sách thiết bị của tenant

**UI Components:**
- Data table với pagination
- Modal form cho create/edit
- Detail view với tabs
- Status badges
- Action buttons

---

### 2.3. Báo cáo Doanh thu
**Chức năng:**
- Tổng doanh thu toàn hệ thống
- Phân tích doanh thu theo thời gian (biểu đồ)
- So sánh doanh thu giữa các tenant
- Filter theo thời gian (ngày, tuần, tháng, năm)
- Export báo cáo (CSV, Excel, PDF)

**UI Components:**
- Date range picker
- Line/Bar charts
- Comparison table
- Export buttons
- Revenue breakdown by tenant

---

### 2.4. Quản lý Bán hàng
**Chức năng:**
- Danh sách leads với filter
- Tạo lead mới
- Chi tiết lead (thông tin, lịch sử tương tác)
- Chuyển lead thành đơn hàng
- Danh sách đơn hàng
- Chi tiết đơn hàng
- Cập nhật trạng thái đơn hàng

**UI Components:**
- Lead pipeline view (kanban)
- Order status workflow
- Form tạo lead/đơn hàng
- Timeline cho lead/order

---

### 2.5. Quản lý Subscription & Billing
**Chức năng:**
- Danh sách subscriptions
- Chi tiết subscription (tenant, gói, ngày hết hạn)
- Tạo subscription mới
- Cập nhật subscription
- Danh sách hóa đơn
- Chi tiết hóa đơn (PDF view)
- Tạo hóa đơn tự động
- Gửi hóa đơn qua email

**UI Components:**
- Subscription list với status
- Invoice PDF viewer
- Calendar view cho renewal dates
- Payment status indicators

---

### 2.6. Quản lý License
**Chức năng:**
- Danh sách licenses
- Tạo license mới (số lượng thiết bị được phép)
- Kích hoạt/vô hiệu hóa license
- Xem license usage (đã dùng bao nhiêu/cho phép bao nhiêu)

**UI Components:**
- License list
- Usage progress bars
- Activation toggle

---

### 2.7. Giám sát Hệ thống
**Chức năng:**
- Dashboard giám sát real-time
- Danh sách tất cả thiết bị với trạng thái
- Bản đồ địa lý (nếu có GPS)
- Heatmap sử dụng (giờ cao điểm)
- System health metrics

**UI Components:**
- Real-time status indicators
- Interactive map
- Heatmap visualization
- System metrics dashboard

---

### 2.8. Hỗ trợ & Tickets
**Chức năng:**
- Danh sách tickets từ tất cả tenants
- Chi tiết ticket
- Cập nhật trạng thái ticket
- Trả lời ticket
- Filter tickets theo status, tenant, priority

**UI Components:**
- Ticket list với filters
- Ticket detail view
- Comment/Reply section
- Status workflow

---

## 3. TRANG TENANT ADMIN

### 3.1. Dashboard Tổng quan
**Chức năng hiển thị:**
- Tổng doanh thu hôm nay/tuần/tháng
- Số giao dịch hôm nay
- Số trạm đang hoạt động
- Số thiết bị online/offline
- Biểu đồ doanh thu
- Top trạm theo doanh thu
- Cảnh báo thiết bị offline

**UI Components:**
- Summary cards
- Revenue charts
- Status indicators
- Quick stats

---

### 3.2. Quản lý Trạm
**Chức năng:**
- Danh sách trạm rửa xe
- Tạo trạm mới (tên, địa chỉ, GPS)
- Chi tiết trạm (thông tin, thiết bị, QR code, doanh thu)
- Chỉnh sửa trạm
- Xóa trạm
- Tải QR code (PNG/PDF)

**UI Components:**
- Station list
- Form create/edit
- QR code display và download
- Station detail view

---

### 3.3. Quản lý Thiết bị ESP32
**Chức năng:**
- Danh sách thiết bị ESP32
- Đăng ký thiết bị mới (ID, tên, liên kết với trạm)
- Chi tiết thiết bị (thông tin, trạng thái, logs)
- Chỉnh sửa thiết bị
- Xóa thiết bị
- Gửi lệnh đến thiết bị (start, stop, restart)
- Giám sát thiết bị real-time
- Xem logs từ thiết bị

**UI Components:**
- Device list với status
- Real-time status indicators
- Command panel
- Log viewer
- Monitoring dashboard

---

### 3.4. Quản lý Gói giá
**Chức năng:**
- Danh sách gói giá
- Tạo gói giá mới (tên, giá tiền, thời gian, trạm áp dụng)
- Chi tiết gói giá
- Chỉnh sửa gói giá
- Xóa gói giá
- Áp dụng gói giá theo thời gian (giờ cao điểm)

**UI Components:**
- Pricing list
- Form create/edit với validation
- Time-based rules editor
- Pricing preview

---

### 3.5. Quản lý Giao dịch
**Chức năng:**
- Danh sách giao dịch với filter
- Chi tiết giao dịch (thông tin, trạm, thiết bị, thời gian)
- Filter theo trạm, thiết bị, thời gian
- Export danh sách giao dịch

**UI Components:**
- Transaction table với filters
- Transaction detail modal
- Export button

---

### 3.6. Quản lý Doanh thu
**Chức năng:**
- Doanh thu theo thời gian
- Phân tích doanh thu (biểu đồ)
- Doanh thu theo trạm
- Doanh thu theo thiết bị
- Export báo cáo doanh thu

**UI Components:**
- Revenue charts
- Breakdown tables
- Date range filter
- Export options

---

### 3.7. Quản lý QR Codes
**Chức năng:**
- Danh sách QR codes (theo trạm)
- Tạo QR code mới (liên kết với trạm)
- Chi tiết QR code
- Tải QR code (PNG/PDF)
- In QR code

**UI Components:**
- QR code list
- QR code preview
- Download/Print buttons

---

### 3.8. Hỗ trợ
**Chức năng:**
- Danh sách tickets của tenant
- Tạo ticket hỗ trợ mới
- Chi tiết ticket
- Trả lời ticket
- Theo dõi trạng thái ticket

**UI Components:**
- Ticket list
- Ticket form
- Ticket detail với comments

---

### 3.9. Cài đặt
**Chức năng:**
- Cập nhật profile (tên, email, số điện thoại)
- Đổi mật khẩu
- Cài đặt thông báo (email, SMS)
- Cài đặt tài khoản

**UI Components:**
- Profile form
- Settings tabs
- Notification preferences

---

## 4. YÊU CẦU CHUNG

### 4.1. UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark mode (tùy chọn)
- Loading states
- Error handling và hiển thị
- Toast notifications
- Confirmation dialogs
- Form validation

### 4.2. Performance
- Lazy loading cho components
- Pagination cho danh sách lớn
- Caching cho data thường dùng
- Optimistic updates

### 4.3. Security
- XSS protection
- CSRF protection
- Input validation
- SQL injection prevention
- Rate limiting

### 4.4. Testing
- Unit tests cho business logic
- Integration tests cho API
- E2E tests cho critical flows

---

## 5. TÍCH HỢP BÊN THỨ BA (Tùy chọn)

- Payment gateways (VNPay, MoMo, ZaloPay)
- Email service (SendGrid, AWS SES)
- SMS service (Twilio, AWS SNS)
- Map service (Google Maps, Mapbox)
- Analytics (Google Analytics)
- CRM (HubSpot)
- Accounting software (QuickBooks)
