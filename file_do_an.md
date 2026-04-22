MỤC LỤC

     MỞ ĐẦU

1. Lý do chọn đề tài
2. Mục tiêu nghiên cứu
3. Đối tượng và phạm vi nghiên cứu
4. Phương pháp nghiên cứu
5. Ý nghĩa khoa học và thực tiễn
6. Cấu trúc báo cáo

---

     CHƯƠNG 1. KHẢO SÁT HỆ THỐNG

1.1. Lập kế hoạch khảo sát
1.1.1. Mục tiêu và phương pháp khảo sát
1.1.2. Xác định đối tượng khảo sát
1.2. Xem xét các giải pháp tương tự
1.2.1. Tổng quan các hệ thống quản lý trạm rửa xe hiện nay
1.2.2. Ưu và nhược điểm của các giải pháp hiện có
1.3. Đề xuất giải pháp và các tính năng phát triển cho ACW-SRS
1.4. Công cụ và môi trường phát triển dự án

---

---

     CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG ACW-SRS

2.1. Yêu cầu về hệ thống
2.1.1. Yêu cầu chức năng
2.1.2. Yêu cầu phi chức năng
2.2. Phân tích hệ thống (Sơ đồ Use Case)
2.3. Phân tích chi tiết từng chức năng (Bảng đặc tả Use Case)
2.3.1. Chức năng Đăng ký/Đăng nhập
2.3.2. Chức năng Quản lý trạm rửa xe
2.3.3. Chức năng Thuê máy và Thanh toán (IoT Activation)
2.3.4. Chức năng Xem báo cáo doanh thu

---

     CHƯƠNG 3 . TRIỂN KHAI VÀ ĐÁNH GIÁ KẾT QUẢ

3.1. Xây dựng phần mềm Web Dashboard
3.1.1. Cài đặt môi trường phát triển (Node.js, MySQL)
3.1.2. Triển khai API Routes và Middleware xác thực
3.1.3. Xây dựng giao diện quản trị cho Super Admin và Tenant

3.2. Lập trình thiết bị IoT (ESP32)
3.2.1. Xây dựng firmware kết nối Wi-Fi và thực hiện Heartbeat
3.2.2. Xử lý nhận lệnh (Fetch Command) và điều khiển Relay
3.2.3. Đồng bộ hóa trạng thái thiết bị với Server

3.3. Tích hợp thanh toán và vận hành thực tế
3.3.1. Cấu hình SePay Webhook để nhận data thanh toán
3.3.2. Kiểm thử quy trình từ lúc Quét mã -> Thanh toán -> Kích hoạt máy

3.4. Kiểm thử và Đánh giá
3.4.1. Kiểm thử chức năng và tính ổn định của kết nối IoT
3.4.2. Đánh giá khả năng quản lý đa người thuê (Multi-tenancy)
3.4.3. Phân tích kết quả đạt được so với mục tiêu đề ra

---

     KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

1. Kết luận những kết quả đạt được
2. Những hạn chế còn tồn tại
3. Hướng phát triển trong tương lai (Ví dụ: Tích hợp AI nhận diện biển số, App di động cho Tenant)

---

     TÀI LIỆU THAM KHẢO

---

     PHỤ LỤC
- Mã nguồn Firmware ESP32
- Sơ đồ mạch điện
- Hình ảnh triển khai thực tế

---

# PHẦN MỞ ĐẦU

## 1. Lý do chọn đề tài

Sự bùng nổ của Cách mạng Công nghiệp 4.0 đã thúc đẩy mạnh mẽ xu hướng tự động hóa và chuyển đổi số trong mọi lĩnh vực của đời sống kinh tế - xã hội. Trong đó, ngành dịch vụ hỗ trợ và vận hành phương tiện giao thông đang đứng trước những yêu cầu cấp thiết về việc nâng cao hiệu suất và tối ưu hóa nguồn lực. Việc ứng dụng các giải pháp công nghệ hiện đại không chỉ giúp chuẩn hóa quy trình phục vụ mà còn giúp các doanh nghiệp nâng cao năng lực cạnh tranh, đáp ứng nhu cầu ngày càng khắt khe của thị trường.

