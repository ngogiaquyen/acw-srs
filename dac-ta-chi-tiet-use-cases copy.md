# Tài liệu Đặc tả Use Case Chi tiết - Hệ thống ACW-SRS

Tài liệu này cung cấp các đặc tả chi tiết cho toàn bộ các chức năng theo yêu cầu, tuân thủ chặt chẽ cấu trúc mẫu.

---

## 1. NHÓM XÁC THỰC

### UC-1.1: Đăng nhập
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Đăng nhập |
| **Mục đích** | Xác thực danh tính người dùng để cho phép truy cập vào các chức năng quản trị. |
| **Mô tả** | Người dùng đăng nhập vào ứng dụng bằng cách nhập thông tin định danh (Email) và mật khẩu hợp lệ. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Người dùng đã có tài khoản trên hệ thống và đang ở trang đăng nhập. |
| **Điều kiện sau** | Hệ thống chuyển người dùng đến màn hình Dashboard quản trị tương ứng. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Tác nhân truy cập trang đăng nhập.<br>2. Web hiển thị form đăng nhập.<br>3. Người dùng nhập Email và mật khẩu.<br>4. Tác nhân bấm nút đăng nhập.<br>5. Web gửi thông tin đăng nhập tới backend.<br>6. Backend nhận yêu cầu và kiểm tra thông tin với database.<br>7. Backend trả về kết quả thành công (HTTP Code 200).<br>8. Hệ thống nhận thông báo thành công và Access Token.<br>9. Web lưu Access Token vào bộ nhớ local và điều hướng tới trang quản lý. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Email hoặc Mật khẩu không đúng định dạng**<br> - 3.a.1: Hệ thống hiển thị thông báo lỗi ngay trên form.<br> - 3.a.2: Người dùng thực hiện nhập lại thông tin.<br><br>**8.a: Sai thông tin đăng nhập hoặc tài khoản bị khóa**<br> - 8.a.1: Backend trả về mã lỗi và thông báo không khớp.<br> - 8.a.2: Web hiển thị thông báo "Email hoặc mật khẩu không chính xác" và yêu cầu đăng nhập lại. |

---

## 2. NHÓM QUẢN LÝ NGƯỜI THUÊ (DÀNH CHO ADMIN)

### UC-2.1: Quản lý người thuê (Tổng quát)
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Quản lý người thuê |
| **Mục đích** | Cho phép Admin quản lý toàn bộ vòng đời tài khoản và thông tin của những người thuê trạm. |
| **Mô tả** | Admin có thể xem danh sách, thêm mới, cập nhật thông tin hoặc xóa người thuê khỏi hệ thống. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống. |
| **Điều kiện sau** | Admin truy cập được vào các chức năng con của Quản lý người thuê. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin chọn menu "Quản lý người thuê".<br>2. Hệ thống kiểm tra quyền truy cập.<br>3. Hệ thống hiển thị màn hình Quản lý người thuê bao gồm danh sách hiện tại và các nút chức năng Thêm, Sửa, Xóa. |
| **Luồng sự kiện phụ (Alternative Flow)** | **2.a: Lỗi phân quyền**<br> - 2.a.1: Hệ thống phát hiện tài khoản không phải là Admin.<br> - 2.a.2: Hệ thống từ chối truy cập và hiển thị thông báo lỗi "Không có quyền truy cập". |

### UC-2.2: Xem thông tin người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xem thông tin người thuê |
| **Mục đích** | Xem danh sách và chi tiết thông tin của các người thuê trong hệ thống. |
| **Mô tả** | Hệ thống truy xuất và hiển thị danh sách người thuê cùng thông tin chi tiết của họ lên giao diện. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê. |
| **Điều kiện sau** | Admin xem được danh sách và thông tin người thuê. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin yêu cầu xem danh sách (hoặc tự động gọi khi vào trang).<br>2. Web gửi yêu cầu lấy danh sách người thuê xuống Backend.<br>3. Backend truy vấn Database và trả về danh sách.<br>4. Web hiển thị danh sách lên bảng.<br>5. Admin nhấn vào một người thuê cụ thể để xem chi tiết.<br>6. Hệ thống hiển thị popup/trang chi tiết thông tin của người thuê đó. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Hệ thống lỗi hoặc Database không phản hồi**<br> - 3.a.1: Backend trả về mã lỗi 500.<br> - 3.a.2: Web hiển thị thông báo "Lấy dữ liệu thất bại, vui lòng thử lại sau". |

