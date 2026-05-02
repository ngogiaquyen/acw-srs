# Biểu đồ Trình tự (Sequence Diagrams) - Hệ thống ACW-SRS

---

## 1. NHÓM XÁC THỰC

### UC-1.1: Đăng nhập
```mermaid
sequenceDiagram
    participant U as Người dùng
    participant W as Login Page (Web)
    participant B as Controller (Backend)
    participant D as Model (Database)

    U->>W: 1. Truy cập trang đăng nhập
    W-->>U: 2. Trả về form đăng nhập
    U->>W: 3. Nhập Email và mật khẩu
    U->>W: 4. Người dùng bấm nút đăng nhập
    
    alt Thông tin không hợp lệ (Trống hoặc sai định dạng)
        Note over W: Browser hoặc Web chặn lại
        W-->>U: 4.1 Hiển thị thông báo lỗi nhập liệu
    else Thông tin hợp lệ
        W->>B: 5. Web gửi thông tin tới backend (POST /api/auth/login)
        B->>D: 6. Backend kiểm tra thông tin với database
        
        alt Sai thông tin (False)
            D-->>B: 7. Trả về kết quả sai (hoặc User bị khóa)
            B-->>W: 8.1 Lỗi đăng nhập (401 Unauthorized)
            W-->>U: 8.1.1 Hiển thị thông báo lỗi lên màn hình
        else Đúng thông tin (True)
            D-->>B: 9. Trả về kết quả đúng (User Info)
            B->>B: 9.1 Tạo JWT Token
            B-->>W: 10. Đăng nhập thành công (Set-Cookie)
            W->>W: 11. Trình duyệt tự động lưu HttpOnly Cookie
            W-->>U: 12. Điều hướng về Dashboard theo Role
        end
    end
```

---

## 2. NHÓM QUẢN LÝ NGƯỜI THUÊ (SUPER ADMIN)

### UC-2.2: Xem thông tin người thuê
```mermaid
sequenceDiagram
    participant A as Admin
    participant W as Tenant Page (Web)
    participant B as Controller (Backend)
    participant D as Model (Database)

    A->>W: 1. Truy cập trang Quản lý người thuê
    W->>B: 2. Gửi yêu cầu lấy danh sách (GET /api/super-admin/tenants)
    B->>D: 3. Truy vấn dữ liệu bảng tenants

    alt Lỗi hệ thống (False)
        D-->>B: 4.1 Trả về lỗi Database
        B-->>W: 5.1 Thông báo lỗi (500)
        W-->>A: 6.1 Hiển thị thông báo lấy dữ liệu thất bại
    else Thành công (True)
        D-->>B: 4.2 Trả về danh sách Tenant
        B-->>W: 5.2 Trả về mảng JSON (200 OK)
        W-->>A: 6.2 Hiển thị danh sách lên bảng
    end

    opt Admin chọn xem chi tiết
        A->>W: 7. Chọn xem chi tiết một người thuê
        W->>B: 8. GET /api/super-admin/tenants/{id}
        B->>D: 9. Truy vấn theo ID
        D-->>B: 10. Trả về dữ liệu chi tiết
        B-->>W: 11. Trả về JSON chi tiết
        W-->>A: 12. Hiển thị Popup thông tin chi tiết
    end
```

---

### UC-2.3: Thêm người thuê mới
```mermaid
sequenceDiagram
    participant A as Admin
    participant W as Form Tenant (Web)
    participant B as Controller (Backend)
    participant D as Model (Database)

    A->>W: 1. Bấm nút Thêm mới
    W-->>A: 2. Hiển thị Form nhập liệu trống
    A->>W: 3. Điền thông tin (Tên, Email, SĐT...)
    A->>W: 4. Bấm nút Tạo tenant

    alt Thông tin không hợp lệ (Trống hoặc sai định dạng)
        Note over W: Browser hoặc Web chặn lại
        W-->>A: 4.1 Hiển thị lỗi các trường tương ứng
    else Thông tin hợp lệ
        W->>B: 5. Gửi dữ liệu tới backend (POST /api/super-admin/tenants)
        B->>D: 6. Lưu bản ghi mới vào CSDL (INSERT)
        D->>D: 6.1 Tự kiểm tra ràng buộc Unique (Email)

        alt Trùng lặp Email (False)
            D-->>B: 7.1 Báo lỗi Unique Constraint
            B-->>W: 8.1 Trả về lỗi 400 Bad Request
            W-->>A: 9.1 Thông báo dữ liệu đã được sử dụng
        else Thành công (True)
            D-->>B: 7.2 Xác nhận tạo thành công
            B-->>W: 8.2 Thông báo tạo thành công (201 Created)
            W->>W: 9. Điều hướng về trang danh sách
            W-->>A: 10. Hiển thị trang danh sách tenant
        end
    end
```

