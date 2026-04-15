# Biểu đồ Trình tự (Sequence Diagrams) - Hệ thống ACW-SRS

Tài liệu này cung cấp các biểu đồ trình tự (Sequence Diagram) mô tả luồng tương tác giữa các thực thể (Người dùng, Frontend, API, Database, Hệ thống ngoài) của nền tảng dựa trên đặc tả hệ thống.

---

## 1. NHÓM XÁC THỰC

### UC-1.1: Đăng nhập
```mermaid
sequenceDiagram
    participant U as Tác nhân (Admin/Tenant)
    participant W as Web Frontend
    participant B as Backend API
    participant D as Database

    U->>W: Nhập Email, Password & Click Đăng nhập
    W->>W: Kiểm tra định dạng (Validate)
    W->>B: POST /api/auth/login
    B->>D: Query bảng users
    D-->>B: Trả về thông tin user
    
    alt Sai thông tin / Khóa tài khoản
        B-->>W: 401 Unauthorized
        W-->>U: Hiển thị lỗi "Tài khoản hoặc mật khẩu không chính xác"
    else Đúng thông tin
        B->>B: Tạo JWT Access Token
        B-->>W: 200 OK (Kèm Access Token)
        W->>W: Lưu Token vào Local Storage
        W-->>U: Điều hướng sang trang Dashboard
    end
```

---

## 2. NHÓM QUẢN LÝ NGƯỜI THUÊ (DÀNH CHO ADMIN)

### UC-2.3: Thêm người thuê (Tương tự cho các thao tác Thêm/Sửa/Xóa)
```mermaid
sequenceDiagram
    participant A as Admin
    participant W as Web Frontend
    participant B as Backend API
    participant D as Database

    A->>W: Điền form Thêm người thuê & Bấm Lưu
    W->>B: POST /api/super-admin/tenant
    B->>D: Kiểm tra Email tồn tại (users/tenants)
    
    alt Email đã tồn tại
        D-->>B: Lỗi Unique Constraint
        B-->>W: 400 Bad Request (Email đã sử dụng)
        W-->>A: Hiển thị cảnh báo lỗi
    else Hợp lệ
        B->>D: Insert record vào bảng tenants
        D-->>B: Trả về ID mới
        B-->>W: 201 Created (Kèm thông tin Tenant)
        W->>W: Refresh danh sách
        W-->>A: Hiển thị thông báo Thành công
    end
```

### UC-2.6: Tìm kiếm người thuê (Debounce Search)
```mermaid
sequenceDiagram
    participant A as Admin
    participant W as Web Frontend
    participant B as Backend API
    participant D as Database

    A->>W: Gõ từ khóa vào ô tìm kiếm
    Note over A, W: Web chờ 300-500ms (Debounce)
    W->>B: GET /api/tenant?search={keyword}
    B->>D: LIKE Query (Name, Email, Phone)
    D-->>B: Trả về mảng Tenants
    B-->>W: 200 OK (Dữ liệu trả về)
    
    alt Dữ liệu rỗng
        W-->>A: Hiển thị "Không tìm thấy kết quả"
    else Có dữ liệu
        W-->>A: Cập nhật bảng hiển thị
    end
```

---

## 3. NHÓM KHÁCH HÀNG & THANH TOÁN