Trong quá trình khảo sát và từng có cơ hội hỗ trợ các đơn vị kinh doanh vận tải taxi, em nhận thấy nhu cầu vệ sinh phương tiện của nhóm đối tượng này đang tăng trưởng cực kỳ mạnh mẽ nhưng vẫn chưa được đáp ứng một cách hiệu quả. Với sự bùng nổ của các hãng taxi dịch vụ và taxi điện (điển hình là VinFast/GSM) trong những năm gần đây, số lượng đầu xe lưu thông trên thị trường đã tăng vọt. Ở một số đơn vị, trung bình một xe taxi có nhu cầu rửa xe khoảng 4 lần mỗi tháng để đảm bảo hình ảnh chuyên nghiệp khi phục vụ khách hàng. Các tài xế taxi có đặc thù cần sự nhanh chóng (chủ yếu là làm sạch vỏ xe) để sớm quay lại lộ trình kinh doanh. Tuy nhiên, các mô hình rửa xe truyền thống phụ thuộc nhiều vào nhân công thường gây ùn tắc và không đáp ứng được yêu cầu về thời gian. 

Xuất phát từ những thực tế trên, em quyết định chọn đề tài: **"Xây dựng hệ thống quản lý trạm rửa xe thông minh ACW-SRS (Auto Car Wash Smart Rental System)"**.

Dự án này mang lại giải pháp tối ưu thông qua việc kết hợp giữa công nghệ phần cứng IoT và nền tảng phần mềm SaaS hiện đại:
1. **Ứng dụng IoT (ESP32):** Cho phép kết nối các thiết bị vật lý với internet, thực hiện giám sát trạng thái trực tuyến (Heartbeat) và điều khiển bật/tắt thiết bị từ xa một cách chính xác.
2. **Nền tảng SaaS/Multi-tenant (Next.js):** Cung cấp khả năng quản lý đa người thuê, cho phép mỗi chủ trạm có một không gian làm việc riêng biệt để quản lý thiết bị và theo dõi doanh thu của chính mình.
3. **Thanh toán tự động qua mã QR:** Tích hợp các cổng thanh toán (SePay) giúp khách hàng dễ dàng tự phục vụ, hệ thống sẽ tự động kích hoạt máy ngay sau khi nhận được tiền, đảm bảo tính thuận tiện và minh bạch tuyệt đối.

Việc thực hiện đề tài này không chỉ giúp em củng cố kiến thức chuyên môn về lập trình web hiện đại, hệ thống nhúng IoT mà còn mang lại một sản phẩm có tính ứng dụng thực tiễn cao, đáp ứng nhu cầu cấp thiết của thị trường dịch vụ tự động hóa hiện nay.

## 2. Mục tiêu nghiên cứu
- Tìm hiểu và làm chủ công nghệ vi điều khiển ESP32 trong việc điều khiển thiết bị ngoại vi.
- Xây dựng hệ thống backend quản lý dữ liệu theo mô hình Multi-tenant trên nền tảng Next.js.
- Thiết kế giao diện Dashboard trực quan cho Admin và Tenant để theo dõi doanh thu và thiết bị.
- Triển khai thành công luồng thanh toán tự động qua QR Code để kích hoạt máy rửa xe.

## 3. Đối tượng và phạm vi nghiên cứu
- **Đối tượng nghiên cứu:** Hệ thống phần cứng điều khiển (ESP32, Relay), nền tảng quản lý SaaS (Next.js) và các giao thức kết nối IoT.
- **Phạm vi thực hiện:**
    - **Nhu cầu thực tế:** Giải quyết khó khăn trong việc quản lý doanh thu và giám sát trạng thái thiết bị tại các trạm rửa xe tự động từ xa, giúp chủ trạm tránh thất thoát và kiểm soát vận hành hiệu quả.
    - **Tiết kiệm thời gian:** Tự động hoá quy trình ghi chép và vận hành vốn trước đây phải thực hiện thủ công. Hệ thống giúp rút ngắn thời gian thanh toán và kích hoạt máy cho khách hàng.
    - **Hỗ trợ ra quyết định:** Thông qua các báo cáo thống kê doanh thu và biểu đồ trực quan, chủ trạm có thể đưa ra các quyết định điều chỉnh bảng giá hoặc mở rộng quy mô kinh doanh hợp lý.
    - **Quản lý đa người thuê (Multi-tenant):** Tập trung vào việc xây dựng nền tảng SaaS hỗ trợ nhiều chủ trạm (Tenant) cùng sử dụng trên một hệ thống nhưng dữ liệu hoàn toàn tách biệt và bảo mật.


