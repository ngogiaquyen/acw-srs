CHƯƠNG 2. KHẢO SÁT,PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG ACW-SRS

2.1. Giới thiệu hệ thống

2.1.1. Giới thiệu về ACW-SRS

ACW-SRS là viết tắt của **Automatic Car Wash – Self-service System**, có nghĩa là Hệ thống Rửa xe Tự động Tự phục vụ. Tên gọi phản ánh đúng bản chất của hệ thống: khách hàng chủ động thanh toán qua mã QR và sử dụng máy rửa xe ngay lập tức mà không cần bất kỳ sự can thiệp nào từ nhân viên, toàn bộ quá trình được tự động hóa thông qua nền tảng web và công nghệ IoT.

ACW-SRS là một hệ thống rửa xe tự phục vụ thông minh, tích hợp giữa nền tảng web hiện đại (Next.js, React, TypeScript) và thiết bị phần cứng nhúng (ESP32), nhằm tự động hóa toàn bộ quy trình thanh toán và vận hành trạm rửa xe. Hệ thống được phát triển với mục tiêu loại bỏ sự can thiệp thủ công của người quản lý trong quá trình thanh toán và kích hoạt máy, từ đó giảm chi phí nhân sự, tăng tính minh bạch và nâng cao trải nghiệm của khách hàng.

ACW-SRS được xây dựng theo mô hình **tự phục vụ (self-service)** kết hợp **Multi-tenant**, trong đó khách hàng chủ động quét mã QR, thực hiện thanh toán và sử dụng máy rửa xe mà không cần nhân viên thu tiền hay vận hành trực tiếp. Đồng thời, nhiều chủ trạm (Tenant) độc lập có thể cùng quản lý hệ thống trạm rửa xe của riêng mình trên một nền tảng chung mà không ảnh hưởng lẫn nhau. Hệ thống hỗ trợ người dùng thực hiện các tác vụ sau:

- Quản lý trạm rửa xe và thiết bị IoT từ xa thông qua Dashboard web.
- Tự động kích hoạt máy rửa xe sau khi khách hàng hoàn tất thanh toán qua mã QR Dynamic (VietQR).
- Giám sát trạng thái thiết bị IoT theo thời gian thực và nhận cảnh báo khi có sự cố.
- Theo dõi doanh thu và lịch sử giao dịch một cách trực quan.

ACW-SRS cung cấp các tính năng cốt lõi giúp tối ưu hóa hoạt động kinh doanh dịch vụ rửa xe:

- **Thanh toán tự động qua QR Dynamic**: Khách hàng quét mã QR, thực hiện chuyển khoản ngân hàng; hệ thống tự động nhận biến động số dư qua Webhook SePay và kích hoạt máy mà không cần sự can thiệp của con người.
- **Giám sát IoT thời gian thực**: Dashboard hiển thị trạng thái Online/Offline của từng thiết bị ESP32, thời gian còn lại của lượt sử dụng và các cảnh báo sự cố.
- **Quản lý đa trạm (Multi-tenant)**: Mỗi chủ trạm có không gian quản lý riêng biệt, an toàn và được cô lập dữ liệu hoàn toàn.
- **Thống kê doanh thu trực quan**: Biểu đồ doanh thu theo ngày, tuần, tháng giúp chủ trạm đánh giá hiệu quả kinh doanh.
- **Điều khiển thiết bị từ xa**: Cho phép bật/tắt cưỡng bức thiết bị từ Dashboard trong trường hợp cần bảo trì.

2.1.2. Giới thiệu hệ thống

Dịch vụ rửa xe là một ngành dịch vụ phổ biến tại Việt Nam với hàng nghìn cơ sở hoạt động trên cả nước. Tuy nhiên, phần lớn các trạm rửa xe hiện nay vẫn vận hành theo phương thức truyền thống: thu tiền mặt thủ công, kích hoạt thiết bị bằng tay và không có hệ thống theo dõi doanh thu hay giám sát thiết bị từ xa. Mô hình vận hành này tồn tại nhiều hạn chế, bao gồm sự phụ thuộc vào nhân lực trực tiếp, nguy cơ thất thoát doanh thu do thiếu minh bạch và không có khả năng phát hiện sự cố thiết bị kịp thời.

Sự phát triển của các công nghệ như thanh toán không tiền mặt (VietQR, NAPAS 247), Internet of Things (IoT) và nền tảng web hiện đại (Next.js, Node.js) đã mở ra cơ hội để xây dựng một giải pháp rửa xe tự phục vụ thông minh, tự động và hiệu quả hơn. Do đó, hệ thống ACW-SRS được phát triển nhằm giải quyết các vấn đề thực tiễn nêu trên, cung cấp một nền tảng kết hợp giữa phần mềm web và phần cứng IoT để tự động hóa toàn bộ quy trình từ lúc khách hàng thanh toán đến khi máy rửa xe hoàn tất chu kỳ hoạt động.

