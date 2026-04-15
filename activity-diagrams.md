# Biểu đồ Hoạt động (Activity Diagrams) - Hệ thống ACW-SRS

Tài liệu này cung cấp biểu đồ hoạt động dạng flowchart có **chia luồng (Swimlanes)** để phân định rõ ràng các thao tác của **Người dùng (Actor)** và **Hệ thống (Web/Backend/Database)**.

---

## 1. NHÓM XÁC THỰC

### UC-1.1: Đăng nhập
```mermaid
flowchart TD
    subgraph Người dùng
        Start([Bắt đầu])
        A[Truy cập trang đăng nhập]
        B[Nhập Email và mật khẩu]
        C[Bấm nút đăng nhập]
    end

    subgraph Hệ thống
        D{Form hợp lệ?}
        E[Hiển thị cảnh báo form]
        F[Gửi API đăng nhập tới Backend]
        G{Kiểm tra thông tin DB}
        H[Trả về 401 Unauthorized]
        I[Hiển thị lỗi đăng nhập]
        J[Trả về Access Token]
        K[Lưu Token nội bộ]
        L[Điều hướng tới Trang quản lý]
        End([Kết thúc])
    end

    Start --> A --> B --> C --> D
    D -- Không hợp lệ --> E --> B
    D -- Hợp lệ --> F --> G
    G -- Sai/Khóa --> H --> I --> B
    G -- Đúng --> J --> K --> L --> End
```

---

## 2. NHÓM QUẢN LÝ NGƯỜI THUÊ (DÀNH CHO ADMIN)

### UC-2.1: Quản lý người thuê (Tổng quát)
```mermaid
flowchart TD
    subgraph Admin
        Start([Bắt đầu])
        A[Truy cập mục 'Người thuê']
    end
    subgraph Hệ thống
        B[Web gọi API danh sách tenants]
        C{Kết nối được DB?}
        D[Trả về lỗi 500]
        E[Tải dữ liệu bảng tenants]
        F[Hiển thị màn hình danh sách]
        EndE([Kết thúc lỗi])
        End([Kết thúc])
    end

    Start --> A --> B --> C
    C -- Không --> D --> EndE
    C -- Có --> E --> F --> End
```

### UC-2.3: Thêm người thuê
```mermaid
flowchart TD
    subgraph Admin
        Start([Bắt đầu])
        A[Bấm nút 'Thêm mới']
        C[Điền thông tin và bấm 'Lưu']
    end
    subgraph Hệ thống
        B[Hiển thị form nhập thông tin]
        D[Backend nhận yêu cầu]
        E{Email đã tồn tại chưa?}
        F[Báo lỗi Unique Constraint]
        G[Server trả lỗi 'Email đã sử dụng']
        H[Ghi dữ liệu vào bảng tenants]
        I[Trả về thông báo tạo thành công]
        J[Cập nhật lại giao diện danh sách]
        End([Kết thúc])
    end

    Start --> A --> B --> C --> D --> E
    E -- Có --> F --> G --> B
    E -- Chưa --> H --> I --> J --> End
```

### UC-2.6: Tìm kiếm người thuê
```mermaid
flowchart TD
    subgraph Admin
        Start([Bắt đầu])
        A[Nhập từ khóa tìm kiếm]
    end
    subgraph Hệ thống
        B[Phát hiện nhập liệu & Đợi Debounce]
        C[Gọi API truy vấn bằng từ khóa]
        D{Có kết quả trùng khớp?}
        E[Hiển thị 'Không tìm thấy kết quả nào']
        F[Trả lại mảng danh sách]
        G[Cập nhật UI bảng danh sách]
        End([Kết thúc])
    end

    Start --> A --> B --> C --> D
    D -- Không --> E --> End
    D -- Có --> F --> G --> End
```

---

## 3. NHÓM QUẢN LÝ DOANH THU & GIAO DỊCH