## 4. Phương pháp nghiên cứu
- **Phương pháp nghiên cứu lý thuyết:** Nghiên cứu tài liệu về kiến trúc SaaS, giao thức HTTP cho IoT và các framework Next.js, Prisma.
- **Phương pháp điều tra và khảo sát:**
    - Phỏng vấn trực tiếp các chủ trạm rửa xe và tài xế (đặc biệt là tài xế taxi điện) để xác định nhu cầu thực tế về quản lý và thanh toán tự động.
    - Quan sát, phân tích quy trình vận hành tại các trạm rửa xe hiện nay để đánh giá và tổng hợp các yêu cầu chức năng cần thiết.
    - Khai thác ý kiến phản hồi từ người dùng thử nghiệm để xây dựng các tính năng phù hợp và tối ưu hóa trải nghiệm trên Dashboard.
- **Phương pháp thực nghiệm:** Lập trình firmware cho ESP32 và xây dựng website quản lý.
- **Kiểm thử và đánh giá:** Chạy thử nghiệm quy trình thực tế từ quét mã QR đến kích hoạt Relay để đánh giá độ trễ và tính ổn định của hệ thống.


## 5. Ý nghĩa khoa học và thực tiễn
- **Ý nghĩa khoa học:** Đề xuất một mô hình kết hợp hiệu quả giữa IoT và SaaS để giải quyết bài toán quản lý phân tán.
- **Ý nghĩa thực tiễn:** Tạo ra một công cụ quản lý hiệu quả cho các chủ kinh doanh rửa xe, giúp giảm thiểu rủi ro thất thoát doanh thu và nâng cao trải nghiệm khách hàng.

---
# CHƯƠNG 1. KHẢO SÁT HỆ THỐNG

## 1.1. Lập kế hoạch khảo sát

### 1.1.1. Mục tiêu và phương pháp khảo sát
**Mục tiêu:**
Mục tiêu chính của khảo sát là thu thập thông tin chi tiết và yêu cầu thực tế từ các chủ trạm rửa xe và các tài xế dịch vụ nhằm xây dựng hệ thống ACW-SRS tối ưu nhất. Việc khảo sát giúp nhóm phát triển hiểu rõ các rào cản trong việc quản trị doanh thu truyền thống, thói quen thanh toán của khách hàng, cũng như các tính năng mà người dùng thực sự cần để tăng tính tiện lợi và minh bạch.
Cụ thể, khảo sát nhằm mục tiêu:
- Hiểu rõ quy trình vận hành và kiểm soát thiết bị hiện tại tại các điểm rửa xe.
- Xác định những khó khăn phổ biến trong việc đối soát doanh thu và quản lý nhân sự.
- Thu thập yêu cầu về các tính năng tự động hóa (quy trình Web -> IoT).
- Đánh giá mức độ sẵn sàng của người dùng khi làm quen với mô hình rửa xe tự phục vụ (Self-service) qua thanh toán số.

**Phương pháp khảo sát:**
- **Phỏng vấn trực tiếp với chủ trạm:** Trao đổi sâu về các vấn đề quản lý, chi phí vận hành và rủi ro thất thoát doanh thu.
- **Phỏng vấn gián tiếp qua Google Forms:** Gửi bộ câu hỏi khảo sát cho các cộng đồng tài xế (taxi điện VinFast/GSM, Grab) để tìm hiểu nhu cầu về sự nhanh chóng và tự động hóa.
- **Nghiên cứu quan sát thực tế:** Trực tiếp quan sát quy trình tại các trạm rửa xe truyền thống để đánh giá thời gian chờ và sự bất tiện của việc thu tiền mặt.

