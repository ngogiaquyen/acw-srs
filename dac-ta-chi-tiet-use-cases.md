# Tài liệu Đặc tả Use Case Chi tiết - Hệ thống ACW-SRS

Tài liệu này cung cấp bản đặc tả chi tiết, được cập nhật chính xác theo luồng logic và cấu trúc mã nguồn thực tế của dự án. Hệ thống được thiết kế theo mô hình cấp phép ứng dụng (SaaS), trong đó thực thể **Thiết bị (Device)** được gán và quản lý trực tiếp bởi **Người thuê (Tenant)**.

---

## 1. NHÓM XÁC THỰC

### UC-1.1: Đăng nhập
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Đăng nhập |
| **Mục đích** | Xác thực danh tính người dùng để cho phép truy cập vào các chức năng quản trị. |
| **Mô tả** | Người dùng đăng nhập vào ứng dụng bằng cách nhập thông tin định danh (Email) và mật khẩu hợp lệ. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã có tài khoản trên hệ thống và đang ở trang đăng nhập. |
| **Điều kiện sau** | Hệ thống chuyển người dùng đến màn hình Dashboard quản trị tương ứng theo phân quyền. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Tác nhân truy cập trang đăng nhập.<br>2. Web hiển thị form đăng nhập.<br>3. Người dùng nhập Email và mật khẩu.<br>4. Tác nhân bấm nút đăng nhập.<br>5. Web gửi thông tin gọi API đăng nhập xuống Backend.<br>6. Backend nhận yêu cầu và đối chiếu với database (`users` table).<br>7. Backend trả về kết quả thành công kèm Access Token.<br>8. Web lưu Access Token vào bộ nhớ local và điều hướng tới trang quản lý. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Sai định dạng**<br> - 3.a.1: Hệ thống hiển thị cảnh báo ngay trên form.<br> - 3.a.2: Người dùng nhập lại thông tin.<br><br>**6.a: Sai thông tin đăng nhập hoặc tài khoản bị khóa**<br> - 6.a.1: Backend trả về lỗi 401 Unauthorized.<br> - 6.a.2: Web hiển thị thẻ báo lỗi "Tài khoản hoặc mật khẩu không chính xác". |

---

## 2. NHÓM QUẢN LÝ NGƯỜI THUÊ (DÀNH CHO ADMIN)

### UC-2.1: Quản lý người thuê (Tổng quát)
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Quản lý người thuê |
| **Mục đích** | Phục vụ Admin trong việc vận hành các đối tác đang thuê nền tảng quản lý rửa xe. |
| **Mô tả** | Cung cấp giao diện danh sách, tìm kiếm, cũng như cấu hình cổng thanh toán SePay và cài đặt giới hạn cho Tenant. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống dưới quyền Super Admin. |
| **Điều kiện sau** | Admin truy cập được vào các chức năng con của Quản lý người thuê. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin truy cập mục "Người thuê".<br>2. Hệ thống tải Database bảng `tenants` và hiển thị màn hình danh sách. |
| **Luồng sự kiện phụ (Alternative Flow)** | Lỗi 500 nếu backend không thể kết nối tới cơ sở dữ liệu. |

### UC-2.2: Xem thông tin người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xem thông tin người thuê |
| **Mục đích** | Cho phép xem chi tiết thông tin từng đối tác, gói dịch vụ dự kiến. |
| **Mô tả** | Xem danh sách tổng quan và thông tin cá nhân/hợp đồng của các Người thuê. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê. |
| **Điều kiện sau** | Admin xem được dữ liệu Tenant và chi tiết cấu hình (như hạn mức thiết bị, cấu hình thanh toán SePay). |
| **Luồng sự kiện chính (Basic Flow)** | 1. Web gọi API lấy danh sách Tenant.<br>2. Backend Load dữ liệu trả về mảng danh sách.<br>3. Web hiển thị bảng các thông tin cơ bản: Tên, Email, Số điện thoại.<br>4. Admin chọn "Xem chi tiết".<br>5. Hệ thống hiển thị thông tin chuyên sâu: Số thiết bị tối đa, Tài khoản ngân hàng, Hạn đăng ký. |
| **Luồng sự kiện phụ (Alternative Flow)** | Không tìm thấy bất kỳ Tenant nào, trả về bảng rỗng và hiện "Chưa có người thuê". |

