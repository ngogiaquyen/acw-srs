# Biểu đồ Hoạt động - ACW-SRS

---

## UC-1.1: Đăng nhập

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1[Nhập Email và mật khẩu]
    a2[Yêu cầu đăng nhập]
    a3[Nhập lại thông tin]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1{Đúng định dạng?}
    b2[Thông báo lỗi nhập liệu]
    b3{Tài khoản hợp lệ?}
    b4[Thông báo sai tài khoản]
    b5[Thực hiện đăng nhập]
    b6[Đăng nhập thành công]
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
    a1[Vào màn hình Quản lý người thuê]
    a2[Chọn xem chi tiết]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Truy vấn danh sách Tenant]
    b2{DB phản hồi?}
    b3[Báo lỗi lấy dữ liệu]
    b4[Hiển thị danh sách]
    b5[Hiển thị popup chi tiết]
  end
  S(( )) --> a1 --> b1 --> b2
  b2 -->|Lỗi| b3 --> E(( ))
  b2 -->|OK| b4 --> a2 --> b5 --> E
```

---

## UC-2.3: Thêm người thuê

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1[Bấm Thêm mới]
    a2[Điền thông tin và bấm Lưu]
    a3[Nhập lại thông tin]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Hiển thị form nhập liệu]
    b2{Thông tin đầy đủ?}
    b3[Báo lỗi trường thiếu]
    b4{Email đã tồn tại?}
    b5[Báo lỗi trùng email]
    b6[Ghi Tenant vào DB]
    b7[Báo thành công - Làm mới danh sách]
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
    a1[Chọn người thuê - Bấm Sửa]
    a2[Chỉnh sửa và bấm Cập nhật]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Hiển thị form thông tin cũ]
    b2[Gửi dữ liệu lên Backend]
    b3{Tìm thấy bản ghi?}
    b4[Báo lỗi 404 - Tải lại trang]
    b5[Cập nhật DB - Báo thành công]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2 --> b3
  b3 -->|Không| b4 --> E(( ))
  b3 -->|Có| b5 --> E
```

---

## UC-2.5: Xóa người thuê

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1[Chọn người thuê - Bấm Xóa]
    a2[Xác nhận hoặc Hủy]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Hiển thị hộp thoại cảnh báo]
    b2{Admin xác nhận?}
    b3[Đóng hộp thoại - Không làm gì]
    b4[Xóa Tenant và thiết bị liên quan]
    b5[Báo thành công - Làm mới danh sách]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2
  b2 -->|Hủy| b3 --> E(( ))
  b2 -->|Đồng ý| b4 --> b5 --> E
```

---

## UC-2.6: Tìm kiếm người thuê

```mermaid
flowchart LR
  subgraph ND["Admin"]
    direction TB
    a1[Nhập từ khóa tìm kiếm]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Gọi API filter Tenant - có Debounce]
    b2[Truy vấn DB theo Tên / Email / SĐT]
    b3{Có kết quả?}
    b4[Hiển thị danh sách kết quả]
    b5[Báo Không tìm thấy kết quả]
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
    a1[Chọn bộ lọc thời gian]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Gọi API thống kê]
    b2[Tổng hợp từ bảng transactions]
    b3{Có dữ liệu?}
    b4[Hiển thị biểu đồ rỗng]
    b5[Vẽ biểu đồ và thẻ số liệu]
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
    a1[Bấm Gửi báo cáo]
    a2[Điền kỳ báo cáo và email - Bấm Gửi]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Hiển thị popup cấu hình]
    b2[Tạo file PDF/Excel]
    b3[Gọi Mail Service]
    b4{Gửi email thành công?}
    b5[Báo lỗi cấu hình mail]
    b6[Báo Gửi thành công]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2 --> b3 --> b4
  b4 -->|Không| b5 --> E(( ))
  b4 -->|Có| b6 --> E
```

---

## UC-4.2: Xem giao dịch

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1[Truy cập tab Giao dịch]
    a2[Bấm xem chi tiết]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Xác nhận quyền hạn]
    b2[Truy vấn danh sách giao dịch]
    b3{Dữ liệu hợp lệ?}
    b4[Báo lỗi]
    b5[Hiển thị bảng giao dịch]
    b6[Hiển thị chi tiết giao dịch]
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
    a1[Bấm Xuất file]
    a2[Chọn phạm vi xuất]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Tạo file CSV]
    b2{Dữ liệu quá lớn?}
    b3[Đề xuất chia nhỏ bộ lọc]
    b4[Trả về luồng file stream]
    b5[Tải file về máy - Báo thành công]
  end
  S(( )) --> a1 --> a2 --> b1 --> b2
  b2 -->|Timeout| b3 --> E(( ))
  b2 -->|OK| b4 --> b5 --> E
```

---

## UC-5.2: Xem thiết bị

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1[Truy cập tab Thiết bị]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Truy vấn danh sách thiết bị]
    b2[Kiểm tra last_heartbeat từng thiết bị]
    b3{Heartbeat còn mới?}
    b4[Gắn nhãn Online - xanh]
    b5[Gắn nhãn Offline - đỏ]
    b6[Hiển thị danh sách kèm trạng thái]
  end
  S(( )) --> a1 --> b1 --> b2 --> b3
  b3 -->|Có| b4 --> b6
  b3 -->|Không| b5 --> b6 --> E(( ))