### 1.1.2. Xác định đối tượng khảo sát
- **Nhóm đối tượng:** Chủ các cửa hàng/trạm rửa xe quy mô vừa và nhỏ cần tối ưu hóa nhân sự; các tài xế xe dịch vụ cần rửa xe nhanh với chi phí thấp.
- **Số lượng:** Thực hiện phỏng vấn trực tiếp với 10 chủ trạm và khảo sát qua Google Form với 22 tài xế dịch vụ.

**Danh sách các câu hỏi khi thu thập và làm rõ yêu cầu của ứng dụng**
*Câu hỏi về nhu cầu quản lý doanh thu và thiết bị:*
- Anh/chị hiện đang theo dõi doanh thu và lịch sử hoạt động của máy móc theo phương pháp nào?
- Anh/chị đã từng gặp trường hợp nhân viên thiếu trung thực trong việc báo cáo số lượng xe đã rửa chưa?
- Những khó khăn lớn nhất khi anh/chị quản lý trạm rửa xe từ xa là gì?

*Câu hỏi về chức năng điều khiển tự động:*
- Anh/chị có mong muốn máy rửa xe tự động kích hoạt ngay khi khách hàng thanh toán xong mà không cần nhân viên can thiệp không?
- Có cần tính năng ghi lại nhật ký hoạt động của từng thiết bị để dự báo lịch bảo trì không?

*Câu hỏi về thanh toán và trải nghiệm khách hàng:*
- Anh/chị (Tài xế) có thường xuyên mang theo tiền lẻ hoặc chờ đợi lâu để thanh toán khi rửa xe không?
- Anh/chị có sẵn sàng sử dụng ứng dụng ngân hàng quét mã QR để kích hoạt máy rửa xe ngay lập tức không?
- Khi sử dụng trạm tự phục vụ, anh/chị quan tâm đến tính năng nào nhất? (Ví dụ: xem lịch sử giao dịch, nhận hóa đơn điện tử, gợi ý trạm gần nhất...).

*Câu hỏi về quản lý đa người thuê (Multi-tenant):*
- Nếu sở hữu một chuỗi các trạm, anh/chị có nhu cầu quản lý tập trung và phân quyền cho quản lý từng điểm không?
- Các báo cáo thống kê theo ngày/tuần/tháng có cần được phân loại rõ ràng theo từng trạm không?

![Hình 1.1: Thống kê nhu cầu thanh toán tự động qua kết quả khảo sát](vị_trí_chèn_ảnh_1_1_thống_kê)

## 1.2. Nghiên cứu tính khả thi của mô hình tự phục vụ (Self-service) tại Việt Nam

### 1.2.1. Quan sát từ các mô hình tương tự (Máy giặt tự động, Máy bán hàng tự động)
Dù mô hình rửa xe tự phục vụ còn mới mẻ, nhưng các mô hình **Self-service** khác đã phát triển rất mạnh mẽ tại Việt Nam trong những năm gần đây:
- **Hệ thống giặt ủi tự động:** Người dùng tự bỏ đồ, thanh toán qua QR và máy tự chạy. Mô hình này đã chứng minh rằng người dùng sẵn sàng tự phục vụ để tiết kiệm chi phí và chủ động thời gian.
- **Máy bán hàng tự động:** Sự phổ biến của máy bán hàng tại các bệnh viện, trường học, trạm dừng chân cho thấy thói quen thanh toán số để nhận dịch vụ tức thì đã được hình thành.

### 1.2.2. Phân tích tâm lý khách hàng đối với dịch vụ mới
- **Nhu cầu về tốc độ:** Tài xế taxi đặc biệt quan tâm đến thời gian. Việc tự phục vụ giúp họ bỏ qua các bước chờ đợi nhân viên thu tiền hay nhân viên rảnh tay.
- **Giá trị kinh tế:** Mô hình tự phục vụ giúp giảm chi phí nhân công, từ đó giảm giá thành mỗi lần rửa xe, thu hút người dùng vốn có thói quen rửa xe thường xuyên.

### 1.2.3. Thách thức và cơ hội
- **Thách thức:** Cần có hệ thống hướng dẫn trực quan để khách hàng lần đầu sử dụng không gặp lúng túng; đảm bảo kết nối IoT ổn định để máy không gặp lỗi sau khi đã thanh toán.
- **Cơ hội:** Ứng dụng công nghệ SaaS giúp chủ trạm mở rộng hệ thống một cách không giới hạn với chi phí quản lý cực thấp.