### UC-2.3: Thêm người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Thêm người thuê |
| **Mục đích** | Ghi danh một đối tác mới vào nền tảng. |
| **Mô tả** | Tạo một Tenant record mới với các cấu hình về gói dịch vụ. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê. |
| **Điều kiện sau** | Lập bản ghi mới trong bảng `tenants` và liên kết với tài khoản `users` tương ứng. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin bấm nút "Thêm mới".<br>2. Hệ thống hiển thị form nhập thông tin (Tên, Email, SĐT, Số thiết bị tối đa, Chu kỳ đăng ký hợp đồng).<br>3. Admin điền thông tin và bấm "Lưu".<br>4. Backend ghi dữ liệu vào bảng `tenants`.<br>5. Backend trả về thông báo tạo thành công.<br>6. Cập nhật lại giao diện danh sách. |
| **Luồng sự kiện phụ (Alternative Flow)** | **4.a: Email đã tồn tại**<br> - 4.a.1: Database báo lỗi Unique Constraint.<br> - 4.a.2: Server báo lỗi "Email này đã được sử dụng". |

### UC-2.4: Sửa cấu hình người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Sửa người thuê |
| **Mục đích** | Quản lý thay đổi trạng thái, gian hạn hoặc cài đặt webhook hỗ trợ thanh toán tự động. |
| **Mô tả** | Cho phép chỉnh sửa thông tin thông thường cũng như tích hợp API cấu hình thanh toán (Ví dụ cài đặt SePay webhook). |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống, đang ở màn hình Quản lý người thuê và có ít nhất 1 người thuê đang tồn tại. |
| **Điều kiện sau** | Thông tin người thuê (bao gồm thiết lập thanh toán) được lưu lại. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin chọn một Tenant cần chỉnh sửa.<br>2. Hệ thống load lại form với dữ liệu cũ (Tên, cấu hình ngân hàng, Token thanh toán).<br>3. Admin điều chỉnh và bấm "Cập nhật".<br>4. Gọi API cập nhật xuống Backend.<br>5. Backend cập nhật Database và trả về thành công.<br>6. Web tải lại danh sách/báo cáo. |
| **Luồng sự kiện phụ (Alternative Flow)** | **5.a: Lỗi không tìm thấy bản ghi** (Màn hình báo lỗi không tìm thấy người thuê). |

### UC-2.5: Xóa người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xóa người thuê |
| **Mục đích** | Tiêu hủy dữ liệu những đối tác ngừng hợp đồng. |
| **Mô tả** | Xóa bỏ một Tenant, kéo theo các Thiết bị và Người dùng phụ thuộc cũng sẽ bị giải phóng. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang thao tác trên bảng Người thuê. |
| **Điều kiện sau** | Tenant bị đánh dấu vô hiệu hóa hoặc bị xóa khỏi DB. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin nhấn chọn "Xóa".<br>2. Hộp thoại cảnh báo xuất hiện.<br>3. Admin xác nhận thao tác.<br>4. Backend tiến hành chạy lệnh Xóa (Cascade/Soft Delete) Tenant.<br>5. Đóng hộp thoại và refresh UI danh sách. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Admin hủy thao tác** (Quay lại bước trước, tắt hộp thoại). |

### UC-2.6: Tìm kiếm người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Tìm kiếm |
| **Mục đích** | Sàng lọc danh sách người thuê nhanh chóng bằng từ khóa. |
| **Mô tả** | Nhập từ khóa để load riêng các thông tin đối tác tương ứng. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập hệ thống và đang trong màn hình Quản lý người thuê. |
| **Điều kiện sau** | Trả về các Tenant có từ khóa trùng khớp. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Gõ từ khóa vào thanh tìm kiếm (Tên, Số điện thoại hoặc Email).<br>2. Web gọi API filter tenant theo Text (có Debounce).<br>3. Backend truy vấn và trả lại mảng danh sách vừa tìm được.<br>4. Web hiển thị kết quả lọc trên bảng. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Không có kết quả** - Báo lỗi màn hình rỗng "Không tìm thấy kết quả nào trùng khớp". |

---

## 3. NHÓM QUẢN LÝ DOANH THU

### UC-3.1: Xem doanh thu / Báo cáo Doanh thu tổng hợp
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xem doanh thu |
| **Mục đích** | Xác định lãi/lỗ thông qua báo cáo dạng biểu đồ và thẻ tổng kết. |
| **Mô tả** | Báo cáo tài chính cho nền tảng (Admin) hoặc riêng thiết bị của mình (Tenant). |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Doanh thu. |
| **Điều kiện sau** | Hiển thị bảng tổng kết hoặc biểu đồ theo thời gian. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Người dùng chọn phạm vi ngày tháng cần lấy dữ liệu.<br>2. Gửi API request Report tổng hợp.<br>3. Backend duyệt qua bảng `transactions` có status `completed`, tổng hợp và nhóm số liệu.<br>4. Web tiếp nhận dữ liệu render lên các thành phần đồ họa (Bar Chart/Thẻ tổng kết). |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Giai đoạn không có thay đổi giao dịch** (Hiển thị 0đ và chart phẳng). |