```

---

## UC-5.3: Thêm thiết bị

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1[Bấm Thêm thiết bị mới]
    a2[Điền MAC, Tên, Trạm - Bấm Lưu]
    a3[Nhập lại thông tin]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Hiển thị form nhập liệu]
    b2{MAC Address hợp lệ?}
    b3[Báo lỗi MAC ID không hợp lệ]
    b4[Ghi thiết bị vào DB]
    b5[Báo thành công - Thiết bị sẵn sàng]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2
  b2 -->|Không| b3 --> a3 --> a2
  b2 -->|Có| b4 --> b5 --> E(( ))
```

---

## UC-5.4: Sửa cấu hình thiết bị

```mermaid
flowchart LR
  subgraph ND["Người dùng"]
    direction TB
    a1[Bấm Sửa ở thiết bị cần chỉnh]
    a2[Thay đổi Tên - Đơn giá/phút]
    a3[Sửa lại giá trị]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Hiển thị form thông tin hiện tại]
    b2{Giá trị hợp lệ?}
    b3[Báo lỗi Đơn giá phải lớn hơn 0]
    b4[Cập nhật DB và Cache]
    b5[Báo cập nhật thành công]
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
    a1[Bấm Xóa thiết bị]
    a2[Xác nhận hoặc Hủy]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Hiển thị popup cảnh báo]
    b2{Xác nhận?}
    b3[Đóng popup]
    b4{Thiết bị đang BUSY?}
    b5[Chặn - Báo chờ chu kỳ rửa xong]
    b6[Xóa device khỏi DB]
    b7[Báo thành công - Làm mới danh sách]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2
  b2 -->|Hủy| b3 --> E(( ))
  b2 -->|Đồng ý| b4
  b4 -->|Có| b5 --> E
  b4 -->|Không| b6 --> b7 --> E
```

---

## UC-6.1: Thanh toán

```mermaid
flowchart LR
  subgraph KH["Khách hàng"]
    direction TB
    a1[Quét mã QR tại trạm]
    a2[Chọn gói dịch vụ]
    a3[Quét QR ngân hàng - Chuyển khoản]
    a4[Bấm nút Bắt đầu]
  end
  subgraph HT["Hệ thống"]
    direction TB
    b1[Mở trang web - Hiển thị gói dịch vụ]
    b2[Sinh QR ngân hàng kèm mã tham chiếu]
    b3[Webhook SePay nhận biến động số dư]
    b4{Giao dịch hợp lệ?}
    b5[Đánh dấu Failed - Báo lỗi thanh toán]
    b6[Cập nhật Transaction Completed]
    b7[Sinh lệnh START - Gửi xuống ESP32]
    b8{ESP32 phản hồi?}
    b9[Báo lỗi thiết bị - Ghi nhận hoàn tiền]
    b10[ESP32 đóng Relay - Hiển thị đếm ngược]
  end
  S(( )) --> a1 --> b1 --> a2 --> b2 --> a3 --> b3 --> b4
  b4 -->|Không| b5 --> E(( ))
  b4 -->|Có| b6 --> a4 --> b7 --> b8
  b8 -->|Timeout| b9 --> E
  b8 -->|OK| b10 --> E
```

---

## UC-7.1: Đăng ký hệ thống (ESP32)

```mermaid
flowchart LR
  subgraph IOT["IoT Device"]
    direction TB
    a1[Boot - Khởi động ESP32]
    a2[Kết nối WiFi]
    a3[Gửi POST register kèm MAC]
    a4[Chờ 5 phút - Thử lại]
    a5[Lưu Token và cấu hình pin]
    a6[Vào vòng lặp chờ lệnh]
  end
  subgraph HT["Hệ thống - Backend"]
    direction TB
    b1{WiFi thành công?}
    b2{MAC hợp lệ?}
    b3[Trả 403 Forbidden]
    b4[Ghi nhận Online]
    b5[Trả Token và cấu hình]
  end
  S(( )) --> a1 --> a2 --> b1
  b1 -->|Không| a2
  b1 -->|Có| a3 --> b2
  b2 -->|Không| b3 --> a4 --> a3
  b2 -->|Có| b4 --> b5 --> a5 --> a6 --> E(( ))
```

---

## UC-7.2: Gửi trạng thái (Heartbeat)

```mermaid
flowchart LR
  subgraph IOT["IoT Device"]
    direction TB
    a1[Chờ đủ N giây - 15s đến 30s]
    a2[Gửi HTTP Request Heartbeat]
    a3[Thiết lập cờ Warning nội bộ]
  end
  subgraph HT["Hệ thống - Backend"]
    direction TB
    b1{Server phản hồi?}
    b2[Cập nhật last_heartbeat]
    b3[Trả về 200 OK]
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
    a1[Vòng lặp fetch lệnh từ API]
    a2[Trích xuất lệnh START và Timer]
    a3[Kéo Relay lên CAO - Kích hoạt máy]
    a4[Chạy Countdown Timer]
    a5[Kéo Relay về THẤP - Tắt bơm]
    a6[POST lỗi phần cứng lên Server]
  end
  subgraph HT["Hệ thống - Backend"]
    direction TB
    b1{Có lệnh pending?}
    b2[Trả về lệnh START kèm Timer]
    b3{Relay hoạt động?}
    b4[Lưu cảnh báo lỗi phần cứng]
    b5[Cập nhật Command thành executed]
    b6[Cập nhật status STOPPED]
  end
  S(( )) --> a1 --> b1
  b1 -->|Không| a1
  b1 -->|Có| b2 --> a2 --> b3
  b3 -->|Lỗi| a6 --> b4 --> E(( ))
  b3 -->|OK| a3 --> a4 --> b5 --> a5 --> b6 --> E
```