### UC-2.3: Thêm người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Thêm người thuê |
| **Mục đích** | Tạo mới một tài khoản người thuê trong hệ thống. |
| **Mô tả** | Admin nhập thông tin người thuê mới, hệ thống lưu trữ và cấp quyền tương ứng. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê. |
| **Điều kiện sau** | Một người thuê mới được tạo thành công và xuất hiện trong danh sách. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin bấm nút "Thêm mới".<br>2. Hệ thống hiển thị form nhập thông tin (Tên, Email, SĐT, Địa chỉ).<br>3. Admin điền thông tin và bấm "Lưu".<br>4. Web gửi yêu cầu tạo Tenant xuống Backend.<br>5. Backend kiểm tra tính hợp lệ và ghi vào Database.<br>6. Backend trả về thông báo tạo thành công.<br>7. Web đóng form, làm mới danh sách và hiển thị thông báo thành công. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Thiếu thông tin bắt buộc**<br> - 3.a.1: Form hiển thị màu đỏ các trường còn thiếu.<br> - 3.a.2: Admin tiếp tục điền thông tin bổ sung.<br><br>**5.a: Email đã tồn tại**<br> - 5.a.1: Backend trả về lỗi trùng lặp dữ liệu.<br> - 5.a.2: Web hiển thị lỗi "Email này đã được sử dụng". |

### UC-2.4: Sửa người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Sửa người thuê |
| **Mục đích** | Cập nhật thông tin của một người thuê đã tồn tại. |
| **Mô tả** | Admin thay đổi thông tin hiện tại của người thuê và lưu lại vào hệ thống. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống, đang ở màn hình Quản lý người thuê và có ít nhất 1 người thuê đang tồn tại. |
| **Điều kiện sau** | Thông tin người thuê được cập nhật thành công. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin chọn một người thuê từ danh sách và bấm "Sửa".<br>2. Hệ thống hiển thị form chứa sẵn thông tin cũ của người thuê.<br>3. Admin chỉnh sửa nội dung và bấm "Cập nhật".<br>4. Web gửi dữ liệu mới lên Backend.<br>5. Backend cập nhật Database và trả về kết quả thành công.<br>6. Web đóng form, load lại danh sách và báo thành công. |
| **Luồng sự kiện phụ (Alternative Flow)** | **5.a: Lỗi không tìm thấy bản ghi**<br> - 5.a.1: Backend báo lỗi 404 (do tenant có thể đã bị xóa bởi Admin khác).<br> - 5.a.2: Web thông báo "Người thuê không tồn tại" và tải lại trang. |

### UC-2.5: Xóa người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xóa người thuê |
| **Mục đích** | Loại bỏ người thuê ra khỏi hệ thống. |
| **Mô tả** | Admin thực hiện xóa tài khoản người thuê và giải phóng các thiết bị liên quan. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống, đang ở màn hình Quản lý người thuê và có ít nhất 1 người thuê đang tồn tại. |
| **Điều kiện sau** | Người thuê bị xóa khỏi hệ thống. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin chọn người thuê cần xóa và bấm "Xóa".<br>2. Hệ thống hiển thị hộp thoại xác nhận báo trước rủi ro.<br>3. Admin bấm "Đồng ý xóa".<br>4. Web gửi yêu cầu xóa lên Backend.<br>5. Backend xóa/ẩn người thuê trong Database và xử lý các thiết bị liên quan.<br>6. Backend trả về thông báo thành công.<br>7. Web làm mới danh sách và báo thành công. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Admin hủy thao tác**<br> - 3.a.1: Admin bấm nút "Hủy".<br> - 3.a.2: Hệ thống đóng hộp thoại xác nhận, không thực hiện hành động xóa. |