---

## 4. NHÓM QUẢN LÝ GIAO DỊCH VÀ ĐƠN HÀNG

### UC-4.1: Quản lý giao dịch thanh toán
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Quản lý giao dịch |
| **Mục đích** | Rà soát các luồng tiền ra/vào và các thanh toán quét QR thành công/thất bại. |
| **Mô tả** | Theo dõi sát sao từng giao dịch khách hàng thực hiện qua QR code. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và vào tab Giao dịch. |
| **Điều kiện sau** | Danh sách transaction hiện lên đầy đủ. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Chọn menu Giao dịch.<br>2. Backend trả về Data gồm: ID Thiết bị, Thời gian, Số tiền thu, Trạng thái thanh toán, Nguồn thanh toán.<br>3. Bấm xem chi tiết để nắm thêm thông số kỹ thuật (ví dụ: Log lỗi API nếu có). |
| **Luồng sự kiện phụ (Alternative Flow)** | Lỗi backend nếu hệ thống cơ sở dữ liệu ngắt kết nối tạm thời. |

### UC-4.2: Xuất file thống kê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xuất file thống kê |
| **Mục đích** | Lưu trữ số liệu nội bộ. |
| **Mô tả** | In danh sách các giao dịch dưới dạng file mềm Excel / CSV. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Đã load xong danh sách trên web. |
| **Điều kiện sau** | Download file định dạng Excel/CSV về máy tính người dùng. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Bấm nút Tải xuống / Xuất file.<br>2. App xử lý gom dữ liệu từ mảng hiện tại.<br>3. Encode file dạng CSV và gọi tính năng Download của trình duyệt.<br>4. File lưu về máy. |
| **Luồng sự kiện phụ (Alternative Flow)** | Nếu dữ liệu rỗng trống, xuất ra file CSV có header chuẩn nhưng nội dung trống. |

---

## 5. NHÓM QUẢN LÝ THIẾT BỊ

### UC-5.1: Quản lý thiết bị (Tổng quát)
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Quản lý thiết bị |
| **Mục đích** | Xem tổng quan thiết bị kết nối. |
| **Mô tả** | Tích hợp giao diện truy vấn bảng danh sách `devices` kết nối với `tenants`. Do hệ thống trực tiếp liên kết thiết bị đến Đối tác nên luồng xử lý được làm phẳng. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập. |
| **Điều kiện sau** | Có khả năng vào sâu các UseCase quản lý thiết bị chi tiết. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Truy cập tab Thiết bị. <br>2. Load danh sách từ API. |
| **Luồng sự kiện phụ (Alternative Flow)** | Màn hình tải liên tục nếu API không phản hồi. |

### UC-5.2: Thêm thiết bị tĩnh
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Thêm cấu hình bảng thiết bị |
| **Mục đích** | Bổ sung phần cứng mới, tích hợp mạch ESP vào phần mềm. |
| **Mô tả** | Đăng ký trực tiếp khai báo MAC Address từ Backend trên giao diện web để bảo mật. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và có tab quản trị Thiết bị. |
| **Điều kiện sau** | Thiết bị mới được thêm vào DB. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Bấm "Thêm thiết bị".<br>2. Khai báo `deviceId` (MAC), Đặt Tên thiết bị, và Giá tiền mỗi phút.<br>3. Nhấn Lưu.<br>4. Backend ghi vào cơ sở dữ liệu với trạng thái `is_active = true`.<br>5. Thông báo tạo thành công. |
| **Luồng sự kiện phụ (Alternative Flow)** | **4.a: DeviceID sai định dạng hoặc bị trùng** (Báo lỗi từ Middleware chặn không lưu). |