---

### UC-2.4: Sửa người thuê
```mermaid
sequenceDiagram
    participant A as Admin
    participant W as Tenant Page (Web)
    participant B as Controller (Backend)
    participant D as Model (Database)

    A->>W: 1. Chọn Tenant và bấm nút "Sửa"
    W->>B: 2. Lấy dữ liệu cũ (GET /api/super-admin/tenants/{id})
    B->>D: 3. Query DB
    D-->>B: 4. Trả về dữ liệu
    B-->>W: 5. 200 OK
    W-->>A: 6. Hiển thị Form với thông tin cũ

    A->>W: 7. Chỉnh sửa thông tin và bấm "Cập nhật tenant"

    alt Thông tin không hợp lệ (Trống hoặc sai định dạng)
        Note over W: Browser hoặc Web chặn lại
        W-->>A: 7.1 Hiển thị lỗi các trường tương ứng
    else Thông tin hợp lệ
        W->>B: 8. Gửi dữ liệu (PUT /api/super-admin/tenants/{id})

        alt Lỗi cập nhật (False)
            B-->>W: 9.1 Phản hồi lỗi (404/500)
            W-->>A: 10.1 Hiển thị thông báo thất bại
        else Thành công (True)
            B-->>W: 9.2 Phản hồi thành công (200 OK)
            W->>W: 10.2 Điều hướng về trang chi tiết
            W-->>A: 11.2 Hiển thị trang chi tiết đã cập nhật
        end
    end
```

---

### UC-2.5: Xóa người thuê
```mermaid
sequenceDiagram
    participant A as Admin
    participant W as Tenant Page (Web)
    participant B as Controller (Backend)
    participant D as Model (Database)

    A->>W: 1. Chọn Tenant và bấm nút "Xóa"
    W-->>A: 2. Hiển thị hộp thoại xác nhận
    
    alt Hủy xóa (False)
        A->>W: 3.1 Bấm "Hủy"
        W-->>A: 4.1 Đóng hộp thoại
    else Đồng ý xóa (True)
        A->>W: 3.2 Bấm "Xác nhận"
        W->>B: 4.2 Gửi yêu cầu DELETE
        B->>D: 5.2 Xóa dữ liệu (Cascade)
        D-->>B: 6.2 Thành công
        B-->>W: 7.2 Phản hồi 200 OK
        W->>W: 8.2 Xóa dòng trên bảng
        W-->>A: 9.2 Thông báo thành công
    end
```

---

### UC-2.6: Tìm kiếm người thuê
```mermaid
sequenceDiagram
    participant A as Admin
    participant W as Tenant Page (Web)
    participant B as Controller (Backend)
    participant D as Model (Database)

    A->>W: 1. Nhập từ khóa vào ô tìm kiếm
    Note over W: Chờ 300ms (Debounce)
    W->>B: 2. Gửi yêu cầu tìm kiếm (GET /api/tenant?q=...)
    B->>D: 3. Truy vấn LIKE trong DB
    
    alt Không có kết quả (False)
        D-->>B: 4.1 Trả về mảng rỗng
        B-->>W: 5.1 200 OK (Empty Array)
        W-->>A: 6.1 Hiển thị "Không tìm thấy"
    else Có kết quả (True)
        D-->>B: 4.2 Trả về danh sách
        B-->>W: 5.2 200 OK + Data
        W-->>A: 6.2 Cập nhật bảng
    end
```

---

## 3. NHÓM QUẢN LÝ DOANH THU

### UC-3.2: Xem doanh thu
```mermaid
sequenceDiagram
    participant U as Người dùng
    participant W as Revenue Page (Web)
    participant B as Controller (Backend)
    participant D as Model (Database)

    U->>W: 1. Chọn bộ lọc thời gian
    W->>B: 2. GET /api/revenue
    B->>D: 3. Query DB
    D-->>B: 4. Trả về số liệu
    B-->>W: 5. JSON dữ liệu biểu đồ
    W-->>U: 6. Vẽ biểu đồ và cập nhật thẻ tổng kết
```

---

### UC-3.3: Gửi báo cáo doanh thu
```mermaid
sequenceDiagram
    participant A as Admin
    participant W as Report Page (Web)
    participant B as Controller (Backend)
    participant M as Mail Service

    A->>W: 1. Bấm nút "Gửi báo cáo"
    W-->>A: 2. Hiển thị Popup
    A->>W: 3. Điền thông tin và bấm "Gửi"
    W->>B: 4. POST /api/revenue/report
    
    alt Gửi thất bại (False)
        B-->>W: 5.1 Lỗi Mail Service (500)
        W-->>A: 6.1 Thông báo lỗi gửi email
    else Thành công (True)
        B-->>W: 5.2 Phản hồi thành công (200 OK)
        W-->>A: 6.2 Thông báo báo cáo đã gửi
    end
```