### UC-3.1 & UC-4.1: Xem Doanh thu / Giao dịch
```mermaid
flowchart TD
    subgraph Người dùng
        Start([Bắt đầu])
        A[Chọn phạm vi ngày tháng / tab giao dịch]
    end
    subgraph Hệ thống
        B[Gửi API request tổng hợp]
        C[Duyệt bảng transaction]
        D{Có dữ liệu?}
        E[Hiển thị 0đ & Danh sách rỗng]
        F[Tổng hợp và nhóm số liệu]
        G[Render Graphic Chart & Bảng Data]
        End([Kết thúc])
    end

    Start --> A --> B --> C --> D
    D -- Không --> E --> End
    D -- Có --> F --> G --> End
```

---

## 5. NHÓM QUẢN LÝ THIẾT BỊ

### UC-5.2: Thêm thiết bị tĩnh
```mermaid
flowchart TD
    subgraph Người dùng
        Start([Bắt đầu])
        A[Bấm 'Thêm thiết bị']
        B[Khai báo MAC, Tên, Giá tiền]
        C[Nhấn 'Lưu']
    end
    subgraph Hệ thống
        D[Middleware xử lý dữ liệu]
        E{MAC hợp lệ / Có bị trùng?}
        F[Chặn, báo lỗi DeviceID]
        G[Ghi vào DB is_active=true]
        H[Thông báo tạo thành công & Cập nhật UI]
        End([Kết thúc])
    end

    Start --> A --> B --> C --> D --> E
    E -- Lỗi --> F --> B
    E -- Hợp lệ --> G --> H --> End
```

---

## 6. NHÓM CHỨC NĂNG KHÁCH HÀNG

### UC-6.1: Thanh toán và Khởi động thiết bị tự động
```mermaid
flowchart TD
    subgraph Khách hàng
        Start([Bắt đầu])
        A[Quét mã QR tại máy]
        D[Chọn gói dịch vụ]
        F[Thanh toán qua App Ngân hàng]
        M[Nhấn nút 'Bắt đầu' trên điện thoại]
    end
    subgraph Hệ thống
        B[Tra cứu tham số URL ID thiết bị]
        C[Hiển thị báo giá / số lượng phút]
        E[Hiển thị QR SePay kèm ID đơn hàng]
        G[Webhook SePay nhận biến động số dư]
        H{Khớp số tiền / nội dung?}
        I[Đánh dấu Transaction Failed]
        J[Cảnh báo khách hàng trên Web]
        K[Update Transaction: Completed]
        L[Đổi UI Web sang xanh & Mở khóa nút]
        N{Thiết bị IoT đang Online?}
        O[Bị kẹt Pending, báo lỗi bồi thường]
        P[Sinh lệnh START xuống DB]
        Q[Giao diện sang Đếm ngược thời gian]
        End1([Kết thúc lỗi thanh toán])
        End2([Kết thúc thiết bị lỗi])
        End([Bắt đầu bơm])
    end

    Start --> A --> B --> C --> D --> E --> F
    F --> G --> H
    H -- Sai --> I --> J --> End1
    H -- Khớp --> K --> L --> M --> N
    N -- Không --> O --> End2
    N -- Có --> P --> Q --> End
```

---

## 7. NHÓM CHỨC NĂNG IOT DEVICE (ESP32)

### UC-7.3: Gọi lệnh thực thi
```mermaid
flowchart TD
    subgraph IoT_Device_ESP32
        Start([Vòng lặp Fetch Data])
        A[Gọi API kéo lệnh khởi động]
        C[Nhận JSON chứa lệnh START và Timer]
        D{Kiểm tra mạch ADC/Chân Relay}
        E[Lưu & Gửi POST Error Log]
        F[Hủy kéo lệnh, vào chế độ lỗi]
        G[Kéo Pin Relay lên CAO - Mở vòi]
        H[Chạy Countdown Timer nội bộ ESP32]
        I[Gửi HTTP Update Command: Executed]
        J{Thời gian Timer kết thúc?}
        K[Kéo Pin Relay về THẤP - Tắt Bơm]
    end
    subgraph Hệ thống Backend
        B{Có lệnh device_command pending?}
    end

    Start --> A --> B
    B -- Không --> Start
    B -- Có --> C --> D
    D -- Chạm mạch --> E --> F --> Start
    D -- Tốt --> G --> H --> I --> J
    J -- Chưa --> J
    J -- Đã đếm xong --> K --> Start
```