## 1.3. Đề xuất giải pháp và các tính năng phát triển cho ACW-SRS
Dựa trên khảo sát thực tế, dự án đề xuất xây dựng hệ thống với các tính năng đột phá:
1. **Quản lý đa người thuê (Multi-tenant SaaS):** Mỗi chủ trạm có một Dashboard riêng biệt hoàn toàn.
2. **Kích hoạt thiết bị qua Cloud-IoT:** Tích hợp sâu giữa Web Server và ESP32 để kích hoạt relay trong thời gian thực (<2s).
3. **Thanh toán QR Động:** Tự động nhận diện giao dịch và kích hoạt máy không cần xác nhận thủ công.
4. **Nhận diện biển số (License Plate Recognition):** Tích hợp camera để lưu vết phương tiện, ngăn chặn gian lận và hỗ trợ quản lý đội xe doanh nghiệp.

## 1.4. Công cụ và môi trường phát triển dự án

**Công cụ phát triển:** Máy tính cấu hình cao, ESP32 DevKit, Relay Module, các thiết bị di động Android/iOS để thử nghiệm thanh toán.
**Các phần mềm công cụ:**
- **Visual Studio Code:** Môi trường lập trình chính.
- **Postman:** Công cụ kiểm thử các API endpoint giữa Client - Server - IoT.
- **StarUML:** Thiết kế các sơ đồ kiến trúc hệ thống chuyên nghiệp.
**Công nghệ sử dụng:**
- **Frontend/Backend:** Next.js (React Framework).
- **IoT Firmware:** Arduino Core / C++ cho ESP32.
- **Database:** MySQL & Prisma ORM.

### Giới thiệu chi tiết về công nghệ sử dụng

#### Next.js (React Framework)
Next.js là một framework mã nguồn mở xây dựng dựa trên React, giúp tối ưu hóa hiệu suất và SEO thông qua cơ chế Server-Side Rendering (SSR). Kiến trúc Next.js trong dự án này đóng vai trò là "Cầu não trung tâm":
1. **Server Components:** Xử lý logic nặng tại phía máy chủ, giúp trang Dashboard tải nhanh và bảo mật thông tin kết nối database.
2. **API Routes:** Cung cấp các điểm cuối RESTful dành riêng cho thiết bị ESP32 thực hiện trao đổi dữ liệu (Heartbeat, Fetch Command).
3. **Middleware:** Lớp bảo mật quan trọng nhất giúp tách biệt hoàn toàn dữ liệu giữa các người thuê (Tenant) khác nhau.

#### ESP32 & IoT Embedded System
ESP32 được chọn nhờ khả năng kết nối Wi-Fi mạnh mẽ và tính ổn định trong môi trường công nghiệp nhẹ.
1. **Cơ chế Non-blocking:** Firmware được thiết kế để liên tục lắng nghe trạng thái thanh toán từ Server mà không làm gián đoạn các tác vụ điều khiển Relay hay đồng hồ đếm ngược.
2. **Giao thức HTTP connection:** Đảm bảo dữ liệu được truyền tải tin cậy qua kết nối Wi-Fi sẵn có tại các trạm.
3. **Ưu điểm:** Khả năng mở rộng tốt, cộng đồng hỗ trợ lớn và giá thành linh kiện cực kỳ thấp so với các hệ thống PLC truyền thống.

#### Quy trình kết hợp giữa Next.js và IoT
- **Bước 1:** Khách hàng thanh toán qua Web Dashboard (Next.js).
- **Bước 2:** Server nhận được Webhook thanh toán thành công, ghi trạng thái "Pending" vào Database.
- **Bước 3:** ESP32 liên tục "Fetch" lệnh mới từ API Server. Khi thấy có lệnh "Activate", ESP32 sẽ điều khiển Relay bật máy và bắt đầu đếm ngược thời gian thuê.
- **Bước 4:** Kết thúc thời gian, ESP32 ngắt Relay và bảo cáo trạng thái hoàn thành về Server để cập nhật báo cáo doanh thu.


---

# CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG ACW-SRS

## 2.1. Yêu cầu về hệ thống

