# Biểu đồ Hoạt động - ACW-SRS

---

## UC-1.1: Đăng nhập

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1["Nhập Email và mật khẩu"]
    a2["Yêu cầu đăng nhập"]
    a3["Nhập lại thông tin"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1{"Đầy đủ thông tin?"}
    b2["Thông báo lỗi nhập liệu"]
    b3{"Email & Mật khẩu đúng?"}
    b4["Thông báo sai tài khoản"]
    b5["Thực hiện đăng nhập & Thiết lập Cookie"]
    b6["Đăng nhập thành công"]
  end
  S(( )) --> a1 --> a2 --> b1
  b1 -->|Không| b2 --> a3 --> a2
  b1 -->|Có| b3
  b3 -->|Không| b4 --> a3
  b3 -->|Có| b5 --> b6 --> E(( ))
```

---

## UC-2.2: Xem thông tin người thuê

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1["Vào màn hình Quản lý người thuê"]
    a2["Chọn xem chi tiết"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Truy vấn danh sách Tenant"]
    b2{"Có dữ liệu?"}
    b3["Hiển thị danh sách Tenant"]
    b4["Thông báo danh sách rỗng"]
    b5["Hiển thị popup chi tiết"]
  end
  S(( )) --> a1 --> b1 --> b2
  b2 -->|"Không"| b4 --> E(( ))
  b2 -->|"Có"| b3 --> a2 --> b5 --> E
```

---

## UC-2.3: Thêm người thuê

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1["Bấm Thêm mới"]
    a2["Điền thông tin và bấm Lưu"]
    a3["Nhập lại thông tin"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Hiển thị form nhập liệu"]
    b2{"Thông tin đầy đủ?"}
    b3["Báo lỗi trường thiếu"]
    b4{"Email đã tồn tại?"}
    b5["Báo lỗi trùng email"]
    b6["Ghi Tenant vào DB"]
    b7["Báo thành công - Làm mới danh sách"]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2
  b2 -->|Không| b3 --> a3 --> a2
  b2 -->|Có| b4
  b4 -->|Có| b5 --> a3
  b4 -->|Không| b6 --> b7 --> E(( ))
```

---

## UC-2.4: Sửa người thuê

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1["Chọn người thuê - Bấm Sửa"]
    a2["Chỉnh sửa và bấm Cập nhật"]
    a3["Sửa lại thông tin"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Truy vấn thông tin cũ và hiển thị form"]
    b2["Gửi dữ liệu lên Backend"]
    b3{"Dữ liệu hợp lệ?"}
    b4["Báo lỗi nhập liệu"]
    b5{"Tìm thấy bản ghi?"}
    b6["Báo lỗi 404 - Tải lại trang"]
    b7["Cập nhật DB - Báo thành công"]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2 --> b3
  b3 -->|Không| b4 --> a3 --> a2
  b3 -->|Có| b5
  b5 -->|Không| b6 --> E(( ))
  b5 -->|Có| b7 --> E
```

---

## UC-2.5: Xóa người thuê

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1["Chọn người thuê - Bấm Xóa"]
    a2{"Xác nhận hoặc Hủy?"}
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Hiển thị hộp thoại cảnh báo"]
    b2["Đóng hộp thoại - Không làm gì"]
    b3["Vô hiệu hóa Tenant (Deactivate)"]
    b4["Báo thành công - Làm mới danh sách"]
  end
  S(( )) --> a1 --> b1 --> a2
  a2 -->|Hủy| b2 --> E(( ))
  a2 -->|Đồng ý| b3 --> b4 --> E
```

---

## UC-2.6: Tìm kiếm người thuê

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1["Nhập từ khóa tìm kiếm"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Bắt đầu lọc dữ liệu tại Client - có Debounce"]
    b2["Lọc theo Tên / Email / SĐT"]
    b3{"Có kết quả?"}
    b4["Hiển thị danh sách kết quả"]
    b5["Báo Không tìm thấy kết quả"]
  end
  S(( )) --> a1 --> b1 --> b2 --> b3
  b3 -->|Có| b4 --> E(( ))
  b3 -->|Không| b5 --> E
```

---

## UC-3.2: Xem doanh thu

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1["Chọn bộ lọc thời gian"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Gọi API thống kê"]
    b2["Tổng hợp từ bảng transactions"]
    b3{"Có dữ liệu?"}
    b4["Hiển thị biểu đồ rỗng"]
    b5["Vẽ biểu đồ và thẻ số liệu"]
  end
  S(( )) --> a1 --> b1 --> b2 --> b3
  b3 -->|Không| b4 --> E(( ))
  b3 -->|Có| b5 --> E
```

---

## UC-3.3: Gửi báo cáo doanh thu

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1["Bấm Gửi báo cáo"]
    a2["Nhập kỳ báo cáo và Email nhận"]
    a3{"Email hợp lệ?"}
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Hiển thị popup cấu hình"]
    b2["Tạo file PDF/Excel từ doanh thu"]
    b3["Gọi Mail Service"]
    b4{"Gửi email thành công?"}
    b5["Báo lỗi cấu hình mail"]
    b6["Báo Gửi thành công"]
  end
  S(( )) --> a1 --> b1 --> a2 --> a3
  a3 -->|"Không"| a2
  a3 -->|"Có"| b2 --> b3 --> b4
  b4 -->|"Không"| b5 --> E(( ))
  b4 -->|"Có"| b6 --> E
```

---

## UC-4.2: Xem giao dịch

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1["Truy cập tab Giao dịch"]
    a2["Bấm xem chi tiết"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Xác nhận quyền hạn"]
    b2["Truy vấn danh sách giao dịch"]
    b3{"Dữ liệu hợp lệ?"}
    b4["Báo lỗi"]
    b5["Hiển thị bảng giao dịch"]
    b6["Hiển thị chi tiết giao dịch"]
  end
  S(( )) --> a1 --> b1 --> b2 --> b3
  b3 -->|Lỗi| b4 --> E(( ))
  b3 -->|OK| b5 --> a2 --> b6 --> E
```

---

## UC-4.3: Xuất file thống kê

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1["Bấm Xuất file"]
    a2["Chọn phạm vi xuất (Ngày/Tháng/Trạm)"]
    a3["Sửa bộ lọc hoặc chia nhỏ thời gian"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Truy vấn số lượng bản ghi"]
    b2{"Vượt quá giới hạn (vd: 5000 dòng)?"}
    b3["Thông báo yêu cầu chia nhỏ phạm vi"]
    b4["Trích xuất dữ liệu & Tạo file CSV"]
    b5["Thiết lập Header (Download stream)"]
    b6["Trình duyệt tự động tải về"]
  end
  S(( )) --> a1 --> a2 --> b1 --> b2
  b2 -->|"Có"| b3 --> a3
  b2 -->|"Không"| b4 --> b5 --> b6 --> E(( ))
```


---

## UC-5.2: Xem thiết bị

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1["Truy cập tab Thiết bị"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Truy vấn danh sách thiết bị"]
    b2["Kiểm tra last_heartbeat từng thiết bị"]
    b3{"Heartbeat còn mới?"}
    b4["Gắn nhãn Online - xanh"]
    b5["Gắn nhãn Offline - đỏ"]
    b6["Hiển thị danh sách kèm trạng thái"]
  end
  S(( )) --> a1 --> b1 --> b2 --> b3
  b3 -->|Có| b4 --> b6
  b3 -->|Không| b5 --> b6 --> E(( ))
```

---

## UC-5.3: Thêm thiết bị

```mermaid
flowchart LR
  subgraph ND["Super Admin"]
    direction TB
    a1["Bấm Thêm thiết bị mới"]
    a2["Nhập MAC, Tên, Gán Tenant"]
    a3["Sửa lại thông tin"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Hiển thị form đăng ký thiết bị"]
    b2{"Thông tin hợp lệ?"}
    b3["Báo lỗi MAC hoặc trùng lặp"]
    b4["Ghi thiết bị vào DB"]
    b5["Báo thành công - Cấp Device ID"]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2
  b2 -->|"Không"| b3 --> a3 --> a2
  b2 -->|"Có"| b4 --> b5 --> E(( ))
```

---

## UC-5.4: Sửa cấu hình thiết bị

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1["Bấm Sửa ở thiết bị cần chỉnh"]
    a2["Thay đổi Tên - Đơn giá/phút"]
    a3["Sửa lại giá trị"]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Hiển thị form thông tin hiện tại"]
    b2{"Giá trị hợp lệ?"}
    b3["Báo lỗi Đơn giá phải lớn hơn 0"]
    b4["Cập nhật DB và Cache"]
    b5["Báo cập nhật thành công"]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2
  b2 -->|Không| b3 --> a3 --> a2
  b2 -->|Có| b4 --> b5 --> E(( ))
```

---

## UC-5.5: Xóa thiết bị

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1["Bấm Xóa thiết bị"]
    a2{"Xác nhận hoặc Hủy?"}
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1["Hiển thị popup cảnh báo"]
    b2["Đóng popup"]
    b3["Xóa device khỏi DB"]
    b4["Báo thành công - Làm mới danh sách"]
  end
  S(( )) --> a1 --> b1 --> a2
  a2 -->|Hủy| b2 --> E(( ))
  a2 -->|Đồng ý| b3 --> b4 --> E
```

---

### UC-6.1: Thanh toán và Khởi động máy
```mermaid
flowchart LR
  subgraph KH["Khách hàng"]
    direction TB
    a1["Quét QR cố định tại thiết bị"]
    a2["Chuyển khoản (kèm mã tham chiếu)"]
  end
  subgraph HT["Hệ thống (Backend)"]
    direction TB
    b1["Nhận Webhook từ SePay"]
    b2{"Giao dịch hợp lệ?"}
    b3["Ghi nhận lỗi (FAILED)"]
    b4["Lưu giao dịch COMPLETED"]
    b5["Tạo lệnh START cho thiết bị"]
  end
  subgraph IOT["Thiết bị ESP32"]
    direction TB
    c1["Fetch lệnh mới"]
    c2["Bật Relay (Máy bơm chạy)"]
    c3["Chạy Countdown Timer"]
    c4["Tắt Relay & Báo cáo STOPPED"]
  end
  S(( )) --> a1 --> a2 --> b1 --> b2
  b2 -->|Không| b3 --> E(( ))
  b2 -->|Có| b4 --> b5 --> c1 --> c2 --> c3 --> c4 --> E
```

---

## UC-7.1: Đăng ký hệ thống (ESP32)

```mermaid
flowchart LR
  subgraph IOT["IoT Device"]
    direction TB
    a1["Boot - Khởi động ESP32"]
    a2["Kết nối WiFi"]
    a3["Gửi POST register kèm Device ID"]
    a4["Lưu cấu hình và thông tin từ Server"]
    a5["Vào vòng lặp chờ lệnh"]
  end
  subgraph HT["Hệ thống - Backend"]
    direction TB
    b1{"WiFi thành công?"}
    b2{"Thiết bị hợp lệ?"}
    b3["Trả lỗi 403/400"]
    b4["Ghi nhận trạng thái Online"]
    b5["Trả thông tin Device và cấu hình"]
  end
  S(( )) --> a1 --> a2 --> b1
  b1 -->|Không| a2
  b1 -->|Có| a3 --> b2
  b2 -->|Không| b3 --> E(( ))
  b2 -->|Có| b4 --> b5 --> a4 --> a5 --> E
```

---

## UC-7.2: Gửi trạng thái (Heartbeat)

```mermaid
flowchart LR
  subgraph IOT["IoT Device"]
    direction TB
    a1["Chờ đủ N giây - 15s đến 30s"]
    a2["Gửi HTTP Request Heartbeat"]
    a3["Thiết lập cờ Warning nội bộ"]
  end
  subgraph HT["Hệ thống - Backend"]
    direction TB
    b1{"Server phản hồi?"}
    b2["Cập nhật last_heartbeat"]
    b3["Trả về 200 OK"]
  end
  S(( )) --> a1 --> a2 --> b1
  b1 -->|Timeout| a3 --> a1
  b1 -->|OK| b2 --> b3 --> a1
```

---

## UC-7.3: Nhận lệnh điều khiển (ESP32)

```mermaid
flowchart LR
  subgraph IOT["IoT Device"]
    direction TB
    a1["Vòng lặp fetch lệnh từ API"]
    a2["Trích xuất lệnh START và Timer"]
    a3["Bật Relay - Kích hoạt máy"]
    a4["Chạy Countdown Timer"]
    a5["Tắt Relay - Kết thúc chu kỳ"]
    a6["Gửi phản hồi trạng thái thực thi"]
  end
  subgraph HT["Hệ thống - Backend"]
    direction TB
    b1{"Có lệnh pending?"}
    b2["Trả về lệnh START / ADD_TIME"]
    b3["Cập nhật Command thành executed / failed"]
  end
  S(( )) --> a1 --> b1
  b1 -->|Không| a1
  b1 -->|Có| b2 --> a2 --> a3 --> a4 --> a5 --> a6 --> b3 --> E(( ))
```