### UC-2.6: Tìm kiếm người thuê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Tìm kiếm người thuê |
| **Mục đích** | Tra cứu nhanh thông tin một hoặc nhiều người thuê dựa trên từ khóa (Ví dụ: Tên, Email, SĐT). |
| **Mô tả** | Admin nhập từ khóa vào ô tìm kiếm, hệ thống tự động lọc và hiển thị danh sách người thuê trùng khớp. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê. |
| **Điều kiện sau** | Bảng danh sách người thuê chỉ hiển thị các kết quả khớp với từ khóa tìm kiếm. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin nhập từ khóa (Tên, Email hoặc Số điện thoại) vào ô tìm kiếm.<br>2. Nhấn phím Enter, bấm nút tìm kiếm, hoặc chờ hệ thống debounce gõ tự động.<br>3. Web gửi từ khóa request lên API của Backend.<br>4. Backend truy vấn các trường dữ liệu tương ứng trong Database.<br>5. Backend trả về danh sách kết quả phù hợp.<br>6. Web cập nhật ngay lập tức bảng danh sách kết quả. |
| **Luồng sự kiện phụ (Alternative Flow)** | **4.a: Không tồn tại dữ liệu trùng khớp**<br> - 4.a.1: Backend trả về danh sách rỗng.<br> - 4.a.2: Web hiển thị khu vực bảng trống với thông báo "Không tìm thấy người thuê nào phù hợp". |

---

## 3. NHÓM QUẢN LÝ DOANH THU

### UC-3.1: Quản lý doanh thu (Tổng quát)
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Quản lý doanh thu |
| **Mục đích** | Cho phép theo dõi tình hình thu nhập của hệ thống hoặc từng trạm. |
| **Mô tả** | Tổng hợp chức năng nhằm mục đích thống kê, vẽ biểu đồ và gửi báo cáo liên quan đến tài chính. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống. |
| **Điều kiện sau** | Người dùng tiếp cận được dữ liệu doanh thu. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Người dùng chọn menu "Doanh thu".<br>2. Hệ thống kiểm tra quyền để quyết định hiển thị toàn cục (Admin) hay cục bộ (Người thuê).<br>3. Hiển thị trang Dashboard Doanh thu. |
| **Luồng sự kiện phụ (Alternative Flow)** | **2.a: Lỗi token hết hạn**<br> - 2.a.1: Cần đăng nhập lại để xem dữ liệu. |

### UC-3.2: Xem doanh thu
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xem doanh thu |
| **Mục đích** | Xem tổng hợp số liệu thu nhập qua các biểu đồ trục thời gian. |
| **Mô tả** | Hệ thống lấy dữ liệu giao dịch thành công, nhóm theo thời gian và render thành biểu đồ/số tổng. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Doanh thu. |
| **Điều kiện sau** | Hiển thị chính xác số liệu theo khoảng thời gian được chọn. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Người dùng chọn bộ lọc thời gian (Hôm nay, Tuần, Tháng).<br>2. Web gọi API lấy số liệu thống kê.<br>3. Backend tổng hợp từ Database và trả về.<br>4. Web vẽ biểu đồ hoặc cập nhật các thẻ số liệu thống kê tổng. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Không có dữ liệu trong kỳ**<br> - 3.a.1: Backend trả về danh sách rỗng 0đ.<br> - 3.a.2: Web hiển thị biểu đồ rỗng với lời nhắn "Chưa có giao dịch nào". |