### 2.1.1. Yêu cầu chức năng của hệ thống
**Nhóm chức năng dành cho Chủ trạm (Tenant):**
- **Quản lý tài khoản:** Đăng ký, đăng nhập, cập nhật thông tin cửa hàng, đổi mật khẩu.
- **Quản lý trạm rửa xe:**
    - Thêm trạm mới (Gán ID cho bộ ESP32).
    - Cấu hình giá tiền thuê trạm theo phút.
    - Chỉnh sửa thông tin trạm hoặc tạm dừng hoạt động trạm.
- **Giám sát & Điều khiển IoT:**
    - Theo dõi trạng thái Online/Offline của thiết bị ESP32 theo thời gian thực.
    - Điều khiển bật/tắt cưỡng bức thiết bị từ Dashboard (trong trường hợp bảo trì).
    - Nhận cảnh báo khi thiết bị mất kết nối hoặc Relay gặp sự cố.
- **Quản lý doanh thu:**
    - Xem thống kê doanh thu theo ngày, tuần, tháng cho từng trạm.
    - Xuất báo cáo lịch sử giao dịch (thanh toán qua SePay).
    - Biểu đồ trực quan hóa dữ liệu tăng trưởng doanh thu.

**Nhóm chức năng dành cho Khách hàng (End-user):**
- **Thanh toán & Thuê máy:**
    - Quét mã QR Dynamic để thực hiện thanh toán tự động.
    - Hệ thống tự động kích hoạt máy rửa xe sau khi nhận được tiền.
- **Theo dõi tiến trình:** Xem thời gian đếm ngược còn lại của lượt thuê trực tiếp trên giao diện web.

### 2.1.2. Yêu cầu phi chức năng
- **Hiệu suất:**
    - Thời gian phản hồi từ lúc khách thanh toán đến khi máy kích hoạt (Relay đóng) phải dưới 2 giây.
    - Giao diện Dashboard quản lý phải hoạt động mượt mà, phản hồi chuyển trang dưới 1 giây.
- **Bảo mật:**
    - Dữ liệu giữa các Tenant phải được cô lập hoàn toàn (Multi-tenancy isolation).

## 2.2. Phân tích hệ thống (Sơ đồ Use Case)

![Hình 2.1: Sơ đồ Use Case tổng quát hệ thống ACW-SRS](vị_trí_chèn_ảnh_2_1_usecase_tổng_quát)

![Hình 2.2: Sơ đồ Use Case phân rã chức năng Quản lý trạm](vị_trí_chèn_ảnh_2_2_usecase_quản_lý_trạm)

![Hình 2.3: Sơ đồ Use Case phân rã chức năng Thuê máy & Thanh toán](vị_trí_chèn_ảnh_2_3_usecase_thuê_máy)

## 2.3. Phân tích chi tiết từng chức năng (Đặc tả Use Case)

### 2.3.1. Chức năng Đăng lý & Đăng nhập
- **Use case:** Đăng ký tài khoản Tenant.
- **Mục đích:** Cho phép chủ trạm tạo tài khoản mới.
- **Tác nhân:** Người dùng (Chủ trạm).
| Luồng sự kiện chính | Luồng sự kiện phụ |
| :--- | :--- |
| 1. Người dùng nhập thông tin đăng ký. | 1. Báo lỗi nếu trùng Email hoặc mật khẩu yếu. |
| 2. Hệ thống lưu tài khoản và TenantID. | |

### 2.3.2. Chức năng Thêm trạm rửa xe
- **Use case:** Thêm trạm mới.
- **Mục đích:** Khai báo thiết bị ESP32 vào Dashboard.
- **Tác nhân:** Chủ trạm.

### 2.3.3. Chức năng Thuê máy (Thanh toán & Kích hoạt IoT)
- **Use case:** Thuê máy tự phục vụ.
- **Mô tả:** Quy trình quét QR -> SePay xác nhận -> ESP32 bật Relay.
- **Tác nhân:** Khách hàng, Server, ESP32.

---

# CHƯƠNG 3. TRIỂN KHAI VÀ ĐÁNH GIÁ KẾT QUẢ

## 3.1. Xây dựng phần mềm Web Dashboard