---

## 5. NHÓM QUẢN LÝ THIẾT BỊ

### UC-5.2: Xem trạng thái thiết bị
```mermaid
sequenceDiagram
    participant U as Người dùng
    participant W as Device Page (Web)
    participant B as Controller (Backend)
    participant D as Model (Database)

    U->>W: 1. Truy cập tab Thiết bị
    W->>B: 2. GET /api/device
    B->>D: 3. Truy vấn DB
    D-->>B: 4. Trả về danh sách
    B->>B: 5. Tính Online/Offline
    B-->>W: 6. Trả về JSON kèm status
    W-->>U: 7. Hiển thị danh sách thiết bị
```

---

## 6. NHÓM CHỨC NĂNG KHÁCH HÀNG (USER)

### UC-6.1: Thanh toán và Khởi động máy
```mermaid
sequenceDiagram
    participant C as Khách hàng
    participant W as Payment Page (Web)
    participant B as Controller (Backend)
    participant SP as SePay (Bank Gateway)
    participant D as Model (Database)
    participant IOT as ESP32 (IoT Device)

    C->>W: 1. Quét mã QR tại trạm
    W->>B: 2. GET /api/public/device/{id}
    B-->>W: 3. Hiển thị các gói dịch vụ
    
    C->>W: 4. Chọn gói và bấm "Thanh toán"
    W->>B: 5. Tạo giao dịch PENDING
    B-->>W: 6. Hiển thị QR Code ngân hàng
    
    C->>SP: 7. Khách hàng chuyển khoản
    SP->>B: 8. Webhook báo biến động số dư
    
    alt Thanh toán sai (False)
        B->>D: 9.1 Cập nhật Transaction = FAILED
        W-->>C: 10.1 Thông báo lỗi thanh toán
    else Thanh toán đúng (True)
        B->>D: 9.2 Cập nhật Transaction = COMPLETED
        B->>D: 10.2 Tạo lệnh START trong DB
        W-->>C: 11.2 Thông báo thành công
        
        IOT->>B: 12. ESP32 fetch lệnh mới
        B->>D: 13. Tìm lệnh PENDING
        D-->>B: 14. Trả về lệnh START + Timer
        B-->>IOT: 15. Gửi JSON lệnh cho ESP32
        
        IOT->>IOT: 16. Bật Relay (Máy bơm chạy)
        IOT->>B: 17. Cập nhật Command = EXECUTED
        
        IOT->>IOT: 18. Chạy Countdown Timer
        Note over IOT: Hết thời gian
        IOT->>IOT: 19. Tắt Relay (Máy bơm dừng)
        IOT->>B: 20. Báo cáo trạng thái = STOPPED
    end
```

---

## 7. NHÓM IOT DEVICE (ESP32)

### UC-7.1: Đăng ký thiết bị (Register)
```mermaid
sequenceDiagram
    participant IOT as ESP32
    participant B as Controller (Backend)
    participant D as Model (Database)

    IOT->>B: 1. POST /api/iot/register
    B->>D: 2. Kiểm tra MAC Address
    
    alt Không hợp lệ (False)
        B-->>IOT: 3.1 403 Forbidden
        IOT->>IOT: 4.1 Đứng chờ / Thử lại sau
    else Hợp lệ (True)
        B->>D: 3.2 Cập nhật Online
        B-->>IOT: 4.2 200 OK + Cấu hình PIN
    end
```

### UC-7.2: Heartbeat định kỳ
```mermaid
sequenceDiagram
    participant IOT as ESP32
    participant B as Controller (Backend)

    loop Mỗi 30s
        IOT->>B: 1. Gửi Heartbeat
        alt Mất kết nối (False)
            B-->>IOT: 2.1 Timeout
            IOT->>IOT: 3.1 Ghi log lỗi nội bộ
        else OK (True)
            B-->>IOT: 2.2 200 OK
        end
    end
```

### UC-7.3: Nhận lệnh điều khiển
```mermaid
sequenceDiagram
    participant IOT as ESP32
    participant B as Controller (Backend)
    participant D as Model (Database)

    loop Fetching
        IOT->>B: 1. GET /api/iot/commands
        
        alt Không có lệnh (False)
            B-->>IOT: 2.1 240 No Content
        else Có lệnh START (True)
            B-->>IOT: 2.2 200 OK + Command Data
            
            alt Lỗi phần cứng (False)
                IOT->>B: 3.1 Báo lỗi log
            else Hoạt động (True)
                IOT->>IOT: 3.2 Chạy chu kỳ rửa xe
                IOT->>B: 4.2 Cập nhật trạng thái hoàn tất
            end
        end
    end
```