### UC-3.3: Gửi báo cáo doanh thu
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Gửi báo cáo doanh thu |
| **Mục đích** | Gửi thông tin tổng kết doanh thu định kỳ qua email. |
| **Mô tả** | Trích xuất báo cáo doanh thu dưới dạng PDF/Excel và tự động gửi tới email chỉ định. |
| **Tác nhân** | Admin |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Doanh thu. |
| **Điều kiện sau** | Email chứa báo cáo được gửi đi thành công. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin bấm nút "Gửi báo cáo".<br>2. Hệ thống hiển thị popup chọn kỳ báo cáo và email nhận.<br>3. Admin điền thông tin và bấm "Gửi".<br>4. Backend tạo file tổng hợp và sử dụng Mail Service để gửi tin.<br>5. Backend trả về trạng thái gửi thành công.<br>6. Web thông báo "Báo cáo đã gửi thành công". |
| **Luồng sự kiện phụ (Alternative Flow)** | **4.a: Lỗi dịch vụ gửi Email (Mail server out/Timeout)**<br> - 4.a.1: Backend bắt lỗi gửi mail thất bại.<br> - 4.a.2: Trả về thông báo "Lỗi khi gửi email, vui lòng xem lại cấu hình máy chủ". |

---

## 4. NHÓM QUẢN LÝ GIAO DỊCH

### UC-4.1: Quản lý giao dịch (Tổng quát)
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Quản lý giao dịch |
| **Mục đích** | Quản lý lịch sử các khoản thanh toán từ khách hàng. |
| **Mô tả** | Giao diện danh sách các giao dịch thanh toán QR thành công hoặc thất bại. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống. |
| **Điều kiện sau** | Hiển thị màn hình quản lý giao dịch. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Chọn menu "Giao dịch".<br>2. Hệ thống tải cấu trúc bộ lọc và bảng. |
| **Luồng sự kiện phụ (Alternative Flow)** | Không có luồng phụ phức tạp. |

### UC-4.2: Xem giao dịch
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xem giao dịch |
| **Mục đích** | Kiểm tra chi tiết thời gian, số tiền, trạng thái của từng giao dịch. |
| **Mô tả** | Khám phá dữ liệu từng bản ghi giao dịch để đối soát. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Giao dịch. |
| **Điều kiện sau** | Danh sách giao dịch được hiển thị đúng quyền hạn. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Web gửi yêu cầu lấy danh sách giao dịch (có phân trang/lọc).<br>2. Backend xác nhận quyền và trả về dữ liệu tương ứng.<br>3. Web hiển thị bảng giao dịch (Thời gian, Số tiền, Mã KH, Trạng thái).<br>4. Người dùng có thể bấm xem chi tiết từng dòng. |
| **Luồng sự kiện phụ (Alternative Flow)** | **2.a: Lọc theo thời điểm không cố định/ Lỗi DB**<br> - 2.a.1: Web thông báo không thể tìm thấy dữ liệu. |

### UC-4.3: Xuất file thống kê
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xuất file thống kê |
| **Mục đích** | Xuất dữ liệu ra file mềm (Excel, CSV) cho việc kế toán ngoài hệ thống. |
| **Mô tả** | Người dùng chọn dữ liệu và hệ thống sẽ xuất định dạng file tải về máy. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang xem danh sách giao dịch. |
| **Điều kiện sau** | File lưu sẵn ở thiết bị cục bộ. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Người dùng bấm "Xuất file".<br>2. Chọn định dạng (Xuất toàn bộ hoặc theo bộ lọc hiện có).<br>3. Backend tạo file `.csv` tĩnh và trả lại luồng (stream).<br>4. Web tải file xuống máy tính của người dùng.<br>5. Thông báo xuất thành công. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Khối lượng dữ liệu quá lớn**<br> - 3.a.1: Backend xử lý quá lâu, báo Timeout.<br> - 3.a.2: Web đề xuất người dùng chia nhỏ bộ lọc thời gian để xuất. |

---

## 5. NHÓM QUẢN LÝ THIẾT BỊ