### 3.1.1. Cài đặt môi trường phát triển (Node.js, MySQL)
Hệ thống được triển khai trên môi trường Node.js phiên bản LTS mới nhất. Quy trình cài đặt bao gồm:
- **Cơ sở dữ liệu:** Sử dụng MySQL 8.0 để lưu trữ dữ liệu người dùng, trạm và giao dịch. Dữ liệu được thiết kế theo mô hình quan hệ để đảm bảo tính toàn vẹn.
- **Next.js Framework:** Khởi tạo dự án Next.js 14 với App Router giúp tối ưu hóa hiệu năng và SEO.
- **Prisma ORM:** Công cụ ánh xạ dữ liệu giúp tương tác với cơ sở dữ liệu MySQL một cách an toàn và tường minh.

### 3.1.2. Triển khai API Routes và Middleware xác thực
- **Xác thực (Authentication):** Sử dụng thư viện NextAuth.js để quản lý phiên đăng nhập của các Tenant và Admin.
- **Multi-tenant Middleware:** Đây là thành phần cốt lõi giúp hệ thống nhận diện `tenant_id` từ Session để lọc dữ liệu trạm và doanh thu tương ứng, đảm bảo tính cô lập dữ liệu tuyệt đối giữa các chủ trạm.
- **API Endpoints:** Xây dựng các API `/api/iot/heartbeat` và `/api/iot/fetch-command` định dạng JSON để giao tiếp với thiết bị ESP32. Các API này được bảo mật bằng mã Secret Key giữa Cloud và Thiết bị.

### 3.1.3. Xây dựng giao diện quản trị cho Super Admin và Tenant
Sử dụng thư viện giao diện shadcn/ui kết hợp với Tailwind CSS để xây dựng Dashboard:
- **Tenant Dashboard:** Hiển thị danh sách các trạm rửa xe, trạng thái trực tuyến (Online/Offline) và các biểu đồ thống kê doanh thu thời gian thực bằng thư viện Recharts.
- **Quản lý trạm:** Giao diện cho phép chủ trạm thêm mới trạm, gán mã MAC của ESP32 và cài đặt giá thuê (vd: 2.000 vnđ/phút).

![Hình 3.1: Giao diện Dashboard quản lý doanh thu trạm](vị_trí_chèn_ảnh_3_1_dashboard)

## 3.2. Lập trình thiết bị IoT (ESP32)

### 3.2.1. Xây dựng firmware kết nối Wi-Fi và thực hiện Heartbeat
Firmware của ESP32 được phát triển bằng ngôn ngữ C++ (Framework Arduino). Các chức năng chính bao gồm:
- **Kết nối WiFi:** Sử dụng thư viện `WiFi.h` để kết nối với bộ phát tại trạm rửa xe.
- **Xử lý Heartbeat:** Thiết bị gửi tín hiệu "Heartbeat" về Server mỗi 30 giây để báo cáo trạng thái hoạt động. Nếu quá 2 chu kỳ không có tín hiệu, Server sẽ tự động đánh dấu trạm là Offline.

### 3.2.2. Xử lý nhận lệnh (Fetch Command) và điều khiển Relay
ESP32 thực hiện truy vấn (GET Request) liên tục tới API Server để kiểm tra có lệnh điều khiển mới hay không:
- **Nhận lệnh:** Khi Server xác nhận có lệnh "ACTIVATE" (sau khi khách trả tiền), thiết bị sẽ nhận được gói tin JSON chứa thông tin thời gian thuê.
- **Điều khiển Relay:** ESP32 kích hoạt chân GPIO liên kết với Mô-đun Relay để cấp điện cho hệ thống rửa xe.
- **Đếm ngược (Countdown Timer):** Thiết bị tự quản lý thời gian đếm ngược cục bộ để đảm bảo máy ngắt đúng lúc ngay cả khi kết nối Internet bị gián đoạn tạm thời.

### 3.2.3. Đồng bộ hóa trạng thái thiết bị với Server
Sau khi kết thúc phiên rửa xe, ESP32 gửi thông báo "FINISHED" kèm mã giao dịch về Server để cập nhật trạng thái trạm về Rảnh (Idle) và lưu vào lịch sử hoạt động.

## 3.3. Tích hợp thanh toán và vận hành thực tế