Mục tiêu chính của hệ thống ACW-SRS là xây dựng một nền tảng quản lý dịch vụ rửa xe tự phục vụ toàn diện, giúp người dùng:

- **Tự động hóa hoàn toàn** quy trình thanh toán và kích hoạt thiết bị thông qua tích hợp cổng thanh toán SePay và giao tiếp HTTP với thiết bị ESP32.
- **Giám sát hệ thống 24/7** với khả năng theo dõi trạng thái thiết bị IoT theo thời gian thực, nhận cảnh báo sự cố và điều khiển từ xa.
- **Quản lý đa trạm linh hoạt** theo mô hình Multi-tenant, đảm bảo cô lập dữ liệu tuyệt đối giữa các chủ trạm.
- **Tối ưu hóa trải nghiệm người dùng** với giao diện web thân thiện, hỗ trợ đầy đủ trên cả máy tính và thiết bị di động.
- **Minh bạch hóa doanh thu** thông qua hệ thống thống kê và báo cáo giao dịch chi tiết.

2.1.3. Mô tả bài toán

**Nghiệp vụ:**

**Về phía khách hàng:**

- **Thanh toán qua mã QR cố định**: Khách hàng quét mã QR được dán sẵn tại trạm, thực hiện chuyển khoản ngân hàng theo đúng nội dung yêu cầu. Hệ thống tự động nhận biến động số dư, đối chiếu giao dịch và kích hoạt máy rửa xe mà không cần nhân viên can thiệp.

**Về phía chủ trạm (Tenant):**

- **Đăng ký và đăng nhập**: Chủ trạm tạo tài khoản và đăng nhập vào hệ thống để quản lý các trạm của mình.
- **Đổi mật khẩu / Quên mật khẩu**: Chủ trạm có thể thay đổi mật khẩu hoặc lấy lại mật khẩu thông qua email.
- **Quản lý trạm rửa xe**: Thêm trạm mới bằng cách gán ID thiết bị ESP32, cấu hình đơn giá dịch vụ theo phút, chỉnh sửa thông tin hoặc tạm dừng hoạt động trạm.
- **Giám sát và điều khiển IoT**: Theo dõi trạng thái Online/Offline của thiết bị theo thời gian thực; điều khiển bật/tắt thiết bị từ Dashboard khi cần bảo trì; nhận cảnh báo khi thiết bị mất kết nối hoặc Relay gặp sự cố.
- **Quản lý doanh thu**: Xem thống kê doanh thu theo ngày, tuần, tháng cho từng trạm; xuất báo cáo lịch sử giao dịch; theo dõi biểu đồ tăng trưởng doanh thu.

**Về phía quản trị viên (Admin):**

- **Đăng nhập hệ thống**: Quản trị viên đăng nhập bằng tài khoản riêng có đặc quyền cao nhất.
- **Quản lý tài khoản Tenant**: Admin có thể xem danh sách, kích hoạt hoặc vô hiệu hóa tài khoản chủ trạm trên toàn hệ thống.

2.2. Yêu cầu về hệ thống

2.2.1. Yêu cầu chức năng của hệ thống
Quản lý tài khoản:
Đăng nhập đổi mật khẩu, quên mật khẩu.
Cập nhật thông tin chủ trạm.
Quản lý trạm rửa xe:
Thêm trạm mới (Gán ID cho bộ ESP32).
Cấu hình đơn giá dịch vụ theo phút.
Chỉnh sửa thông tin trạm hoặc tạm dừng hoạt động trạm.
Giám sát & Điều khiển IoT:
Theo dõi trạng thái Online/Offline của thiết bị ESP32 theo thời gian thực.
Điều khiển bật/tắt cưỡng bức thiết bị từ Dashboard (trong trường hợp bảo trì).
Nhận cảnh báo khi thiết bị mất kết nối hoặc Relay gặp sự cố.
Quản lý doanh thu:
Xem thống kê doanh thu theo ngày, tuần, tháng cho từng trạm.
Xuất báo cáo lịch sử giao dịch (thanh toán qua SePay).
Biểu đồ trực quan hóa dữ liệu tăng trưởng doanh thu.
Thanh toán & Sử dụng dịch vụ:
Quét mã QR Dynamic để thực hiện thanh toán tự động.
Hệ thống tự động kích hoạt máy rửa xe sau khi nhận được tiền.
Theo dõi tiến trình: Xem thời gian đếm ngược còn lại của lượt sử dụng trực tiếp trên giao diện web.
2.2.2. Yêu cầu phi chức năng
Hiệu suất:
Thời gian phản hồi từ lúc khách thanh toán đến khi máy kích hoạt (Relay đóng) phải dưới 2 giây.
Giao diện Dashboard quản lý phải hoạt động mượt mà, phản hồi chuyển trang dưới 1 giây.
Bảo mật:
Dữ liệu giữa các Tenant phải được cô lập hoàn toàn (Multi-tenancy isolation).
Mã hóa mật khẩu người dùng.
Đảm bảo an toàn cho các Webhook nhận biến động số dư từ ngân hàng.
Độ tin cậy:
Hệ thống hoạt động 24/7, có khả năng tự động khôi phục kết nối Wi-Fi cho ESP32 khi gặp sự cố mạng.
Sao lưu cơ sở dữ liệu hàng ngày để đảm bảo an toàn dữ liệu doanh thu.