### UC-5.3: Xem thiết bị và Trạng thái Heartbeat
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xem thiết bị |
| **Mục đích** | Lấy danh sách máy bơm đang hoạt động cùng trạng thái Ping cuối cùng. |
| **Mô tả** | Liệt kê nhanh thiết bị theo trạng thái hoạt động online / offline. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Đăng nhập hệ thống. |
| **Điều kiện sau** | Có cái nhìn bao quát về tình hình mạng IoT của dự án. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Yêu cầu tải danh sách.<br>2. Backend query DB và kiểm tra thêm thời gian `last_heartbeat` của từng record.<br>3. Backend tính toán xem Thiết bị là Online (Heartbeat mới) hay Offline (Đã mất Heartbeat quá chu kỳ).<br>4. Trả kết quả kèm Tag tương ứng lên giao diện Web. |
| **Luồng sự kiện phụ (Alternative Flow)** | Thiết bị mất kết nối quá lâu, hệ thống hiển thị Offline kèm cảnh báo đỏ. |

### UC-5.4: Sửa thiết bị
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Chỉnh sửa cấu hình bảng |
| **Mục đích** | Được phép sửa lại thông số như Tên, Đơn giá dịch vụ. |
| **Mô tả** | Can thiệp thay đổi giá dịch vụ, tên trỏ thiết bị. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Đã load danh sách xong. |
| **Điều kiện sau** | Bản ghi Thiết bị được update thông số mới nhất. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Bấm chọn Thiết bị.<br>2. Thay đổi giá trị trên Form.<br>3. Cập nhật.<br>4. Báo thành công, hệ thống áp dụng giá cho các giao dịch sau này. |
| **Luồng sự kiện phụ (Alternative Flow)** | Lỗi mất kết nối Internet khi lưu. Form báo timeout và yêu cầu thử lại. |

### UC-5.5: Xóa thiết bị
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xóa cấu hình |
| **Mục đích** | Vô hiệu hóa thiết bị khi có hỏng hóc hoặc vứt bỏ phần cứng. |
| **Mô tả** | Gỡ hoàn toàn một thiết bị để ngăn không cho cấp phép nhận lệnh nữa. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Đang đứng sẵn ở giao diện thiết bị. |
| **Điều kiện sau** | Thiết bị mất hiển thị ở backend. ESP32 sẽ bị khóa quyền điều khiển. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Bấm xóa thiết bị. <br>2. Kiểm tra cảnh báo qua hộp thoại UI xác nhận.<br>3. Admin Đồng ý. <br>4. API tiến hành gỡ liên kết thiết bị khỏi CSDL (Cascade Delete transaction liên quan nếu khai báo). <br>5. Cập nhật bảng kết quả thành công. |
| **Luồng sự kiện phụ (Alternative Flow)** | Người dùng chọn Hủy ở bước Hộp thoại. |

---

## 6. NHÓM CHỨC NĂNG KHÁCH HÀNG

### UC-6.1: Thanh toán và Khởi động thiết bị tự động
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Thanh toán dịch vụ |
| **Mục đích** | Khách hàng thực hiện nạp tiền và chờ đợi tự động kích hoạt máy bơm. |
| **Mô tả** | Cho phép khách hàng mở khóa vòi bơm thông qua thanh toán trên điện thoại. |
| **Tác nhân** | Khách hàng |
| **Điều kiện trước** | Khách hàng quét QR ngay tại máy/thiết bị vật lý bằng Điện thoại có kết nối internet. |
| **Điều kiện sau** | Giao dịch `transactions` được lưu (pending -> completed). Thiết bị nhận lệnh `START`. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Khách hàng dùng app Camera quét mã QR, truy cập trình duyệt Web Public.<br>2. Hệ thống truy xuất tham số ID Thiết bị trên URL, tra cứu Thông tin Tenant.<br>3. Web hiển thị màn hình báo giá số lượng phút tùy chọn.<br>4. Khách hàng click gói, web tính toán Số tiền và xuất ra QR Ngân hàng (Ví dụ: SePay) đã dán sẵn Nội dung giao dịch.<br>5. Khách quét mã, chuyển khoản trên banking.<br>6. Webhook SePay của hệ thống nhận biến động số dư và tiến hành update Transaction thành Completed.<br>7. Web trên điện thoại khách hàng xác nhận báo xanh, hiện nút "Bắt đầu".<br>8. Khách ấn nút Bắt đầu, gọi API sinh lệnh khởi động (`device_commands` dạng `start`).<br>9. Giao diện Web hiển thị bộ đếm đếm ngược theo thời gian đã mua. |
| **Luồng sự kiện phụ (Alternative Flow)** | **8.a: Bấm lúc thiết bị bị Offline (Rớt mạng)**<br> - 8.a.1: Lệnh đẩy xuống bị kẹt ở trạng thái Pending.<br> - 8.a.2: Hệ thống báo lỗi thiết bị, ngắt bộ đếm và chuyển ca sang bộ phận bồi thường.<br><br>**6.a: Khách chuyển khoản sai số tiền hoặc nội dung**<br> - 6.a.1: Webhook SePay bị mismatch số tiền, đánh dấu transaction Failed.<br> - 6.a.2: Giữ trạng thái QR, nhắc nhở khách hàng gặp lỗi thanh toán. |