### 3.3.1. Cấu hình SePay Webhook để nhận data thanh toán
Hệ thống tích hợp cổng thanh toán SePay để tự động hóa quy trình đối soát ngân hàng:
- **Cấu hình Webhook:** Đăng ký URL `/api/payments/webhook` trên trang quản trị SePay.
- **Xác thực giao dịch:** Khi có biến động số dư, SePay gửi dữ liệu chứa nội dung chuyển khoản (có mã giao dịch định danh). Máy chủ ACW-SRS sẽ phân tích mã này để tìm đơn hàng tương ứng.

### 3.3.2. Kiểm thử quy trình từ lúc Quét mã -> Thanh toán -> Kích hoạt máy
Thực nghiệm quy trình vận hành thực tế:
1. **Quét mã:** Khách hàng quét mã QR dán tại trạm xe.
2. **Thanh toán:** Khách chuyển khoản đúng số tiền và nội dung hiển thị trên giao diện web.
3. **Xác thực:** Trong vòng <1.5s, Server nhận Webhook và cập nhật Database.
4. **Kích hoạt:** ESP32 nhận lệnh sau <0.5s và kích hoạt máy bơm nước.
- **Kết quả:** Tổng thời gian từ lúc khách bấm chuyển khoản đến khi máy chạy trung bình đạt khoảng 2-3 giây.

![Hình 3.2: Thực nghiệm quy trình thanh toán kích hoạt máy thực tế](vị_trí_chèn_ảnh_3_2_vận_hành)

## 3.4. Kiểm thử và Đánh giá

### 3.4.1. Kiểm thử chức năng và tính ổn định của kết nối IoT
Hệ thống đã trải qua các bài kiểm thử chịu tải và kết nối:
- Kiểm thử độ bền: Thiết bị ESP32 hoạt động liên tục trong 72 giờ không xảy ra hiện tượng treo hoặc mất kết nối.
- Kiểm thử ngắt kết nối: Khi giả lập mất WiFi, thiết bị có khả năng tự động kết nối lại ngay khi tín hiệu phục hồi.

### 3.4.2. Đánh giá khả năng quản lý đa người thuê (Multi-tenancy)
Thực hiện thử nghiệm với 02 tài khoản Tenant khác nhau:
- Dữ liệu hoàn toàn tách biệt: Tenant A không thể xem doanh thu hay điều khiển thiết bị của Tenant B.
- Hiệu năng hệ thống ổn định khi có nhiều trạm truy vấn API đồng thời.

### 3.4.3. Phân tích kết quả đạt được so với mục tiêu đề ra
- **Về mục tiêu kỹ thuật:** Xây dựng thành công giải pháp kết hợp Web SaaS và IoT với độ trễ thấp.
- **Về mục tiêu ứng dụng:** Giải quyết triệt để bài toán thất thoát tiền mặt và hỗ trợ quản trị từ xa cho các chủ trạm rửa xe.

---

# KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 1. Kết luận những kết quả đạt được
Dự án đã hoàn thành các mục tiêu đề ra, bao gồm việc xây dựng một hệ thống hoàn chỉnh từ phần cứng điều khiển đến phần mềm quản lý trên đám mây. ACW-SRS đã chứng minh được tính khả thi và hiệu quả trong việc số hóa mô hình rửa xe tự phục vụ.

## 2. Những hạn chế còn tồn tại
- Hệ thống hiện tại chỉ hỗ trợ kết nối qua Wi-Fi, có thể gặp khó khăn tại các khu vực sóng yếu hoặc không có mạng không dây.
- Giao diện người dùng trên web chưa thực sự tối ưu hoàn toàn cho các màn hình điện thoại cũ.

## 3. Hướng phát triển trong tương lai
- **Ứng dụng di động:** Phát triển ứng dụng Native cho Tenant để nhận thông báo đẩy (Push Notification) ngay khi có sự cố.
- **Tích hợp AI:** Sử dụng camera AI để nhận diện biển số xe tự động, tăng cường tính bảo mật và quản lý đội xe chuyên nghiệp hơn.
- **Mở rộng thanh toán:** Tích hợp thêm các ví điện tử như MoMo, ZaloPay và thẻ thành viên nạp tiền trước.




