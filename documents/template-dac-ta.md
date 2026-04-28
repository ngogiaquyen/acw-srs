# Mẫu Đặc tả Use Case (Template)

Bạn có thể copy khung dưới đây để viết cho các Use Case khác trong đồ án.

---

## UC-[ID]: [Tên Use Case]

| Thông tin | Nội dung |
| :--- | :--- |
| **Use Case** | [Tên chức năng, ví dụ: Thanh toán] |
| **Mục đích** | [Mô tả ngắn gọn mục đích chức năng này nhằm giải quyết việc gì] |
| **Mô tả** | [Tóm tắt quá trình hoạt động của Use Case] |
| **Tác nhân** | [Tên các Actor tham gia vào Use Case - ví dụ: Khách hàng] |
| **Điều kiện trước** | [Các điều kiện cần thỏa mãn để Use Case có thể bắt đầu] |
| **Điều kiện sau** | [Trạng thái của hệ thống sau khi Use Case kết thúc thành công] |
| **Luồng sự kiện chính (Basic Flow)** | 1. [Bước hành động của Actor]<br>2. [Bước phản hồi của Hệ thống]<br>3. [Bước hành động tiếp theo của Actor]...<br>n. [Kết thúc thành công Use Case] |
| **Luồng sự kiện phụ (Alternative Flow)** | **[X].a: [Tên trường hợp ngoại lệ tại bước X]**<br> - [X].a.1: [Cách hệ thống xử lý lỗi/ngoại lệ]<br> - [X].a.2: [Hành động tiếp theo của người dùng]<br><br>**[Y].a: [Tên trường hợp lỗi khác tại bước Y]**<br> - [Y].a.1: [...] |

---

## Tham khảo: Đặc tả Use Case "Đăng nhập" (Hoàn thiện)

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