---

## 7. NHÓM CHỨC NĂNG IOT DEVICE (ESP32)

### UC-7.1: Đăng ký hệ thống cơ bản
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Đăng ký thiết bị lên mạng |
| **Mục đích** | Cài đặt và định tuyến giữa ID thực tế của phần cứng với môi trường Database. |
| **Mô tả** | Giúp ESP32 khi có nguồn có thể ping gửi MAC Address lên cho server để được điểm danh. |
| **Tác nhân** | IoT Device |
| **Điều kiện trước** | ESP32 nạp Firmware và đã kết nối mạng WiFi thành công. |
| **Điều kiện sau** | Thiết bị sẵn sàng chạy các lệnh logic khác. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Khi boot lên, IoT Device tạo một HTTP POST request tới API `/api/iot/device/register`.<br>2. Nội dung POST bao gồm JSON chứa các biến cứng: `deviceId`, `tenantId`, `name`.<br>3. Backend kiểm tra ID thiết bị trong Data. Nếu đã tồn tại thì cập nhật trạng thái kết nối. Nếu chưa có thì tự động tạo mới (Dựa trên Setup của Tenant).<br>4. Trả về mã 200/201 Success.<br>5. Firmware lưu trữ trạng thái chờ lệnh vòng lặp. |
| **Luồng sự kiện phụ (Alternative Flow)** | Request gửi fail do chặn Filewall hoặc mất Internet, ESP32 reset và retry chu kỳ mới. |

### UC-7.2: Gọi Ping trạng thái sống (Heartbeat)
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Heartbeat |
| **Mục đích** | Chứng minh thiết bị đang trực tuyến. |
| **Mô tả** | Module ESP liên tục gửi tín hiệu "Tôi đang Online" để Web update trạng thái thiết bị là Xanh. |
| **Tác nhân** | IoT Device |
| **Điều kiện trước** | Đã thực hiện xong UC-7.1. |
| **Điều kiện sau** | Cột Heartbeat của Database được lưu giờ hiện hành. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Mỗi một Delay cứng (Ví dụ 15s - 30s), IoT Device gửi HTTP Request tới API `/api/iot/device/heartbeat`.<br>2. Backend cập nhật cột `last_heartbeat` với thời gian hiện tại trên Database.<br>3. Trả phản hồi 200 OK để kết thúc chu kỳ. |
| **Luồng sự kiện phụ (Alternative Flow)** | Server trả Timeout do mạng không ổn định, ESP32 thiết lập cờ Warning nội bộ và nhảy qua chờ chu kỳ heartbeat tiếp theo thay vì ngắt quá trình khác. |

### UC-7.3: Gọi lệnh thực thi
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Fetch Data Commands & Thực thi |
| **Mục đích** | Khởi động/Đóng ngắt rơ le máy bơm khi nhận được yêu cầu từ Web (Đã nạp tiền). |
| **Mô tả** | Thiết bị IoT tự chủ động kéo lệnh từ CSDL để vận hành Output. |
| **Tác nhân** | IoT Device |
| **Điều kiện trước** | Có một `device_command` mới trong trạng thái `pending` thuộc về thiết bị đang hiện hành trên hệ thống. |
| **Điều kiện sau** | Lệnh được execute và trạng thái phần cứng thay đổi. |
| **Luồng sự kiện chính (Basic Flow)** | 1. ESP32 thực hiện vòng lặp fetch chờ lệnh từ API.<br>2. API trả về JSON chứa lệnh. Giả sử Command = `START` kèm Timer.<br>3. ESP32 trích xuất lệnh, kéo Pin Relay lên CAO (kích hoạt thiết bị ngoại vi).<br>4. IoT chạy Countdown Timer độc lập.<br>5. Bắn ngược lại API update Command lên `executed`.<br>6. (Kết thúc gói Timer) IoT tự kéo Pin Relay về thấp (Tắt bơm). |
| **Luồng sự kiện phụ (Alternative Flow)** | Device hỏng Port hoặc ADC báo lỗi chạm mạch, POST log Error về `/api/iot/device/log` để lưu cảnh báo, hủy thực thi relay. |