### UC-5.1: Quản lý thiết bị (Tổng quát)
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Quản lý thiết bị |
| **Mục đích** | Giám sát và điều khiển toàn bộ các cỗ máy (node) ở tại các trạm. |
| **Mô tả** | Trung tâm quản trị liên quan tới việc thêm node IoT, tinh chỉnh thông số vận hành và kiểm tra kết nối. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống. |
| **Điều kiện sau** | Vào màn hình Thiết bị. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Chọn menu "Thiết bị".<br>2. Hệ thống tải danh sách. |
| **Luồng sự kiện phụ (Alternative Flow)** | Không có. |

### UC-5.2: Xem thiết bị
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xem thiết bị |
| **Mục đích** | Xem trạng thái kết nối và thuộc tính của các thiết bị máy bơm. |
| **Mô tả** | Hiển thị tất cả thiết bị với label đánh dấu "Online", "Offline", "Busy". |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị. |
| **Điều kiện sau** | Danh sách thiết bị cập nhật đúng trạng thái thực tế nhất. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Web gửi API lấy danh sách thiết bị.<br>2. Backend ghép với thông tin Heartbeat cuối cùng để tính toán trạng thái.<br>3. Backend trả dữ liệu kèm cờ Online/Offline.<br>4. Web hiển thị danh sách thiết bị dạng bảng hoặc dạng thẻ (Card). |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: Mất đồng bộ Heartbeat Database**<br> - 3.a.1: Backend báo lỗi log.<br> - 3.a.2: Web tạm nhận trạng thái cũ (Cached). |

### UC-5.3: Thêm thiết bị
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Thêm thiết bị |
| **Mục đích** | Gắn thẻ, thêm một module ESP32 mới tinh vào phần mềm quản lý trạm cụ thể. |
| **Mô tả** | Người dùng khai báo MAC Address và Tên cho hệ thống chấp nhận thiết bị kết nối lên. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị. |
| **Điều kiện sau** | Thiết bị thiết lập thành công. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Người dùng bấm "Thêm thiết bị mới".<br>2. Điền MAC Address, Tên thiết bị, Chọn trạm gán vào.<br>3. Bấm "Lưu".<br>4. Backend thẩm định dữ liệu và lưu DB.<br>5. Báo thêm mới thành công, thiết bị có thể bắt đầu được kết nối. |
| **Luồng sự kiện phụ (Alternative Flow)** | **4.a: MAC Address trùng lặp**<br> - 4.a.1: Backend báo thiết bị này đang thuộc trạm khác/ người khác.<br> - 4.a.2: Hệ thống báo lỗi "MAC ID không hợp lệ". |

### UC-5.4: Sửa cấu hình thiết bị
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Sửa cấu hình thiết bị |
| **Mục đích** | Định cấu hình giá tiền, thời gian tương ứng. |
| **Mô tả** | Cập nhật tên thiết bị, trạm gán hoặc bảng giá cước (Ví dụ x vnđ/phút). |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống, đang ở màn hình Thiết bị và thiết bị đã tồn tại. |
| **Điều kiện sau** | Thiết bị lưu trữ thông tin cấu hình mới nhất. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Bấm nút "Sửa" ở dòng thiết bị cần chỉnh.<br>2. Thay đổi các thuộc tính như Tên, Đơn giá/phút.<br>3. Bấm "Cập nhật".<br>4. Backend ghi lại DB, update Cache (nếu có).<br>5. Trả kết quả thành công. |
| **Luồng sự kiện phụ (Alternative Flow)** | **2.a: Nhập số âm cho đơn giá**<br> - 2.a.1: Web validation bắt lỗi.<br> - 2.a.2: Hiển thị lỗi "Đơn giá phải lớn hơn 0" trên form. |