### UC-6.1: Thanh toán và Khởi động thiết bị tự động (Luồng quan trọng nhất)
```mermaid
sequenceDiagram
    participant C as Khách hàng
    participant W as Web Public (Phone)
    participant B as Backend API
    participant S as SePay / App Ngân hàng
    participant D as Database

    C->>W: Quét QR & Mở URL thiết bị
    W->>B: GET /api/public/device/{id}
    B->>D: Tra cứu thông tin thiết bị & bảng giá
    D-->>B: Kết quả
    B-->>W: Trả về tùy chọn số phút & giá tiền
    W-->>C: Hiển thị bảng giá
    
    C->>W: Chọn gói giá
    W->>B: POST tạo phiên giao dịch chờ
    B->>D: Insert bảng transactions (Pending)
    B-->>W: Trả mã QR SePay (Có mã đơn)
    W-->>C: Hiển thị QR thanh toán
    
    Note over C, S: Khách mở App Ngân hàng quét QR & chuyển tiền
    C->>S: Thanh toán thành công
    S->>B: Webhook POST (Báo biến động số dư)
    B->>B: Đối chiếu Số tiền & Mã đơn
    
    alt Khớp thông tin
        B->>D: Cập nhật Transaction = Completed
        B-->>S: 200 OK
        W->>B: (Polling hoặc WebSocket) Kiểm tra trạng thái
        B-->>W: Trạng thái Completed
        W-->>C: Đổi màu xanh, hiện nút "Bắt đầu"
        
        C->>W: Bấm "Bắt đầu"
        W->>B: POST yêu cầu khởi động
        B->>D: Insert bảng device_commands (START)
        B-->>W: 200 OK
        W-->>C: Chuyển sang màn hình Đếm ngược
    else Sai thông tin
        B->>D: Cập nhật Transaction = Failed
        B-->>S: 200 OK (Nhận log nhưng hủy)
        W->>B: Kiểm tra
        B-->>W: Trạng thái Failed
        W-->>C: Hiển thị thông báo khiếu nại/Lỗi
    end
```

---

## 4. NHÓM TƯƠNG TÁC IOT DEVICE (ESP32)

### UC-7.1 & UC-7.2: Đăng ký thiết bị & Heartbeat
```mermaid
sequenceDiagram
    participant ESP as IoT Device (ESP32)
    participant API as Backend API
    participant DB as Database

    Note over ESP, DB: Quá trình khởi động (Boot)
    ESP->>ESP: Kết nối WiFi thành công
    ESP->>API: POST /api/iot/device/register (Kèm MAC/deviceId)
    API->>DB: Check tồn tại & Update kết nối
    DB-->>API: OK
    API-->>ESP: 200/201 Success
    
    Note over ESP, DB: Vòng lặp duy trì sự sống (Heartbeat - mỗi 15-30s)
    loop Chu kỳ Heartbeat
        ESP->>API: GET/POST /api/iot/device/heartbeat
        API->>DB: Cập nhật field last_heartbeat
        API-->>ESP: 200 OK
    end
```

### UC-7.3: Gọi lệnh thực thi (Vòng lặp Fetch Data Commands)
```mermaid
sequenceDiagram
    participant ESP as IoT Device (ESP32)
    participant API as Backend API
    participant DB as Database

    loop Mỗi chu kỳ kiểm tra lệnh
        ESP->>API: GET /api/iot/device/commands
        API->>DB: Tìm lệnh 'pending' cho DeviceID
        
        alt Có lệnh mới
            DB-->>API: Dữ liệu (Lệnh START, Thời gian phút)
            API-->>ESP: 200 OK (JSON Data)
            
            ESP->>ESP: Bật Pin IO Relay (Kích hoạt máy rửa)
            ESP->>API: PUT cập nhật lệnh -> 'executed'
            API->>DB: Update device_commands = executed
            API-->>ESP: 200 OK
            
            ESP->>ESP: Chạy Countdown Timer phần cứng
            
            Note over ESP: Sau khi đếm ngược xong
            ESP->>ESP: Kéo Pin IO Relay xuống (Tắt máy)
            
        else Không có lệnh
            DB-->>API: Rỗng
            API-->>ESP: 204 No Content (Bỏ qua)
        end
    end
```

### Quản lý lỗi phần cứng ADC/Chạm mạch ESP32
```mermaid
sequenceDiagram
    participant ESP as IoT Device (ESP32)
    participant API as Backend API
    participant DB as Database

    ESP->>ESP: Phát hiện lỗi chân mạch / Hụt dòng
    ESP->>API: POST /api/iot/device/log (Gửi Error Log)
    API->>DB: Insert bảng device_logs (Warning/Error)
    API-->>ESP: 200 OK
    ESP->>ESP: Hủy thực thi & Đổi trạng thái nội bộ sang Error
```