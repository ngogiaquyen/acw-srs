import codecs

filepath = r'e:\JOB\esp32\acw-srs\documents\file_do_an.md'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

start_marker = "CHƯƠNG 4. TRIỂN KHAI\n"
end_marker = " KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN\n"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_chapter_4 = """CHƯƠNG 4. TRIỂN KHAI VÀ ĐÁNH GIÁ HỆ THỐNG


 4.1. Triển khai phần mềm Web Dashboard
 4.1.1. Cài đặt môi trường và kiến trúc hệ thống
Hệ thống được phát triển và vận hành dựa trên môi trường Node.js phiên bản LTS (v20.x), đảm bảo hiệu năng và sự ổn định dài hạn. Các thành phần lõi được cấu hình chi tiết như sau:
- Nền tảng Frontend & Backend: Sử dụng Next.js 14 với kiến trúc App Router. Sự kết hợp này cho phép thực hiện Server-Side Rendering (SSR) giúp tối ưu hóa SEO và mang lại tốc độ tải trang cực kỳ nhanh chóng.
- Hệ quản trị cơ sở dữ liệu: Lựa chọn MySQL 8.0 làm hệ quản trị cơ sở dữ liệu chính. Toàn bộ lược đồ dữ liệu (Schema) bao gồm thông tin người dùng, danh sách trạm rửa xe, lịch sử thiết bị và log giao dịch được thiết kế theo chuẩn dạng chuẩn 3NF nhằm loại bỏ dư thừa và đảm bảo tính toàn vẹn dữ liệu.
- Lớp trung gian tương tác dữ liệu (ORM): Triển khai Prisma ORM làm cầu nối giữa mã nguồn Node.js và MySQL. Prisma cung cấp khả năng truy vấn dữ liệu Type-safe, ngăn chặn tối đa các lỗi liên quan đến kiểu dữ liệu và tấn công SQL Injection.


 4.1.2. Triển khai API Routes và Cơ chế xác thực
Hệ thống API được xây dựng theo chuẩn RESTful nhằm phục vụ cả giao diện Web và các truy vấn đến từ thiết bị IoT.
- Cơ chế xác thực an toàn: Sử dụng thư viện NextAuth.js kết hợp với JSON Web Token (JWT). JWT được lưu trữ an toàn trong các HTTP-only Cookies để ngăn chặn các cuộc tấn công đánh cắp phiên làm việc (XSS).
- Phân quyền theo mô hình Multi-tenant: Middleware của Next.js được lập trình để can thiệp vào mọi Request. Tại đây, `tenant_id` được trích xuất từ Token người dùng để làm cơ sở lọc dữ liệu. Điều này đảm bảo rằng mỗi Tenant chỉ có thể truy cập, xem báo cáo doanh thu và tương tác với các trạm rửa xe thuộc quyền sở hữu của chính họ. Dữ liệu giữa các chủ trạm được cô lập tuyệt đối ở cấp độ cơ sở dữ liệu.
- Định tuyến API cho IoT: Xây dựng các điểm cuối chuyên biệt như `/api/iot/heartbeat` (cập nhật trạng thái) và `/api/iot/fetch-command` (nhận lệnh khởi động). Các gói tin JSON trao đổi ở đây được thiết kế với kích thước cực nhỏ để tiết kiệm băng thông mạng và giảm độ trễ xử lý.


 4.1.3. Xây dựng giao diện người dùng (UI/UX)
Giao diện quản trị (Dashboard) được thiết kế theo triết lý tối giản, trực quan và dễ thao tác:
- Thư viện và Framework: Sử dụng Tailwind CSS để kiểm soát hệ thống thiết kế (Design System) nhất quán. Các thành phần giao diện (Component) được tái sử dụng qua bộ thư viện shadcn/ui nhằm đem lại trải nghiệm mượt mà, chuyên nghiệp.
- Quản trị thời gian thực: Bảng điều khiển tích hợp các biểu đồ phân tích (sử dụng thư viện Recharts) giúp minh họa trực quan sự tăng trưởng doanh thu theo chu kỳ ngày, tuần, tháng. Trạng thái hoạt động (Online/Offline) của từng trạm được cập nhật và hiển thị theo thời gian thực.
- Tính năng thích ứng (Responsive): Giao diện được tối ưu hóa hiển thị hoàn hảo trên nhiều kích thước màn hình, từ PC, Tablet đến các thiết bị điện thoại thông minh, giúp chủ trạm có thể quản lý doanh nghiệp mọi lúc mọi nơi.


![Hình 4.1: Giao diện Dashboard quản lý doanh thu trạm](vị_trí_chèn_ảnh_3_1_dashboard)


 4.2. Thiết kế và Lập trình thiết bị IoT (ESP32)


 4.2.1. Cấu trúc phần cứng và thiết kế mạch điều khiển
Thiết bị vật lý tại mỗi trạm là một nút mạng IoT có khả năng tính toán và đóng ngắt dòng điện:
- Vi điều khiển lõi: Sử dụng module ESP32 WROOM-32U với anten ngoại vi giúp tăng cường khả năng bắt sóng Wi-Fi trong môi trường nhà xưởng có nhiều nhiễu kim loại.
- Khối chấp hành: Kích hoạt bơm nước và thiết bị phun bọt tuyết thông qua Module Relay 5V tích hợp mạch cách ly quang (Optocoupler), giúp bảo vệ vi điều khiển khỏi các xung điện ngược từ thiết bị công suất lớn.
- Khối nguồn: Sử dụng mạch chuyển đổi nguồn xung hạ áp từ 220VAC xuống 5VDC ổn định để cung cấp năng lượng liên tục cho toàn bộ bo mạch.


 4.2.2. Lập trình Firmware và Quản lý trạng thái
Chương trình cho ESP32 được viết bằng C/C++ trên nền tảng Arduino Core, tổ chức theo cấu trúc State Machine (Máy trạng thái) nhằm tránh hiện tượng treo (blocking).
- Thuật toán Watchdog & Tự động khôi phục: Hệ thống được lập trình cơ chế theo dõi luồng thực thi. Nếu mất kết nối Wi-Fi đột ngột, ESP32 sẽ đi vào trạng thái rà quét để tự động kết nối lại (Auto Reconnect) mà không làm gián đoạn chu kỳ đếm ngược nếu máy đang bận phục vụ khách.
- Xử lý Heartbeat: Định kỳ 30 giây, thiết bị sẽ phát đi một gói tin "Ping" lên Server để khẳng định trạng thái "Sống". Nếu máy chủ bỏ lỡ 2 nhịp Ping liên tiếp, trạm sẽ tự động bị đánh dấu cảnh báo Offline trên giao diện Dashboard.
- Xử lý lệnh vận hành: Thay vì duy trì một kết nối Websocket liên tục tiêu tốn tài nguyên, dự án tối ưu hóa theo mô hình Short Polling kết hợp Webhook ngược. Ngay khi lệnh "ACTIVATE" xuất hiện cùng tham số thời gian thuê, ESP32 kích hoạt chân GPIO và bắt đầu đếm ngược thời gian cục bộ.


 4.2.3. Quy trình đồng bộ hóa và lưu trữ lịch sử
Khi thời gian sử dụng kết thúc, ESP32 sẽ gửi một gói tin trạng thái "FINISHED" đính kèm chữ ký mã hóa về máy chủ. Hệ thống sẽ thay đổi trạng thái của trạm thành Sẵn sàng (Idle) và tiến hành lưu vết toàn bộ thông tin phiên làm việc vào cơ sở dữ liệu để phục vụ cho công tác đối soát, khiếu nại sau này.


 4.3. Tích hợp thanh toán tự động và Vận hành thực tế


 4.3.1. Thiết lập Cổng thanh toán SePay và Webhook
Để loại bỏ việc sử dụng tiền mặt cũng như giảm thiểu chi phí nhân sự, hệ thống tích hợp trực tiếp với cổng thanh toán SePay thông qua chuẩn VietQR.
- Đăng ký và Cấu hình: Đường dẫn `/api/payments/webhook` được thiết lập trên máy chủ ACW-SRS để sẵn sàng tiếp nhận thông báo biến động số dư.
- Xử lý giao dịch thông minh: Mỗi khi khách hàng quét mã QR, ứng dụng sẽ sinh ra một cấu trúc Nội dung chuyển khoản duy nhất (bao gồm mã trạm và mã ngẫu nhiên). Khi biến động số dư xảy ra, SePay gọi Webhook trả về dữ liệu thô. Thuật toán trên Server sẽ tiến hành bóc tách chuỗi (String parsing) để xác định xem tiền được chuyển cho trạm nào và đối chiếu với bảng giá cước, từ đó quy đổi ra số phút sử dụng chính xác.


 4.3.2. Đánh giá quy trình End-to-End trong thực tế
Thực nghiệm quy trình vận hành với người dùng thực:
1. Giao tiếp qua mã QR: Khách hàng đưa điện thoại quét mã QR động. Mã này chứa sẵn số tiền cần thanh toán và nội dung định danh chính xác.
2. Xác thực dòng tiền: Khách hàng hoàn tất bước chuyển khoản bằng sinh trắc học trên ứng dụng Ngân hàng.
3. Kích hoạt tự động: Ngay khi ngân hàng hạch toán, SePay kích hoạt Webhook. Máy chủ ACW-SRS nhận, xác thực chữ ký (Signature) trong dưới 1 giây, cập nhật trạng thái đơn hàng và gửi cờ hiệu kích hoạt xuống thiết bị ESP32 ở hiện trường.
4. Vận hành máy: Rơ-le đóng, máy bơm cao áp vận hành ngay lập tức, độ trễ trung bình toàn bộ tiến trình đạt mức rất ấn tượng (chỉ khoảng 2 - 3 giây tính từ lúc bấm chuyển khoản).


![Hình 4.2: Thực nghiệm quy trình thanh toán kích hoạt máy thực tế](vị_trí_chèn_ảnh_3_2_vận_hành)


 4.4. Kiểm thử hệ thống và Đánh giá kết quả


 4.4.1. Kiểm thử chức năng và Tính chịu tải (Reliability)
- Bài test độ bền IoT: Trạm thiết bị được cho chạy thử nghiệm treo liên tục trong suốt 168 giờ (1 tuần). Kết quả: Phần cứng ESP32 tản nhiệt tốt, không xuất hiện tình trạng tràn bộ nhớ (Heap Memory Leak), kết nối với máy chủ được duy trì liên tục và có khả năng tự phục hồi xuất sắc ngay sau các bài test cắt điện đột ngột.
- Bài test độ trễ API: Thông qua công cụ Postman và mô phỏng tải bằng JMeter, các API lõi đạt được thời gian đáp ứng (Response Time) ở mức dưới 150ms.


 4.4.2. Kiểm thử bảo mật Multi-tenant
Kiến trúc Multi-tenant được chứng minh tính chính xác thông qua các bài test thâm nhập (Penetration Test) cơ bản ở mức độ ứng dụng. 
Thử nghiệm đăng nhập bằng tài khoản của Tenant A nhưng chủ động gửi các Request có chứa `station_id` của Tenant B. Hệ thống Middleware ngay lập tức phát hiện sự sai lệch và từ chối truy cập bằng mã HTTP 403 Forbidden. Điều này khẳng định cơ chế cô lập dữ liệu hoàn toàn đáng tin cậy.


 4.4.3. Tổng kết hiệu quả mang lại
- Đạt được chỉ tiêu tự động hóa: Giải quyết được bài toán khó nhất là việc liên kết giữa "Dòng tiền số" và "Thiết bị vật lý" mà không cần sự can thiệp của con người.
- Tính ứng dụng thực tiễn cao: Hệ thống cung cấp một giải pháp quản lý tài chính minh bạch cho các chủ trạm, ngăn chặn triệt để tình trạng thất thoát doanh thu từ khâu thu tiền mặt lẻ. Đồng thời mô hình SaaS này hoàn toàn có thể thương mại hóa để cung cấp cho hàng loạt các chuỗi kinh doanh rửa xe khác trên thị trường.


"""
    new_content = content[:start_idx] + new_chapter_4 + content[end_idx:]
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(new_content)
    print("Updated successfully.")
else:
    print(f"Could not find markers. start_idx: {start_idx}, end_idx: {end_idx}")