### UC-5.5: Xóa thiết bị
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Xóa thiết bị |
| **Mục đích** | Xóa hoàn toàn thiết bị khỏi hệ thống khi hư hỏng/dời đi. |
| **Mô tả** | Xóa liên kết và dữ liệu thiết bị, từ đó thiết bị vật lý này sẽ không cấp phép nối lên Server được nữa. |
| **Tác nhân** | Admin, Người thuê |
| **Điều kiện trước** | Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị. |
| **Điều kiện sau** | Thiết bị biến mất khỏi hệ thống. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Bấm xoá thiết bị.<br>2. Nhận popup cảnh báo rủi ro thao tác.<br>3. Bấm xác nhận xóa.<br>4. Backend cô lập dữ liệu giao dịch cũ (giữ lại) nhưng xoá thực thể device table.<br>5. Thông báo xoá thành công. |
| **Luồng sự kiện phụ (Alternative Flow)** | **4.a: Thiết bị đang trong trạng thái BUSY (đáp ứng khách)**<br> - 4.a.1: Backend chặn tiến tình xoá để tránh mất tiền của khách đang dùng dở.<br> - 4.a.2: Web báo lỗi "Hãy chờ chu kỳ rửa hoàn tất để xoá". |

---

## 6. NHÓM CHỨC NĂNG KHÁCH HÀNG

### UC-6.1: Thanh toán
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Thanh toán |
| **Mục đích** | Cho phép khách hàng trả phí để bắt đầu sử dụng máy rửa xe. |
| **Mô tả** | Khách hàng quét mã QR, thanh toán qua cổng điện tử và nhấn nút bắt đầu trên web. |
| **Tác nhân** | Khách hàng |
| **Điều kiện trước** | Khách hàng ở gần trạm rửa xe, có thiết bị kết nối internet. |
| **Điều kiện sau** | Máy bơm được kích hoạt (Relay ON) trong khoảng thời gian đã mua. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Khách hàng sử dụng điện thoại quét mã QR được dán trên tủ máy rửa xe.<br>2. Trình duyệt mở trang chọn gói dịch vụ (Dựa trên ID thiết bị lưu ở URL).<br>3. Khách hàng bấm chọn số lượng tiền (Vd 10.000đ).<br>4. Web sinh ra một mã thanh toán (Ví dụ mã QR ngân hàng nhúng mã tham chiếu).<br>5. Khách hàng ngân hàng quét mã và thanh toán.<br>6. Hệ thống thanh toán (SePay/Webhook) gửi callback xác nhận về Backend.<br>7. Web polling hoặc WebSocket nhận được tín hiệu thành công và hiện nút "Bắt đầu".<br>8. Khách hàng bấm "Bắt đầu".<br>9. Backend chuyển lệnh qua mạng để ESP32 đóng relay máy bơm.<br>10. Web hiển thị đồng hồ đếm ngược. |
| **Luồng sự kiện phụ (Alternative Flow)** | **5.a: Khách hàng rời đi / Đóng trang**<br> - 5.a.1: Giao dịch không diễn ra, trạng thái máy vẫn Idle.<br><br>**9.a: Ngay lúc bấm bắt đầu, Thiết bị ngắt kết nối Wifi**<br> - 9.a.1: Backend gọi xuống ESP32 nhưng Timeout.<br> - 9.a.2: Web thông báo "Thiết bị gặp sự cố kết nối, chúng tôi đã ghi nhận hoàn tiền vào tài khoản/SĐT...". |

---

## 7. NHÓM CHỨC NĂNG IOT DEVICE (ESP32)