2.3 Phân tích chi tiết từng chức năng


## 2.3. Phân tích chi tiết từng chức năng 

2.3.1 Chức năng Đăng nhập
Đặc tả chức năng Đăng nhập
Biểu đồ hoạt động chức năng Đăng nhập
Biểu đồ trình tự chức năng Đăng nhập

2.3.2 Chức năng Xem thông tin người thuê
Đặc tả chức năng Xem thông tin người thuê
Biểu đồ hoạt động chức năng Xem thông tin người thuê
Biểu đồ trình tự chức năng Xem thông tin người thuê

2.3.3 Chức năng Thêm người thuê
Đặc tả chức năng Thêm người thuê
Biểu đồ hoạt động chức năng Thêm người thuê
Biểu đồ trình tự chức năng Thêm người thuê

2.3.4 Chức năng Sửa người thuê
Đặc tả chức năng Sửa người thuê
Biểu đồ hoạt động chức năng Sửa người thuê
Biểu đồ trình tự chức năng Sửa người thuê

2.3.5 Chức năng Xóa người thuê
Đặc tả chức năng Xóa người thuê
Biểu đồ hoạt động chức năng Xóa người thuê
Biểu đồ trình tự chức năng Xóa người thuê

2.3.6 Chức năng Xem doanh thu
Đặc tả chức năng Xem doanh thu
Biểu đồ hoạt động chức năng Xem doanh thu
Biểu đồ trình tự chức năng Xem doanh thu

2.3.7 Chức năng Gửi báo cáo doanh thu
Đặc tả chức năng Gửi báo cáo doanh thu
Biểu đồ hoạt động chức năng Gửi báo cáo doanh thu
Biểu đồ trình tự chức năng Gửi báo cáo doanh thu

2.3.8 Chức năng Xem giao dịch
Đặc tả chức năng Xem giao dịch
Biểu đồ hoạt động chức năng Xem giao dịch
Biểu đồ trình tự chức năng Xem giao dịch

2.3.9 Chức năng Xuất file thống kê
Đặc tả chức năng Xuất file thống kê
Biểu đồ hoạt động chức năng Xuất file thống kê
Biểu đồ trình tự chức năng Xuất file thống kê

2.3.10 Chức năng Xem thiết bị
Đặc tả chức năng Xem thiết bị
Biểu đồ hoạt động chức năng Xem thiết bị
Biểu đồ trình tự chức năng Xem thiết bị

2.3.11 Chức năng Thêm thiết bị
Đặc tả chức năng Thêm thiết bị
Biểu đồ hoạt động chức năng Thêm thiết bị
Biểu đồ trình tự chức năng Thêm thiết bị

2.3.12 Chức năng Sửa cấu hình thiết bị
Đặc tả chức năng Sửa cấu hình thiết bị
Biểu đồ hoạt động chức năng Sửa cấu hình thiết bị
Biểu đồ trình tự chức năng Sửa cấu hình thiết bị

2.3.13 Chức năng Xóa thiết bị
Đặc tả chức năng Xóa thiết bị
Biểu đồ hoạt động chức năng Xóa thiết bị
Biểu đồ trình tự chức năng Xóa thiết bị

2.3.14 Chức năng Thanh toán
Đặc tả chức năng Thanh toán
Biểu đồ hoạt động chức năng Thanh toán
Biểu đồ trình tự chức năng Thanh toán

2.3.15 Chức năng Đăng ký hệ thống
Đặc tả chức năng Đăng ký hệ thống
Biểu đồ hoạt động chức năng Đăng ký hệ thống
Biểu đồ trình tự chức năng Đăng ký hệ thống

2.3.16 Chức năng Gửi trạng thái
Đặc tả chức năng Gửi trạng thái
Biểu đồ hoạt động chức năng Gửi trạng thái
Biểu đồ trình tự chức năng Gửi trạng thái

2.3.17 Chức năng Nhận lệnh điều khiển
Đặc tả chức năng Nhận lệnh điều khiển
Biểu đồ hoạt động chức năng Nhận lệnh điều khiển
Biểu đồ trình tự chức năng Nhận lệnh điều khiển