### UC-7.1: Đăng ký hệ thống
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Đăng ký hệ thống |
| **Mục đích** | Báo danh để Server nhận diện và cấp phép tham gia mạng lưới. |
| **Mô tả** | Khi thiết bị ESP32 boot lên, nó sẽ gửi một gói tin HTTP kèm MAC ADDRESS để thông báo danh tính lên API Server. |
| **Tác nhân** | IoT Device |
| **Điều kiện trước** | Đã cấu hình Wifi mật khẩu tại trạm thành công. |
| **Điều kiện sau** | Thiết bị bước vào vòng lặp làm việc bình thường. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Node ESP32 khởi động, truy cập Wifi.<br>2. Gửi lệnh POST `/api/iot/register` bao gồm tham số bắt buộc là `MAC_ADDRESS`.<br>3. Backend đối chiếu `MAC_ADDRESS` này trong Schema của Tenant/Admin tải lên trước đó.<br>4. Backend ghi nhận trạng thái thiết bị online và gửi phản hồi 200 kèm Token/cấu hình pin.<br>5. ESP32 lưu thông số và vào vòng lặp chờ lệnh. |
| **Luồng sự kiện phụ (Alternative Flow)** | **3.a: MAC Address chua được cấu hình trong bảng Backend**<br> - 3.a.1: Backend trả HTTP 403 Forbidden.<br> - 3.a.2: ESP32 đi vào trạng thái chờ 5p rồi đăng ký lại. |

### UC-7.2: Gửi trạng thái
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Gửi trạng thái (Heartbeat) |
| **Mục đích** | Duy trì bằng chứng thiết bị vẫn đang sống (Online). |
| **Mô tả** | Thiết bị ping định kỳ về server 30-60s 1 lần cập nhật trạng thái làm việc hiện tại (Bật hay đang Tắt). |
| **Tác nhân** | IoT Device |
| **Điều kiện trước** | ESP32 đã đăng ký hệ thống thành công (UC-7.1). |
| **Điều kiện sau** | `Last_seen` của thiết bị được cấp nhật. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Mỗi N giây, ESP32 gọi HTTP GET tới `/api/iot/heartbeat`.<br>2. Gói tin gắn kèm State (Bật/Tắt).<br>3. Backend Cập nhật timestamp trong DB.<br>4. Server phản hồi 200 OK. |
| **Luồng sự kiện phụ (Alternative Flow)** | **1.a: Rớt mạng Wifi trong lúc chạy**<br> - 1.a.1: Gửi request thất bại.<br> - 1.a.2: Phần cứng tiếp tục cho phép chạy nếu còn timer, sau đó nó sẽ retry liên tục tới khi có net. |

### UC-7.3: Nhận lệnh điều khiển
| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | Nhận lệnh điều khiển |
| **Mục đích** | Nhận tín hiệu khởi động từ xa sau khi người dùng trả tiền. |
| **Mô tả** | ESP32 đáp ứng các mệnh lệnh bật và tắt Relay vật lý qua giao tiếp Server (HTTP long polling hoặc Websocket tùy lựa chọn công nghệ IoT). |
| **Tác nhân** | IoT Device |
| **Điều kiện trước** | Đang có kết nối mạng ổn định với Backend. |
| **Điều kiện sau** | Rơ-le (Relay) được kích mức cao hoặc mức thấp thành công, trạng thái máy vật lý đổi khác. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Admin/Customer kích hoạt lệnh "Bật" cho thời gian N phút trên Server.<br>2. Server đẩy lệnh `cmd=START&duration=N` xuống module ESP32.<br>3. ESP32 phân tích gói lệnh.<br>4. ESP32 Set-Pin kích hoạt GPIO liên kết Relay => Bơm bắt đầu chạy.<br>5. ESP32 Gửi POST `status_log=STARTED` báo điểm danh thành công lên Server.<br>6. (Kết thúc) Sau khi timer đếm ngược tại ESP32 kết thúc, nó Set-Pin ngắt Relay và Gửi POST `status=STOPPED` lên server một lần nữa. |
| **Luồng sự kiện phụ (Alternative Flow)** | **4.a: Mạch chập cháy, Relay không hoạt động**<br> - 4.a.1: Trạng thái không thể thay đổi, phần cứng ghi nhận timeout hoặc ADC check.<br> - 4.a.2: Gửi gói Error packet Error=Hardware_Fails ngược lên Server cho Admin check tu bổ. |
