ĐẠI HỌC THÁI NGUYÊN


TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
NGÔ GIA QUYẾN


XÂY DỰNG HỆ THỐNG QUẢN LÝ TRẠM RỬA XE TỰ PHỤC VỤ


ĐỒ ÁN TỐT NGHIỆP ĐẠI HỌC
NGÀNH KỸ THUẬT PHẦN MỀM
THÁI NGUYÊN, NĂM 2025




________________


ĐẠI HỌC THÁI NGUYÊN


TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
ĐỒ ÁN


TỐT NGHIỆP ĐẠI HỌC


NGÀNH KỸ THUẬT PHẦN MỀM
Đề tài:
XÂY DỰNG HỆ THỐNG QUẢN LÝ TRẠM RỬA XE TỰ PHỤC VỤ
Sinh viên thực hiện: NGÔ GIA QUYẾN
Lớp: KTPM K21A
Giáo viên hướng dẫn: QUÁCH XUÂN TRƯỞNG
THÁI NGUYÊN, NĂM 2025
________________
LỜI CẢM ƠN


Trân trọng,
Ngô Gia Quyến
________________


LỜI CAM ĐOAN


Trân trọng,
Ngô Gia Quyến
________________
MỤC LỤC
________________
DANH MỤC HÌNH ẢNH
________________
________________


DANH MỤC BẢNG
________________


LỜI MỞ ĐẦU  


1. Lý do chọn đề tài


Sự bùng nổ của Cách mạng Công nghiệp 4.0 đã thúc đẩy mạnh mẽ xu hướng tự động hóa và chuyển đổi số trong mọi lĩnh vực của đời sống kinh tế - xã hội. Trong đó, ngành dịch vụ hỗ trợ và vận hành phương tiện giao thông đang đứng trước những yêu cầu cấp thiết về việc nâng cao hiệu suất và tối ưu hóa nguồn lực. Việc ứng dụng các giải pháp công nghệ hiện đại không chỉ giúp chuẩn hóa quy trình phục vụ mà còn giúp các doanh nghiệp nâng cao năng lực cạnh tranh, đáp ứng nhu cầu ngày càng khắt khe của thị trường.


Trong quá trình khảo sát và từng có cơ hội hỗ trợ các đơn vị kinh doanh vận tải taxi, em nhận thấy nhu cầu vệ sinh phương tiện của nhóm đối tượng này đang tăng trưởng cực kỳ mạnh mẽ nhưng vẫn chưa được đáp ứng một cách hiệu quả. Với sự bùng nổ của các hãng taxi dịch vụ và taxi điện (điển hình là VinFast/GSM) trong những năm gần đây, số lượng đầu xe lưu thông trên thị trường đã tăng vọt. Ở một số đơn vị, trung bình một xe taxi có nhu cầu rửa xe khoảng 4 lần mỗi tháng để đảm bảo hình ảnh chuyên nghiệp khi phục vụ khách hàng. Các tài xế taxi có đặc thù cần sự nhanh chóng (chủ yếu là làm sạch vỏ xe) để sớm quay lại lộ trình kinh doanh. Tuy nhiên, các mô hình rửa xe truyền thống phụ thuộc nhiều vào nhân công thường gây ùn tắc và không đáp ứng được yêu cầu về thời gian. 


Xuất phát từ những thực tế trên, em quyết định chọn đề tài: "Xây dựng hệ thống quản lý trạm rửa xe thông minh ACW-SRS (Auto Car Wash Smart Rental System)".


Dự án này mang lại giải pháp tối ưu thông qua việc kết hợp giữa công nghệ phần cứng IoT và nền tảng phần mềm SaaS hiện đại:
1. Ứng dụng IoT (ESP32): Cho phép kết nối các thiết bị vật lý với internet, thực hiện giám sát trạng thái trực tuyến (Heartbeat) và điều khiển bật/tắt thiết bị từ xa một cách chính xác.
2. Nền tảng SaaS/Multi-tenant (Next.js): Cung cấp khả năng quản lý đa người thuê, cho phép mỗi chủ trạm có một không gian làm việc riêng biệt để quản lý thiết bị và theo dõi doanh thu của chính mình.
3. Thanh toán tự động qua mã QR: Tích hợp các cổng thanh toán (SePay) giúp khách hàng dễ dàng tự phục vụ, hệ thống sẽ tự động kích hoạt máy ngay sau khi nhận được tiền, đảm bảo tính thuận tiện và minh bạch tuyệt đối.


Việc thực hiện đề tài này không chỉ giúp em củng cố kiến thức chuyên môn về lập trình web hiện đại, hệ thống nhúng IoT mà còn mang lại một sản phẩm có tính ứng dụng thực tiễn cao, đáp ứng nhu cầu cấp thiết của thị trường dịch vụ tự động hóa hiện nay.
Thời gian làm sản phẩm còn ngắn nên vẫn còn một số thiếu sót và chưa hoàn chỉnh, Em rất mong được sự đón nhận của người dùng và giúp sản phẩm hoàn thiện hơn. 
________________


2. Mục tiêu nghiên cứu


Tìm hiểu và làm chủ công nghệ vi điều khiển ESP32 trong việc điều khiển thiết bị ngoại vi.
Xây dựng hệ thống backend quản lý dữ liệu theo mô hình Multi-tenant trên nền tảng Next.js.
Thiết kế giao diện Dashboard trực quan cho Admin và Tenant để theo dõi doanh thu và thiết bị.
Triển khai thành công luồng thanh toán tự động qua QR Code để kích hoạt máy rửa xe.


3. Đối tượng và phạm vi nghiên cứu
- Đối tượng nghiên cứu: Hệ thống phần cứng điều khiển (ESP32, Relay), nền tảng quản lý SaaS (Next.js) và các giao thức kết nối IoT.
- Phạm vi thực hiện:
    - Nhu cầu thực tế: Giải quyết khó khăn trong việc quản lý doanh thu và giám sát trạng thái thiết bị tại các trạm rửa xe tự động từ xa, giúp chủ trạm tránh thất thoát và kiểm soát vận hành hiệu quả.
    - Tiết kiệm thời gian: Tự động hoá quy trình ghi chép và vận hành vốn trước đây phải thực hiện thủ công. Hệ thống giúp rút ngắn thời gian thanh toán và kích hoạt máy cho khách hàng.
    - Hỗ trợ ra quyết định: Thông qua các báo cáo thống kê doanh thu và biểu đồ trực quan, chủ trạm có thể đưa ra các quyết định điều chỉnh bảng giá hoặc mở rộng quy mô kinh doanh hợp lý.
    - Quản lý đa người thuê (Multi-tenant): Tập trung vào việc xây dựng nền tảng SaaS hỗ trợ nhiều chủ trạm (Tenant) cùng sử dụng trên một hệ thống nhưng dữ liệu hoàn toàn tách biệt và bảo mật.
4. Phương pháp nghiên cứu
- Phương pháp nghiên cứu lý thuyết: Nghiên cứu tài liệu về kiến trúc SaaS, giao thức HTTP cho IoT và các framework Next.js, Prisma.
- Phương pháp điều tra và khảo sát:
    - Phỏng vấn trực tiếp các chủ trạm rửa xe và tài xế (đặc biệt là tài xế taxi điện) để xác định nhu cầu thực tế về quản lý và thanh toán tự động.
    - Quan sát, phân tích quy trình vận hành tại các trạm rửa xe hiện nay để đánh giá và tổng hợp các yêu cầu chức năng cần thiết.
    - Khai thác ý kiến phản hồi từ người dùng thử nghiệm để xây dựng các tính năng phù hợp và tối ưu hóa trải nghiệm trên Dashboard.
- Phương pháp thực nghiệm: Lập trình firmware cho ESP32 và xây dựng website quản lý.
- Kiểm thử và đánh giá: Chạy thử nghiệm quy trình thực tế từ quét mã QR đến kích hoạt Relay để đánh giá độ trễ và tính ổn định của hệ thống.
5. Ý nghĩa khoa học và thực tiễn
- Ý nghĩa khoa học: Đề xuất một mô hình kết hợp hiệu quả giữa IoT và SaaS để giải quyết bài toán quản lý phân tán.
- Ý nghĩa thực tiễn: Tạo ra một công cụ quản lý hiệu quả cho các chủ kinh doanh rửa xe, giúp giảm thiểu rủi ro thất thoát doanh thu và nâng cao trải nghiệm khách hàng.


________________


CHƯƠNG 1. CƠ SỞ LÝ THUYẾT
(Những công nghệ chính sử dụng trong đồ án)
1.1. Tổng quan về ngôn ngữ lập trình JavaScript và TypeScript
1.1.1. Lịch sử hình thành và vị thế của JavaScript
JavaScript là một ngôn ngữ lập trình kịch bản dựa trên đối tượng, được sử dụng rộng rãi trong phát triển Web. Ban đầu được tạo ra bởi Brendan Eich tại Netscape vào năm 1995 chỉ trong vòng 10 ngày với mục đích ban đầu là tạo ra các hiệu ứng nhỏ trên trình duyệt. Tuy nhiên, qua hơn hai thập kỷ phát triển, JavaScript đã tiến hóa từ một ngôn ngữ kịch bản đơn giản thành một nền tảng lập trình toàn diện. Hiện nay, nó được quản lý và tiêu chuẩn hóa bởi tổ chức ECMA International thông qua các phiên bản ECMAScript (ES). JavaScript đã trở thành ngôn ngữ phổ biến hàng đầu, đóng vai trò nền tảng trong phát triển ứng dụng hiện đại nhờ khả năng chạy trên cả trình duyệt (Client-side) và máy chủ (Server-side).
- Đặc tính ngôn ngữ cốt lõi: 
*   - JavaScript là ngôn ngữ thông dịch (interpreted) với tốc độ thực thi cao.
*   - Hỗ trợ đa mô hình lập trình như hướng đối tượng (OOP) và lập trình hàm.
*   - Khả năng xử lý bất đồng bộ mạnh mẽ qua cơ chế Promise và Async/Await. 
- Cơ chế Event Loop và Non-blocking I/O: 
*   - Đây là trung tâm điều khiển giúp JavaScript xử lý đơn luồng cực kỳ hiệu quả.
*   - Cho phép hệ thống xử lý hàng nghìn yêu cầu cùng lúc mà không gây tắc nghẽn.
*   - Tối ưu hóa tài nguyên phần cứng bằng cách đẩy tác vụ nặng vào hàng đợi.
- Node.js và cuộc cách mạng Backend: 
*   - Cho phép JavaScript thực thi trực tiếp trên hệ điều hành bên ngoài trình duyệt.
*   - Cung cấp thư viện chuẩn phong phú để thao tác với file, mạng và cơ sở dữ liệu.
*   - Giúp lập trình viên sử dụng một ngôn ngữ duy nhất cho toàn bộ hệ thống (Full-stack).
1.1.2. Kiến trúc Event Loop và cơ chế bất đồng bộ chuyên sâu
Trái tim của Node.js chính là cơ chế Event Loop, được hỗ trợ bởi thư viện libuv (viết bằng C++). Khác với các ngôn ngữ truyền thống như Java hay PHP sử dụng mô hình đa luồng (Multi-threaded) – nơi mỗi kết nối mới sẽ chiếm dụng một luồng riêng – Node.js vận hành theo mô hình đơn luồng (Single-threaded) nhưng lại có khả năng xử lý bất đồng bộ cực kỳ mạnh mẽ nhờ cơ chế Non-blocking I/O.
Quy trình hoạt động của Event Loop bao gồm 6 pha chính tuần hoàn liên tục:
- Timers: Pha này xử lý các hàm gọi ngược (callbacks) từ `setTimeout()` và `setInterval()`. Node.js sẽ kiểm tra xem thời gian chờ đã hết chưa để đưa callback vào hàng đợi thực thi.
- Pending Callbacks: Thực thi các callback của các tác vụ hệ thống bị trì hoãn, ví dụ như các loại lỗi mạng TCP cụ thể.
- Idle, Prepare: Đây là các pha sử dụng nội bộ của Node.js nhằm chuẩn bị các tài nguyên hệ thống cần thiết cho các bước tiếp theo.
- Poll: Đây được coi là pha quan trọng nhất. Node.js sẽ đợi các kết nối I/O mới (như HTTP request từ người dùng hoặc dữ liệu từ thiết bị IoT). Nếu hàng đợi poll trống, nó sẽ tính toán thời gian chờ và chuyển sang pha tiếp theo hoặc tiếp tục đợi.
- Check: Thực thi các callback từ `setImmediate()`. Đây là hàm đặc biệt giúp lập trình viên thực hiện các tác vụ ngay sau khi pha Poll kết thúc.
- Close Callbacks: Xử lý các sự kiện đóng như `socket.destroy()`, giúp giải phóng tài nguyên bộ nhớ cho hệ thống.
  

Một điểm đặc biệt làm nên sức mạnh của Node.js chính là sự tồn tại của Microtask Queue (bao gồm `process.nextTick()` và các `Promise`). Các tác vụ trong hàng đợi này luôn có ưu tiên cao nhất và sẽ được thực thi ngay lập tức sau mỗi pha của Event Loop trước khi chuyển sang pha kế tiếp. Đối với hệ thống ACW-SRS, việc nắm vững cơ chế này giúp tối ưu hóa tốc độ phản hồi khi nhận tín hiệu từ trạm rửa xe, đảm bảo không có độ trễ trong việc xác nhận thanh toán và kích hoạt thiết bị. Ngoài ra, đối với các tác vụ nặng (như mã hóa dữ liệu hoặc thao tác file lớn), libuv sẽ sử dụng một Thread Pool riêng biệt để xử lý ngầm, đảm bảo luồng chính (Main Thread) luôn luôn sẵn sàng tiếp nhận yêu cầu mới.
1.1.2. Sự ra đời của ngôn ngữ TypeScript (TS)
TypeScript là một dự án mã nguồn mở được phát triển và duy trì bởi Microsoft, ra mắt lần đầu vào năm 2012. Về bản chất, nó được định nghĩa là một "superset" của JavaScript, cung cấp hệ thống định kiểu tĩnh (Static Typing) mà JavaScript thuần túy còn thiếu. TypeScript không thay thế JavaScript mà cung cấp thêm một lớp bảo vệ vững chắc, giúp quản lý mã nguồn hiệu quả hơn trong các dự án phần mềm có quy mô lớn và độ phức tạp cao.
  

- Giải quyết bài toán quy mô dự án: 
  - TypeScript giúp phát hiện lỗi ngay trong giai đoạn biên dịch thay vì lúc vận hành.
  - Giảm thiểu rủi ro khi làm việc nhóm và bảo trì mã nguồn trong thời gian dài.
- Cơ chế Transpile và tính tương thích: 
  - Mã TypeScript sẽ được biên dịch về JavaScript thuần để chạy trên trình duyệt.
  - Hỗ trợ các tính năng mới nhất của ECMAScript mà vẫn đảm bảo tính tương thích.
1.1.3. Các đặc tính kỹ thuật nổi bật của TypeScript
TypeScript cung cấp một hệ thống các tính năng mạnh mẽ giúp nâng cao chất lượng mã nguồn và hỗ trợ quy trình phát triển phần mềm một cách chuyên nghiệp. Các đặc tính này bao gồm:
- Hệ thống kiểu tĩnh (Static Typing): Cho phép định nghĩa rõ ràng kiểu dữ liệu cho biến, tham số hàm và giá trị trả về. Các kiểu dữ liệu cơ bản bao gồm: string, number, boolean, array, enum, tuple, và any. Việc xác định kiểu giúp trình biên dịch phát hiện lỗi ngay từ giai đoạn phát triển.
- Interfaces và Type Aliases: Giúp định nghĩa cấu trúc của các đối tượng phức tạp, tạo ra một bản thiết kế (blueprint) cho các thành phần trong hệ thống, giúp mã nguồn trở nên minh bạch và dễ hiểu.
- Tính năng hướng đối tượng (OOP): TypeScript hỗ trợ đầy đủ các khái niệm của lập trình hướng đối tượng như Class, Inheritance, Interface, và Encapsulation (Access Modifiers: public, private, protected).
- Generic: Cho phép tạo ra các thành phần có khả năng tái sử dụng cao với nhiều kiểu dữ liệu khác nhau mà vẫn đảm bảo tính an toàn về kiểu.
- Hỗ trợ công cụ (Tooling): Cung cấp khả năng tự động hoàn thành mã (IntelliSense), kiểm tra lỗi thời gian thực và hỗ trợ tái cấu trúc mã nguồn (Refactoring) một cách an toàn trên quy mô toàn dự án.
1.1.3. So sánh JavaScript và TypeScript trong phát triển dự án lớn
Mặc dù JavaScript có tính linh hoạt cao và dễ tiếp cận, tuy nhiên khi hệ thống phát triển với quy mô lớn, việc thiếu cơ chế kiểm tra kiểu dữ liệu chặt chẽ dễ dẫn đến nhiều lỗi khó phát hiện. TypeScript ra đời nhằm giải quyết hạn chế này bằng cách bổ sung hệ thống kiểu tĩnh và khả năng kiểm tra lỗi ngay trong quá trình phát triển.
Khả năng kiểm tra lỗi sớm:
JavaScript thường chỉ phát hiện lỗi khi chương trình đang chạy.
TypeScript giúp phát hiện lỗi ngay trong quá trình biên dịch.
Khả năng hỗ trợ IDE mạnh mẽ:
Gợi ý thuộc tính, phương thức và kiểm tra lỗi trực tiếp.
Tăng tốc độ phát triển và giảm sai sót khi làm việc nhóm.
Khả năng mở rộng hệ thống:
TypeScript phù hợp với các dự án lớn cần bảo trì lâu dài.
Giúp chuẩn hóa cấu trúc mã nguồn trong toàn bộ dự án.
1.2. Thư viện ReactJS và Thuật toán Virtual DOM chuyên sâu
1.2.1. Giới thiệu về thư viện ReactJS
ReactJS là một thư viện JavaScript mã nguồn mở được tạo ra bởi Jordan Walke tại Facebook vào năm 2013. Trước khi React ra đời, việc quản lý giao diện web dựa trên việc thay đổi trực tiếp cây DOM là một thách thức lớn về hiệu năng. React ra đời với triết lý hoàn toàn mới, tập trung vào lớp hiển thị (View) và mô hình thành phần (Component-based). Nó giúp xây dựng các ứng dụng web phức tạp với dữ liệu thay đổi liên tục một cách hiệu quả, minh bạch và dễ bảo trì hơn rất nhiều.
- Triết lý Declarative (Lập trình khai báo): 
*   - Lập trình viên chỉ cần mô tả trạng thái mong muốn của giao diện người dùng.
*   - React sẽ tự động quản lý việc cập nhật và render lại các thành phần tương ứng.
- Cú pháp JSX (JavaScript XML): 
*   - Kết hợp sức mạnh của JavaScript với sự trực quan của cấu trúc HTML.
*   - Giúp mã nguồn giao diện trở nên mạch lạc, dễ đọc và dễ gỡ lỗi hơn.
- Luồng dữ liệu một chiều (Unidirectional Data Flow): 
*   - Dữ liệu luôn được truyền từ cha xuống con thông qua các thuộc tính (Props).
*   - Giúp kiểm soát luồng dữ liệu minh bạch và hạn chế các lỗi logic phát sinh.
1.2.2. Kiến trúc dựa trên thành phần (Component-Based)
Kiến trúc của ReactJS xoay quanh khái niệm Component, đóng vai trò như các khối xây dựng cơ bản của ứng dụng:
- Tính đóng gói (Encapsulation): Mỗi Component tự quản lý trạng thái và logic riêng, giúp mã nguồn trở nên sạch sẽ và dễ quản lý.
- Tính tái sử dụng (Reusability): Các thành phần giao diện phổ biến có thể được đóng gói và sử dụng lại ở nhiều vị trí khác nhau trong ứng dụng, giúp giảm thiểu trùng lặp mã nguồn.
- Cấu trúc phân cấp (Hierarchy): Các Component trong React không tồn tại độc lập mà được tổ chức theo một sơ đồ hình cây (Component Tree). Trong cấu trúc này, các Component "Cha" (Parent) đóng vai trò bao bọc và điều phối, truyền dữ liệu xuống các Component "Con" (Child) thông qua cơ chế Props. Sự phân cấp rõ ràng này tạo ra một luồng dữ liệu một chiều (One-way data flow), giúp việc theo dõi và kiểm soát trạng thái của ứng dụng trở nên minh bạch. Đối với các ứng dụng phức tạp như ACW-SRS, việc phân cấp giúp chia nhỏ giao diện thành các lớp logic: từ các thành phần nguyên tử (Atom) như Button, Input đến các khối chức năng (Organism) như Form thanh toán hay Dashboard quản lý, từ đó tối ưu hóa quá trình bảo trì và mở rộng hệ thống.
  

1.2.2. Cơ chế Virtual DOM và Thuật toán Reconciliation
- Vấn đề của Real DOM: Việc thao tác trực tiếp trên cây DOM thật là vô cùng chậm.
- Giải pháp Virtual DOM: React tạo ra một bản sao nhẹ của cây DOM trong bộ nhớ. 
- Thuật toán Diffing: So sánh hai phiên bản Virtual DOM để tìm ra sự khác biệt.
- Reconciliation: Chỉ cập nhật duy nhất những phần thực sự thay đổi lên trình duyệt.
  

1.2.3. Mô hình Component trong ReactJS
Component là đơn vị cốt lõi trong ReactJS, cho phép chia giao diện người dùng thành nhiều phần nhỏ, độc lập và có thể tái sử dụng. Mỗi component đại diện cho một phần giao diện riêng biệt như thanh điều hướng, form đăng nhập, danh sách sản phẩm hoặc nút bấm.
Việc xây dựng ứng dụng theo mô hình component giúp mã nguồn trở nên rõ ràng, dễ quản lý và thuận tiện cho việc bảo trì hoặc mở rộng hệ thống sau này.
Tính tái sử dụng (Reusability):
* Một component có thể được sử dụng nhiều lần ở nhiều vị trí khác nhau.
* Giúp giảm thiểu việc lặp lại mã nguồn và tăng tốc độ phát triển.
Tính độc lập (Isolation):
* Mỗi component có logic và giao diện riêng biệt.
* Khi cần chỉnh sửa một chức năng, lập trình viên chỉ cần tác động đến component liên quan mà không ảnh hưởng toàn hệ thống.
Khả năng quản lý trạng thái (State Management):
* Component có thể tự quản lý dữ liệu nội bộ thông qua State.
* Điều này giúp giao diện phản hồi linh hoạt với các hành động của người dùng.
Phân loại Component:
* Functional Component: Là dạng component hiện đại, được xây dựng bằng JavaScript function và được sử dụng phổ biến trong React hiện nay.
* Class Component: Là dạng component truyền thống sử dụng ES6 class, hiện nay ít được sử dụng hơn do Functional Component kết hợp với Hooks mang lại sự đơn giản và hiệu quả cao hơn.
1.2.3. Quản lý luồng dữ liệu (Props và State)
- Props (Properties): Là các thuộc tính được truyền từ Component cha xuống Component con. Props là dữ liệu chỉ đọc (Immutable), giúp đảm bảo tính minh bạch của luồng dữ liệu trong hệ thống.
- State: Là đối tượng lưu trữ dữ liệu nội bộ của Component, có khả năng thay đổi theo thời gian dựa trên các hành động của người dùng hoặc phản hồi từ hệ thống. Khi State thay đổi, React sẽ tự động kích hoạt quá trình cập nhật giao diện (Re-render).
- Unidirectional Data Flow: Dữ liệu luôn chảy theo một chiều duy nhất từ trên xuống dưới, giúp việc theo dõi sự thay đổi dữ liệu trở nên đơn giản và hiệu quả hơn.
1.2.4. React Hooks và vai trò trong phát triển ứng dụng
React Hooks được giới thiệu từ phiên bản React 16.8 nhằm cho phép Functional Component sử dụng các tính năng mạnh mẽ trước đây chỉ có ở Class Component như quản lý trạng thái, xử lý vòng đời và tương tác với dữ liệu bên ngoài.
Hooks giúp mã nguồn ngắn gọn hơn, dễ đọc hơn và giảm đáng kể độ phức tạp trong quá trình phát triển ứng dụng.
Một số Hooks phổ biến gồm:
useState:
* Dùng để quản lý trạng thái (State) bên trong Functional Component.
* Khi giá trị state thay đổi, React sẽ tự động render lại giao diện tương ứng.
Ví dụ: quản lý trạng thái mở/đóng của menu, dữ liệu nhập trong form hoặc danh sách sản phẩm.
useEffect:
* Dùng để xử lý các tác vụ phụ (Side Effects) như gọi API, xử lý sự kiện, đồng bộ dữ liệu hoặc thao tác với Local Storage.
* Hook này thường được sử dụng thay thế cho các phương thức vòng đời như `componentDidMount`, `componentDidUpdate` và `componentWillUnmount`.
useContext:
* Giúp chia sẻ dữ liệu giữa nhiều component mà không cần truyền Props qua nhiều cấp trung gian.
* Thường dùng cho các dữ liệu dùng chung như thông tin người dùng, giao diện sáng/tối hoặc ngôn ngữ hệ thống.
useRef:
* Cho phép tham chiếu trực tiếp đến phần tử DOM hoặc lưu trữ giá trị mà không làm component render lại.
* Thường dùng để focus input, thao tác animation hoặc lưu dữ liệu tạm thời.
useMemo và useCallback:
* Hỗ trợ tối ưu hiệu năng bằng cách ghi nhớ giá trị tính toán hoặc hàm xử lý, tránh việc tạo lại không cần thiết trong mỗi lần render.
* Việc sử dụng Hooks giúp React hiện đại trở nên linh hoạt hơn, đồng thời phù hợp với các dự án quy mô lớn yêu cầu khả năng mở rộng và bảo trì lâu dài. Đây cũng là phương pháp được ưu tiên trong hầu hết các dự án ReactJS hiện nay.
1.3. Framework Next.js và Các phương thức Rendering tiên tiến
1.3.1. Giới thiệu về Framework Next.js
Next.js là một framework mạnh mẽ dựa trên React, cung cấp các tính năng cần thiết để xây dựng các ứng dụng web sẵn sàng cho sản xuất (Production-ready). Các tính năng cốt lõi bao gồm:
- Hệ thống Routing (File-based Routing): Tự động tạo ra các đường dẫn dựa trên cấu trúc thư mục và tệp tin, giúp quản lý cấu trúc trang web một cách minh bạch và dễ dàng mở rộng.
- Tối ưu hóa tài nguyên (Optimization): Hỗ trợ tự động tối ưu hóa hình ảnh (Image), phông chữ (Fonts) và các đoạn mã script bên thứ ba để đảm bảo tốc độ tải trang nhanh nhất và tối ưu hóa trải nghiệm người dùng.
- Hỗ trợ TypeScript: Tích hợp sẵn TypeScript với các cấu hình tối ưu, giúp phát triển mã nguồn an toàn và hiệu quả thông qua hệ thống kiểu tĩnh.
1.3.2. Server-Side Rendering (SSR) và Lợi ích SEO
- Server-Side Rendering (SSR): 
  - Render trang web trực tiếp trên server trước khi gửi file HTML về trình duyệt.
  - Giúp các robot tìm kiếm đọc nội dung dễ dàng và tăng tốc độ hiển thị.
  

(Mô tả: Sơ đồ phân biệt quy trình render tại Client và Server giúp tối ưu SEO)
- Static Site Generation (SSG) & ISR: 
  - Tạo sẵn các file HTML tĩnh ngay từ giai đoạn biên dịch hệ thống (Build).
  - Tự động làm mới nội dung (ISR) sau một khoảng thời gian nhất định (ví dụ 60 giây).
- Incremental Static Regeneration (ISR): Cho phép cập nhật nội dung các trang tĩnh sau khi đã biên dịch mà không cần phải xây dựng lại toàn bộ ứng dụng.
- Client-Side Rendering (CSR): Thực hiện hiển thị dữ liệu trực tiếp trên trình duyệt người dùng, phù hợp cho các ứng dụng yêu cầu tính tương tác cao và cá nhân hóa dữ liệu.
1.3.3. API Routes trong Next.js và kiến trúc Fullstack
Ngoài khả năng xây dựng giao diện người dùng, Next.js còn hỗ trợ xây dựng API Backend trực tiếp thông qua API Routes. Điều này giúp hệ thống có thể triển khai theo mô hình Fullstack chỉ với một framework duy nhất.
Tích hợp Backend trực tiếp:
Tạo các API xử lý đăng nhập, thanh toán, quản lý dữ liệu ngay trong dự án.
Giảm sự phức tạp khi phải tách riêng Frontend và Backend.
Bảo mật tốt hơn:
Các khóa bí mật như API Key, Secret Token được xử lý phía server.
Tránh lộ thông tin nhạy cảm ra phía trình duyệt.
Dễ triển khai hệ thống:
Toàn bộ dự án có thể deploy trên cùng một nền tảng như Vercel hoặc VPS riêng.
1.3.4. Sự kết hợp giữa Node.js và Next.js trong kiến trúc Full-stack
Next.js không hoạt động như một thực thể độc lập mà dựa hoàn toàn trên môi trường thực thi của Node.js để vận hành các logic phía máy chủ. Sự kết hợp này mang lại những khả năng vượt trội cho ứng dụng web hiện đại:
- Runtime Engine: Node.js đóng vai trò là "động cơ" cho phép Next.js thực hiện Server-Side Rendering (SSR). Khi người dùng truy cập, Node.js sẽ chạy mã React trên server để tạo ra file HTML hoàn chỉnh trước khi gửi về trình duyệt. Quá trình này được tiếp nối bởi Hydration – nơi React trên client sẽ "đắp" các sự kiện JavaScript vào HTML tĩnh để trang web trở nên tương tác.
- API Handling và Middleware: Các API Route trong Next.js thực chất là các hàm xử lý của Node.js. Lập trình viên có thể sử dụng các thư viện Node.js thuần túy để thao tác với hệ thống file, mã hóa mật khẩu hoặc kết nối trực tiếp đến các cơ sở dữ liệu như MySQL thông qua Prisma ORM. Middleware trong Next.js cho phép can thiệp vào quá trình request/response ở mức thấp, giúp kiểm tra quyền truy cập (Authorization) một cách nhanh chóng ngay tại lớp server.
- Bảo mật và Hiệu suất: Nhờ chạy trên Node.js, Next.js có thể quản lý các biến môi trường (Environment Variables) một cách an toàn. Các khóa bí mật (Secret Keys) của SePay hay thông tin đăng nhập Database sẽ chỉ tồn tại ở phía server, không bao giờ lộ diện ra phía client. Ngoài ra, cơ chế Streaming của Node.js giúp Next.js có thể truyền dữ liệu HTML theo từng phần (chunks), giúp người dùng thấy được nội dung trang web nhanh hơn đáng kể so với việc đợi toàn bộ trang được render xong.
- Ecosystem: Sự tương thích hoàn hảo giúp dự án dễ dàng tận dụng hàng triệu gói thư viện từ npm, từ việc xử lý ngày tháng (date-fns) đến việc xây dựng các logic nghiệp vụ phức tạp.
1.4. Công nghệ IoT và Vi điều khiển ESP32
1.4.1. Giới thiệu về dòng chip ESP32
ESP32 là một hệ thống trên chip (SoC) hiệu năng cao được phát triển bởi Espressif Systems. Nó tích hợp sẵn Wi-Fi và Bluetooth công suất thấp, phù hợp hoàn hảo cho các ứng dụng Internet of Things (IoT). Đối với các dự án kết hợp giữa phần mềm và phần cứng, ESP32 cung cấp một nền tảng thực thi mạnh mẽ với khả năng tính toán vượt trội và kết nối mạng linh hoạt.
  

Sơ đồ chi tiết các chân chức năng GPIO trên bo mạch ESP32 chuẩn)
Một số ứng dụng thực tế phổ biến của ESP32:
- Nhà thông minh (Smart Home): Điều khiển hệ thống chiếu sáng, điều hòa, rèm cửa tự động và các thiết bị gia dụng thông qua Wi-Fi hoặc Bluetooth.
- Nông nghiệp thông minh (Smart Agriculture): Giám sát độ ẩm đất, nhiệt độ, ánh sáng và tự động hóa hệ thống tưới tiêu, giúp tối ưu hóa năng suất cây trồng.
- Công nghiệp tự động hóa (Industrial Automation): Thu thập dữ liệu từ các cảm biến công nghiệp, giám sát trạng thái máy móc và điều khiển các cánh tay robot hoặc băng chuyền.
- Hệ thống an ninh: Tích hợp với camera (như ESP32-CAM), cảm biến chuyển động và hệ thống báo động để bảo vệ nhà ở và văn phòng.
- Thiết bị đeo (Wearables): Nhờ kích thước nhỏ gọn và tiêu thụ năng lượng thấp, ESP32 được dùng trong các thiết bị theo dõi sức khỏe, đồng hồ thông minh cơ bản.
- Vai trò trong hệ thống ACW-SRS: 
  - Đóng vai trò là thiết bị thực thi (Actuator) tại các trạm rửa xe vật lý.
  - Tiếp nhận lệnh điều khiển từ Server Next.js thông qua giao thức HTTP/HTTPS.
  - Điều khiển các module Relay và liên tục gửi báo cáo trạng thái về trung tâm
1.4.2. Giao thức truyền thông giữa Server và ESP32
Trong hệ thống IoT, việc giao tiếp giữa máy chủ và thiết bị phần cứng là yếu tố quan trọng quyết định độ ổn định và tốc độ phản hồi của toàn hệ thống.
Dự án sử dụng giao thức HTTP/HTTPS để truyền dữ liệu giữa Next.js Server và ESP32 do tính đơn giản, dễ triển khai và khả năng tương thích cao.
HTTP Request:
Server gửi lệnh điều khiển đến ESP32 để kích hoạt relay hoặc thay đổi trạng thái thiết bị.
Response và trạng thái:
ESP32 phản hồi kết quả thực thi giúp hệ thống giám sát chính xác.
Tính ổn định và bảo mật:
HTTPS giúp mã hóa dữ liệu truyền tải, tránh nguy cơ bị giả mạo lệnh điều khiển.
1.5. Thiết kế và Quản trị Cơ sở dữ liệu (MySQL & Prisma ORM)
1.5.1. Hệ quản trị CSDL quan hệ MySQL và Tiêu chuẩn ACID
MySQL là hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) mã nguồn mở phổ biến nhất thế giới. Nó sử dụng ngôn ngữ SQL chuẩn để quản lý dữ liệu thông qua mô hình các bảng có mối liên hệ chặt chẽ. Lý do quan trọng nhất khi chọn MySQL cho các hệ thống quản lý tài chính là việc tuân thủ nghiêm ngặt các tính chất ACID, đảm bảo mọi giao dịch được thực hiện một cách an toàn và chính xác tuyệt đối.
- Mô hình quan hệ (Relational Model): Dữ liệu được tổ chức thành các bảng với các hàng và cột. Các bảng liên kết với nhau thông qua các khóa (Primary Key và Foreign Key), đảm bảo tính logic và nhất quán.
- Ngôn ngữ SQL tiêu chuẩn: Sử dụng ngôn ngữ truy vấn có cấu trúc (SQL) để thực hiện các thao tác: SELECT (truy vấn), INSERT (thêm mới), UPDATE (cập nhật) và DELETE (xóa dữ liệu).
- Tính bảo mật và ổn định: Cung cấp các cơ chế quản lý quyền truy cập nghiêm ngặt và hỗ trợ các giao dịch (Transactions) để đảm bảo an toàn dữ liệu trong mọi tình huống.
1.5.2. Prisma ORM và lợi ích trong phát triển hệ thống
Prisma là một bộ công cụ cơ sở dữ liệu hiện đại, đóng vai trò là lớp trung gian giúp lập trình viên thao tác với dữ liệu một cách hiệu quả hơn:
- Tự động tạo mã (Auto-generated Client): Dựa trên sơ đồ dữ liệu (Schema), Prisma tự động tạo ra thư viện truy vấn mạnh mẽ, hỗ trợ đầy đủ TypeScript.
- Truy vấn an toàn (Type-safe Queries): Loại bỏ các lỗi cú pháp SQL và đảm bảo dữ liệu truy vấn luôn đúng kiểu, giúp giảm thiểu lỗi thời gian chạy (Runtime errors).
- Quản lý Schema (Prisma Schema): Toàn bộ cấu trúc cơ sở dữ liệu được định nghĩa tập trung trong một tệp tin duy nhất, giúp việc quản lý và thay đổi trở nên dễ dàng.
- Tính năng Migration: Hỗ trợ đồng bộ hóa cấu trúc dữ liệu giữa mã nguồn và cơ sở dữ liệu thực tế một cách tự động và có kiểm soát.
Ví dụ về cách triển khai Prisma:
- Prisma Schema (Định nghĩa dữ liệu):
model Station {
  id        Int      @id @default(autoincrement())
  name      String
  status    String   @default("OFFLINE")
  location  String?
  createdAt DateTime @default(now())
}
- Prisma Client (Truy vấn dữ liệu):
// Lấy danh sách tất cả các trạm đang hoạt động
const activeStations = await prisma.station.findMany({
  where: { status: "ONLINE" }
});
Việc sử dụng Prisma giúp loại bỏ các câu lệnh SQL thô (raw SQL) phức tạp, thay vào đó là các hàm gọi trực quan, giúp tăng tốc độ phát triển và giảm thiểu sai sót về logic dữ liệu.
1.6. Công nghệ Thanh toán và Giải pháp SePay tự động
1.6.1. QR Dynamic và Chuẩn VietQR (NAPAS 247)
Trong hệ thống ACW-SRS, thanh toán phải diễn ra nhanh chóng và chính xác. Dự án sử dụng tiêu chuẩn VietQR để tạo ra các mã QR động duy nhất cho mỗi đơn hàng. Khách hàng chỉ cần quét mã, mọi thông tin về số tài khoản, số tiền và nội dung chuyển khoản (Memo) sẽ được điền tự động.
1.6.2. Giải pháp SePay và Cơ chế Webhook tự động hóa
SePay là giải pháp trung gian kết nối giữa ngân hàng và hệ thống phần mềm. Cơ chế Webhook cho phép SePay gửi thông tin giao dịch tự động cho Server Next.js ngay khi tài khoản ngân hàng nhận được tiền. 
Dữ liệu gửi qua webhooks 
SePay sẽ gửi một request với phương thức là POST, với nội dung gửi như sau:
{
    "id": 92704,                              // ID giao dịch trên SePay
    "gateway":"Vietcombank",                  // Brand name của ngân hàng
    "transactionDate":"2023-03-25 14:02:37",  // Thời gian xảy ra giao dịch phía ngân hàng
    "accountNumber":"0123499999",              // Số tài khoản ngân hàng
    "code":null,      // Mã code thanh toán (sepay tự nhận diện dựa vào cấu hình tại Công ty -> Cấu hình chung)
    "content":"chuyen tien mua iphone",        // Nội dung chuyển khoản
    "transferType":"in",                       // Loại giao dịch. in là tiền vào, out là tiền ra
    "transferAmount":2277000,                  // Số tiền giao dịch
    "accumulated":19077000,                    // Số dư tài khoản (lũy kế)
    "subAccount":null,                         // Tài khoản ngân hàng phụ (tài khoản định danh),
    "referenceCode":"MBVCB.3278907687",         // Mã tham chiếu của tin nhắn sms
    "description":""                           // Toàn bộ nội dung tin nhắn sms
}
- Quy trình xử lý: Server xác thực gói tin, đối chiếu mã Memo và ngay lập tức phát lệnh kích hoạt thiết bị IoT mà không cần sự can thiệp thủ công.
1.7. Thiết kế giao diện và Trải nghiệm người dùng (UI/UX)
- Tính trực quan (Visibility): Trạng thái trạm rửa xe phải được hiển thị rõ ràng.
- Tính khả dụng (Usability): Giao diện tối giản, dễ thao tác trên thiết bị di động.
- Responsive Design: Tương thích hoàn hảo với mọi kích thước màn hình khác nhau.
1.8. Công cụ quản lý phiên bản Git và GitHub
- Git: Hệ thống quản lý phiên bản phân tán, ghi lại lịch sử thay đổi mã nguồn.
- GitHub: Nền tảng lưu trữ trực tuyến, hỗ trợ quy trình triển khai tự động CI/CD.
1.9. Bảo mật hệ thống và Cơ chế Xác thực - Phân quyền
1.9.1. Xác thực với JSON Web Token (JWT)
JWT là một tiêu chuẩn mở dùng để truyền tải thông tin an toàn giữa các bên dưới dạng đối tượng JSON. Đây là giải pháp xác thực vô trạng thái (Stateless), giúp hệ thống không cần lưu trữ session, từ đó tiết kiệm tài nguyên máy chủ.
  

Hình 1.7: Flow hệ thống sử dụng JWT 
Nhìn vào hình ta có thể thấy flow đi như sau:
1. User thực hiện login bằng cách gửi id/password hay sử dụng các tài khoản mạng xã hội lên phía Authentication Server (Server xác thực)
2. Authentication Server tiếp nhận các dữ liệu mà User gửi lên để phục vụ cho việc xác thực người dùng. Trong trường hợp thành công, Authentication Server sẽ tạo một JWT và trả về cho người dùng thông qua response.
3. Người dùng nhận được JWT do Authentication Server vừa mới trả về làm “chìa khóa” để thực hiện các “lệnh” tiếp theo đối với Application Server.
4. Application Server trước khi thực hiện yêu cầu được gọi từ phía User, sẽ verify JWT gửi lên. Nếu OK, tiếp tục thực hiện yêu cầu được gọi.
1.9.2. Cơ chế phân quyền người dùng (Authorization)
Bên cạnh xác thực người dùng, hệ thống cần phân quyền rõ ràng để kiểm soát chức năng mà mỗi nhóm người dùng được phép sử dụng.
Trong hệ thống ACW-SRS, phân quyền được chia thành các nhóm chính như:
Administrator:
Quản lý toàn bộ hệ thống, người dùng, thanh toán và thiết bị IoT.
Operator:
Theo dõi trạng thái trạm rửa xe và xử lý các tình huống vận hành.
Customer:
Sử dụng dịch vụ, thực hiện thanh toán và theo dõi trạng thái đơn hàng.
Việc phân quyền giúp tăng tính bảo mật, hạn chế truy cập trái phép và đảm bảo tính toàn vẹn dữ liệu.
1.11. Các thư viện và công cụ hỗ trợ phát triển
Hệ sinh thái Node.js cung cấp hàng triệu thư viện mã nguồn mở, giúp rút ngắn thời gian phát triển và đảm bảo tính tiêu chuẩn cho dự án.
1.11.1. Quản lý gói với npm và pnpm
Hệ sinh thái Node.js phát triển mạnh mẽ nhờ các công cụ quản lý gói (Package Managers) giúp điều phối hàng triệu thư viện mã nguồn mở.
- npm (Node Package Manager): Là trình quản lý gói mặc định và phổ biến nhất thế giới. Nó sử dụng file `package.json` để định nghĩa các phụ thuộc và `package-lock.json` để đảm bảo tính nhất quán của phiên bản thư viện trên tất cả các môi trường phát triển khác nhau. npm cài đặt thư viện theo cấu trúc "flat" (phẳng) trong thư mục `node_modules`, giúp giảm thiểu việc lặp lại các thư viện trùng lặp.
- pnpm (performant npm): Trong dự án ACW-SRS, pnpm được ưu tiên sử dụng nhờ hiệu suất vượt trội. Khác với npm, pnpm sử dụng cơ chế Content-addressable storage. Điều này có nghĩa là nếu mười dự án cùng sử dụng một phiên bản của thư viện React, pnpm chỉ lưu duy nhất một bản sao vật lý trên ổ đĩa và tạo các Hard link hoặc Symbolic link đến thư mục của từng dự án. Cơ chế này không chỉ giúp tiết kiệm dung lượng đĩa cứng mà còn loại bỏ hoàn toàn vấn đề "Phantom dependencies" (sử dụng thư viện không được khai báo rõ ràng), giúp dự án trở nên minh bạch và an toàn hơn.
1.11.2. Các thư viện tiêu biểu sử dụng trong dự án
Để xây dựng một hệ thống hoàn chỉnh và chuyên nghiệp, dự án đã tích hợp các thư viện hàng đầu sau:
- Axios: Một HTTP Client dựa trên Promise dành cho trình duyệt và Node.js. Nó cung cấp các tính năng mạnh mẽ như tự động chuyển đổi dữ liệu JSON, ngăn chặn tấn công XSRF và cho phép cấu hình Interceptors để xử lý các yêu cầu hoặc phản hồi chung (như gắn Token xác thực).
- React Hook Form: Một thư viện tối ưu để quản lý trạng thái của các biểu mẫu. Thay vì sử dụng cơ chế Controlled Component của React (gây render lại toàn bộ form mỗi khi gõ phím), thư viện này sử dụng Uncontrolled Component thông qua Refs, giúp hiệu năng ứng dụng luôn ở mức cao nhất ngay cả với các form đăng ký trạm phức tạp.
- Zustand: Giải pháp quản lý trạng thái toàn cục (Global State Management) theo hướng tối giản. Zustand khắc phục các nhược điểm của Redux như sự rườm rà (boilerplate) và khó học, đồng thời cung cấp khả năng truy xuất dữ liệu cực nhanh thông qua các Selector, phù hợp hoàn hảo cho việc cập nhật trạng thái thời gian thực của các trạm rửa xe.
- Tailwind CSS: Một framework CSS theo triết lý "Utility-first". Thay vì viết các lớp CSS riêng lẻ, lập trình viên sử dụng các lớp tiện ích có sẵn để xây dựng giao diện ngay trong mã nguồn HTML/JSX. Điều này giúp đảm bảo tính nhất quán về mặt thiết kế (Design System), giảm kích thước file CSS cuối cùng và tăng tốc độ phát triển giao diện người dùng.
1.12. Ý nghĩa thực tiễn và Khoa học của đề tài
- Giá trị thực tiễn: Tự động hóa quy trình, giảm chi phí vận hành và tăng doanh thu.
- Giá trị khoa học: Ứng dụng thành công các công nghệ phần mềm hiện đại vào IoT.
________________


CHƯƠNG 2. KHẢO SÁT VÀ PHÂN TÍCH HỆ THỐNG
2.1. Giới thiệu hệ thống
2.1.1. Giới thiệu về ACW-SRS
ACW-SRS là viết tắt của Automatic Car Wash – Self-service System, có nghĩa là Hệ thống Rửa xe Tự động Tự phục vụ. Tên gọi phản ánh đúng bản chất của hệ thống: khách hàng chủ động thanh toán qua mã QR và sử dụng máy rửa xe ngay lập tức mà không cần bất kỳ sự can thiệp nào từ nhân viên, toàn bộ quá trình được tự động hóa thông qua nền tảng web và công nghệ IoT.
ACW-SRS là một hệ thống rửa xe tự phục vụ thông minh, tích hợp giữa nền tảng web hiện đại (Next.js, React, TypeScript) và thiết bị phần cứng nhúng (ESP32), nhằm tự động hóa toàn bộ quy trình thanh toán và vận hành trạm rửa xe. Hệ thống được phát triển với mục tiêu loại bỏ sự can thiệp thủ công của người quản lý trong quá trình thanh toán và kích hoạt máy, từ đó giảm chi phí nhân sự, tăng tính minh bạch và nâng cao trải nghiệm của khách hàng.
ACW-SRS được xây dựng theo mô hình tự phục vụ (self-service) kết hợp Multi-tenant, trong đó khách hàng chủ động quét mã QR, thực hiện thanh toán và sử dụng máy rửa xe mà không cần nhân viên thu tiền hay vận hành trực tiếp. Đồng thời, nhiều chủ trạm (Tenant) độc lập có thể cùng quản lý hệ thống trạm rửa xe của riêng mình trên một nền tảng chung mà không ảnh hưởng lẫn nhau. Hệ thống hỗ trợ người dùng thực hiện các tác vụ sau:
- Quản lý trạm rửa xe và thiết bị IoT từ xa thông qua Dashboard web.
- Tự động kích hoạt máy rửa xe sau khi khách hàng hoàn tất thanh toán qua mã QR cố định (VietQR).
- Giám sát trạng thái thiết bị IoT theo thời gian thực và nhận cảnh báo khi có sự cố.
- Theo dõi doanh thu và lịch sử giao dịch một cách trực quan.
ACW-SRS cung cấp các tính năng cốt lõi giúp tối ưu hóa hoạt động kinh doanh dịch vụ rửa xe:
- Thanh toán tự động qua QR cố định: Khách hàng quét mã QR, thực hiện chuyển khoản ngân hàng; hệ thống tự động nhận biến động số dư qua Webhook SePay và kích hoạt máy mà không cần sự can thiệp của con người.
- Giám sát IoT thời gian thực: Dashboard hiển thị trạng thái Online/Offline của từng thiết bị ESP32, thời gian còn lại của lượt sử dụng và các cảnh báo sự cố.
- Quản lý đa trạm (Multi-tenant): Mỗi chủ trạm có không gian quản lý riêng biệt, an toàn và được cô lập dữ liệu hoàn toàn.
- Thống kê doanh thu trực quan: Biểu đồ doanh thu theo ngày, tuần, tháng giúp chủ trạm đánh giá hiệu quả kinh doanh.
- Điều khiển thiết bị từ xa: Cho phép bật/tắt cưỡng bức thiết bị từ Dashboard trong trường hợp cần bảo trì.
2.1.2. Hiện trạng và sự cần thiết của hệ thống
Dịch vụ rửa xe là một ngành dịch vụ phổ biến tại Việt Nam với hàng nghìn cơ sở hoạt động trên cả nước. Tuy nhiên, phần lớn các trạm rửa xe hiện nay vẫn vận hành theo phương thức truyền thống: thu tiền mặt thủ công, kích hoạt thiết bị bằng tay và không có hệ thống theo dõi doanh thu hay giám sát thiết bị từ xa. Mô hình vận hành này tồn tại nhiều hạn chế, bao gồm sự phụ thuộc vào nhân lực trực tiếp, nguy cơ thất thoát doanh thu do thiếu minh bạch và không có khả năng phát hiện sự cố thiết bị kịp thời.
Sự phát triển của các công nghệ như thanh toán không tiền mặt (VietQR, NAPAS 247), Internet of Things (IoT) và nền tảng web hiện đại (Next.js, Node.js) đã mở ra cơ hội để xây dựng một giải pháp rửa xe tự phục vụ thông minh, tự động và hiệu quả hơn. Do đó, hệ thống ACW-SRS được phát triển nhằm giải quyết các vấn đề thực tiễn nêu trên, cung cấp một nền tảng kết hợp giữa phần mềm web và phần cứng IoT để tự động hóa toàn bộ quy trình từ lúc khách hàng thanh toán đến khi máy rửa xe hoàn tất chu kỳ hoạt động.
Mục tiêu chính của hệ thống ACW-SRS là xây dựng một nền tảng quản lý dịch vụ rửa xe tự phục vụ toàn diện, giúp người dùng:
- Tự động hóa hoàn toàn quy trình thanh toán và kích hoạt thiết bị thông qua tích hợp cổng thanh toán SePay và giao tiếp HTTP với thiết bị ESP32.
- Giám sát hệ thống 24/7 với khả năng theo dõi trạng thái thiết bị IoT theo thời gian thực, nhận cảnh báo sự cố và điều khiển từ xa.
- Quản lý đa trạm linh hoạt theo mô hình Multi-tenant, đảm bảo cô lập dữ liệu tuyệt đối giữa các chủ trạm.
- Tối ưu hóa trải nghiệm người dùng với giao diện web thân thiện, hỗ trợ đầy đủ trên cả máy tính và thiết bị di động.
- Minh bạch hóa doanh thu thông qua hệ thống thống kê và báo cáo giao dịch chi tiết.
2.1.3. Mô tả bài toán
Nghiệp vụ:
Về phía khách hàng:
- Thanh toán qua mã QR cố định: Khách hàng quét mã QR được dán sẵn tại trạm, thực hiện chuyển khoản ngân hàng theo đúng nội dung yêu cầu. Hệ thống tự động nhận biến động số dư, đối chiếu giao dịch và kích hoạt máy rửa xe mà không cần nhân viên can thiệp.
Về phía chủ trạm (Tenant):
- Đăng ký và đăng nhập: Chủ trạm tạo tài khoản và đăng nhập vào hệ thống để quản lý các trạm của mình.
- Đổi mật khẩu / Quên mật khẩu: Chủ trạm có thể thay đổi mật khẩu hoặc lấy lại mật khẩu thông qua email.
- Quản lý trạm rửa xe: Thêm trạm mới bằng cách gán ID thiết bị ESP32, cấu hình đơn giá dịch vụ theo phút, chỉnh sửa thông tin hoặc tạm dừng hoạt động trạm.
- Giám sát và điều khiển IoT: Theo dõi trạng thái Online/Offline của thiết bị theo thời gian thực; điều khiển bật/tắt thiết bị từ Dashboard khi cần bảo trì; nhận cảnh báo khi thiết bị mất kết nối hoặc Relay gặp sự cố.
- Quản lý doanh thu: Xem thống kê doanh thu theo ngày, tuần, tháng cho từng trạm; xuất báo cáo lịch sử giao dịch; theo dõi biểu đồ tăng trưởng doanh thu.
Về phía quản trị viên (Admin):
- Đăng nhập hệ thống: Quản trị viên đăng nhập bằng tài khoản riêng có đặc quyền cao nhất.
- Quản lý tài khoản Tenant: Admin có thể xem danh sách, kích hoạt hoặc vô hiệu hóa tài khoản chủ trạm trên toàn hệ thống.
2.2. Yêu cầu về hệ thống
2.2.1. Yêu cầu chức năng của hệ thống
Quản lý tài khoản: 
* Đăng nhập đổi mật khẩu, quên mật khẩu.
* Cập nhật thông tin chủ trạm.
Quản lý trạm rửa xe:
* Thêm trạm mới (Gán ID cho bộ ESP32).
* Cấu hình giá tiền thuê trạm theo phút.
* Chỉnh sửa thông tin trạm hoặc tạm dừng hoạt động trạm.
Giám sát & Điều khiển IoT:
* Theo dõi trạng thái Online/Offline của thiết bị ESP32 theo thời gian thực.
* Điều khiển bật/tắt cưỡng bức thiết bị từ Dashboard (trong trường hợp bảo trì).
* Nhận cảnh báo khi thiết bị mất kết nối hoặc Relay gặp sự cố.
Quản lý doanh thu:
* Xem thống kê doanh thu theo ngày, tuần, tháng cho từng trạm.
* Xuất báo cáo lịch sử giao dịch (thanh toán qua SePay).
* Biểu đồ trực quan hóa dữ liệu tăng trưởng doanh thu.
Thanh toán & Thuê máy:
* Quét mã QR cố định để thực hiện thanh toán tự động.
* Hệ thống tự động kích hoạt máy rửa xe sau khi nhận được tiền.
* Theo dõi tiến trình: Xem thời gian đếm ngược còn lại của lượt thuê trực tiếp trên giao diện web.
2.2.2. Yêu cầu phi chức năng
Hiệu suất:
* Thời gian phản hồi từ lúc khách thanh toán đến khi máy kích hoạt (Relay đóng) phải dưới 2 giây.
* Giao diện Dashboard quản lý phải hoạt động mượt mà, phản hồi chuyển trang dưới 1 giây.
Bảo mật:
* Dữ liệu giữa các Tenant phải được cô lập hoàn toàn (Multi-tenancy isolation).
* Mã hóa mật khẩu người dùng.
* Đảm bảo an toàn cho các Webhook nhận biến động số dư từ ngân hàng.
Độ tin cậy:
* Hệ thống hoạt động 24/7, có khả năng tự động khôi phục kết nối Wi-Fi cho ESP32 khi gặp sự cố mạng.
* Sao lưu cơ sở dữ liệu hàng ngày để đảm bảo an toàn dữ liệu doanh thu.
2.3. Phân tích hệ thống (Sơ đồ Use Case).
  

Hình : Sơ đồ Use Case chi tiết hệ thống
CHƯƠNG 3. THIẾT KẾ HỆ THỐNG
3.1. Thiết kế chi tiết từng chức năng
3.1.1 Chức năng Đăng nhập
Thông tin
	Nội dung
	Use Case
	Đăng nhập
	Mục đích
	Xác thực danh tính người dùng để cho phép truy cập vào các chức năng quản trị.
	Mô tả
	Người dùng đăng nhập vào ứng dụng bằng cách nhập thông tin định danh (Email) và mật khẩu hợp lệ.
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đã có tài khoản trên hệ thống và đang ở trang đăng nhập.
	Điều kiện sau
	Hệ thống chuyển người dùng đến màn hình Dashboard quản trị tương ứng theo phân quyền.
	Luồng sự kiện chính (Basic Flow)
	1. Tác nhân truy cập trang đăng nhập.
2. Web hiển thị form đăng nhập.
3. Người dùng nhập Email và mật khẩu.
4. Tác nhân bấm nút đăng nhập.
5. Web gửi thông tin gọi API đăng nhập xuống Backend.
6. Backend nhận yêu cầu và đối chiếu với database (users table).
7. Backend trả về kết quả thành công kèm Access Token.
8. Web lưu Access Token vào bộ nhớ local và điều hướng tới trang quản lý.
	Luồng sự kiện phụ (Alternative Flow)
	3.a: Sai định dạng
- 3.a.1: Hệ thống hiển thị cảnh báo ngay trên form.
- 3.a.2: Người dùng nhập lại thông tin.


6.a: Sai thông tin đăng nhập hoặc tài khoản bị khóa
- 6.a.1: Backend trả về lỗi 401 Unauthorized.
- 6.a.2: Web hiển thị thẻ báo lỗi "Tài khoản hoặc mật khẩu không chính xác".
	

Đặc tả chức năng Đăng nhập
  

Biểu đồ hoạt động chức năng Đăng nhập
  

Biểu đồ trình tự chức năng Đăng nhập
3.1.2 Chức năng Xem thông tin người thuê
Thông tin
	Nội dung
	Use Case
	Xem thông tin người thuê
	Mục đích
	Cho phép xem chi tiết thông tin từng đối tác, gói dịch vụ dự kiến.
	Mô tả
	Xem danh sách tổng quan và thông tin cá nhân/hợp đồng của các Người thuê.
	Tác nhân
	Admin
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê.
	Điều kiện sau
	Admin xem được dữ liệu Tenant và chi tiết cấu hình (như hạn mức thiết bị, cấu hình thanh toán SePay).
	Luồng sự kiện chính (Basic Flow)
	1. Web gọi API lấy danh sách Tenant.
2. Backend Load dữ liệu trả về mảng danh sách.
3. Web hiển thị bảng các thông tin cơ bản: Tên, Email, Số điện thoại.
4. Admin chọn "Xem chi tiết".
5. Hệ thống hiển thị thông tin chuyên sâu: Số thiết bị tối đa, Tài khoản ngân hàng, Hạn đăng ký.
	Luồng sự kiện phụ (Alternative Flow)
	Không tìm thấy bất kỳ Tenant nào, trả về bảng rỗng và hiện "Chưa có người thuê".
	Đặc tả chức năng Xem thông tin người thuê
  

Biểu đồ hoạt động chức năng Xem thông tin người thuê
  

Biểu đồ trình tự chức năng Xem thông tin người thuê
3.1.3 Chức năng Thêm người thuê
Use Case
	Thêm người thuê
	Mục đích
	Ghi danh một đối tác mới vào nền tảng.
	Mô tả
	Tạo một Tenant record mới với các cấu hình về gói dịch vụ.
	Tác nhân
	Admin
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê.
	Điều kiện sau
	Lập bản ghi mới trong bảng tenants và liên kết với tài khoản users tương ứng.
	Luồng sự kiện chính (Basic Flow)
	1. Admin bấm nút "Thêm mới".
2. Hệ thống hiển thị form nhập thông tin (Tên, Email, SĐT, Số thiết bị tối đa, Chu kỳ đăng ký hợp đồng).
3. Admin điền thông tin và bấm "Lưu".
4. Backend ghi dữ liệu vào bảng tenants.
5. Backend trả về thông báo tạo thành công.
6. Cập nhật lại giao diện danh sách.
	Luồng sự kiện phụ (Alternative Flow)
	4.a: Email đã tồn tại
- 4.a.1: Database báo lỗi Unique Constraint.
- 4.a.2: Server báo lỗi "Email này đã được sử dụng".
	Đặc tả chức năng Thêm người thuê
  

Biểu đồ hoạt động chức năng Thêm người thuê
  

Biểu đồ trình tự chức năng Thêm người thuê
3.1.4 Chức năng Sửa người thuê
Thông tin
	Nội dung
	Use Case
	Sửa người thuê
	Mục đích
	Quản lý thay đổi trạng thái, gian hạn hoặc cài đặt webhook hỗ trợ thanh toán tự động.
	Mô tả
	Cho phép chỉnh sửa thông tin thông thường cũng như tích hợp API cấu hình thanh toán (Ví dụ cài đặt SePay webhook).
	Tác nhân
	Admin
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống, đang ở màn hình Quản lý người thuê và có ít nhất 1 người thuê đang tồn tại.
	Điều kiện sau
	Thông tin người thuê (bao gồm thiết lập thanh toán) được lưu lại.
	Luồng sự kiện chính (Basic Flow)
	1. Admin chọn một Tenant cần chỉnh sửa.
2. Hệ thống load lại form với dữ liệu cũ (Tên, cấu hình ngân hàng, Token thanh toán).
3. Admin điều chỉnh và bấm "Cập nhật".
4. Gọi API cập nhật xuống Backend.
5. Backend cập nhật Database và trả về thành công.
6. Web tải lại danh sách/báo cáo.
	Luồng sự kiện phụ (Alternative Flow)
	5.a: Lỗi không tìm thấy bản ghi (Màn hình báo lỗi không tìm thấy người thuê).
	Đặc tả chức năng Sửa người thuê
  

Biểu đồ hoạt động chức năng Sửa người thuê  
Biểu đồ trình tự chức năng Sửa người thuê
3.1.5 Chức năng Xóa người thuê
Thông tin
	Nội dung
	Use Case
	Xóa người thuê
	Mục đích
	Tiêu hủy dữ liệu những đối tác ngừng hợp đồng.
	Mô tả
	Xóa bỏ một Tenant, kéo theo các Thiết bị và Người dùng phụ thuộc cũng sẽ bị giải phóng.
	Tác nhân
	Admin
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang thao tác trên bảng Người thuê.
	Điều kiện sau
	Tenant bị đánh dấu vô hiệu hóa hoặc bị xóa khỏi DB.
	Luồng sự kiện chính (Basic Flow)
	1. Admin nhấn chọn "Xóa".
2. Hộp thoại cảnh báo xuất hiện.
3. Admin xác nhận thao tác.
4. Backend tiến hành chạy lệnh Xóa (Cascade/Soft Delete) Tenant.
5. Đóng hộp thoại và refresh UI danh sách.
	Luồng sự kiện phụ (Alternative Flow)
	3.a: Admin hủy thao tác (Quay lại bước trước, tắt hộp thoại).
	Đặc tả chức năng Xóa người thuê
  

Biểu đồ hoạt động chức năng Xóa người thuê
  

Biểu đồ trình tự chức năng Xóa người thuê
3.1.6 Chức năng Xem doanh thu
Thông tin
	Nội dung
	Use Case
	Xem doanh thu
	Mục đích
	Xác định lãi/lỗ thông qua báo cáo dạng biểu đồ và thẻ tổng kết.
	Mô tả
	Báo cáo tài chính cho nền tảng (Admin) hoặc riêng thiết bị của mình (Tenant).
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Doanh thu.
	Điều kiện sau
	Hiển thị bảng tổng kết hoặc biểu đồ theo thời gian.
	Luồng sự kiện chính (Basic Flow)
	1. Người dùng chọn phạm vi ngày tháng cần lấy dữ liệu.
2. Gửi API request Report tổng hợp.
3. Backend duyệt qua bảng transactions có status completed, tổng hợp và nhóm số liệu.
4. Web tiếp nhận dữ liệu render lên các thành phần đồ họa (Bar Chart/Thẻ tổng kết).
	Luồng sự kiện phụ (Alternative Flow)
	3.a: Giai đoạn không có thay đổi giao dịch (Hiển thị 0đ và chart phẳng).
	

Đặc tả chức năng Xem doanh thu
  

Biểu đồ hoạt động chức năng Xem doanh thu
  

Biểu đồ trình tự chức năng Xem doanh thu
3.1.7 Chức năng Gửi báo cáo doanh thu
Thông tin
	Nội dung
	Use Case
	Gửi báo cáo doanh thu
	Mục đích
	Gửi thông tin tổng kết doanh thu định kỳ qua email.
	Mô tả
	Trích xuất báo cáo doanh thu dưới dạng PDF/Excel và tự động gửi tới email chỉ định.
	Tác nhân
	Admin, Tenant
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Doanh thu.
	Điều kiện sau
	Email chứa báo cáo được gửi đi thành công.
	Luồng sự kiện chính (Basic Flow)
	1. Admin bấm nút "Gửi báo cáo".
2. Hệ thống hiển thị popup chọn kỳ báo cáo và email nhận.
3. Admin điền thông tin và bấm "Gửi".
4. Backend tạo file tổng hợp và sử dụng Mail Service để gửi tin.
5. Backend trả về trạng thái gửi thành công.
6. Web thông báo "Báo cáo đã gửi thành công".
	Luồng sự kiện phụ (Alternative Flow)
	4.a: Lỗi dịch vụ gửi Email (Mail server out/Timeout)
 - 4.a.1: Backend bắt lỗi gửi mail thất bại.
 - 4.a.2: Trả về thông báo "Lỗi khi gửi email, vui lòng xem lại cấu hình máy chủ".
	

Đặc tả chức năng Gửi báo cáo doanh thu
  

Biểu đồ hoạt động chức năng Gửi báo cáo doanh thu
  

Biểu đồ trình tự chức năng Gửi báo cáo doanh thu


3.1.8 Chức năng Xem giao dịch
Thông tin
	Nội dung
	Use Case
	Xem giao dịch
	Mục đích
	Kiểm tra chi tiết thời gian, số tiền, trạng thái của từng giao dịch.
	Mô tả
	Khám phá dữ liệu từng bản ghi giao dịch để đối soát.
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Giao dịch.
	Điều kiện sau
	Danh sách giao dịch được hiển thị đúng quyền hạn.
	Luồng sự kiện chính (Basic Flow)
	1. Web gửi yêu cầu lấy danh sách giao dịch (có phân trang/lọc).
2. Backend xác nhận quyền và trả về dữ liệu tương ứng.
3. Web hiển thị bảng giao dịch (Thời gian, Số tiền, Mã KH, Trạng thái).
4. Người dùng có thể bấm xem chi tiết từng dòng.
	Luồng sự kiện phụ (Alternative Flow)
	2.a: Lọc theo thời điểm không cố định/ Lỗi DB
 - 2.a.1: Web thông báo không thể tìm thấy dữ liệu.
	Đặc tả chức năng Xem giao dịch
  

Biểu đồ hoạt động chức năng Xem giao dịch
  

Biểu đồ trình tự chức năng Xem giao dịch
3.1.9 Chức năng Xuất file thống kê
Thông tin
	Nội dung
	Use Case
	Xuất file thống kê
	Mục đích
	Xuất dữ liệu ra file mềm (Excel, CSV) cho việc kế toán ngoài hệ thống.
	Mô tả
	Người dùng chọn dữ liệu và hệ thống sẽ xuất định dạng file tải về máy.
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang xem danh sách giao dịch.
	Điều kiện sau
	File lưu sẵn ở thiết bị cục bộ.
	Luồng sự kiện chính (Basic Flow)
	1. Người dùng bấm "Xuất file".
2. Chọn định dạng (Xuất toàn bộ hoặc theo bộ lọc hiện có).
3. Backend tạo file .csv tĩnh và trả lại luồng (stream).
4. Web tải file xuống máy tính của người dùng.
5. Thông báo xuất thành công.
	Luồng sự kiện phụ (Alternative Flow)
	3.a: Khối lượng dữ liệu quá lớn
 - 3.a.1: Backend xử lý quá lâu, báo Timeout.
 - 3.a.2: Web đề xuất người dùng chia nhỏ bộ lọc thời gian để xuất.
	

Đặc tả chức năng Xuất file thống kê
  

Biểu đồ hoạt động chức năng Xuất file thống kê
  

Biểu đồ trình tự chức năng Xuất file thống kê


3.1.10 Chức năng Xem thiết bị
Thông tin
	Nội dung
	Use Case
	Xem thiết bị
	Mục đích
	Xem trạng thái kết nối và thuộc tính của các thiết bị máy bơm.
	Mô tả
	Hiển thị tất cả thiết bị với label đánh dấu "Online", "Offline", "Busy".
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị.
	Điều kiện sau
	Danh sách thiết bị cập nhật đúng trạng thái thực tế nhất.
	Luồng sự kiện chính (Basic Flow)
	1. Web gửi API lấy danh sách thiết bị.
2. Backend ghép với thông tin Heartbeat cuối cùng để tính toán trạng thái.
3. Backend trả dữ liệu kèm cờ Online/Offline.
4. Web hiển thị danh sách thiết bị dạng bảng hoặc dạng thẻ (Card).
	Luồng sự kiện phụ (Alternative Flow)
	3.a: Mất đồng bộ Heartbeat Database
 - 3.a.1: Backend báo lỗi log.
 - 3.a.2: Web tạm nhận trạng thái cũ (Cached).
	Đặc tả chức năng Xem thiết bị
  

Biểu đồ hoạt động chức năng Xem thiết bị
  

Biểu đồ trình tự chức năng Xem thiết bị


3.1.11 Chức năng Thêm thiết bị
Thông tin
	Nội dung
	Use Case
	Thêm thiết bị
	Mục đích
	Gắn thẻ, thêm một module ESP32 mới tinh vào phần mềm quản lý trạm cụ thể.
	Mô tả
	Người dùng khai báo MAC Address và Tên cho hệ thống chấp nhận thiết bị kết nối lên.
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị.
	Điều kiện sau
	Thiết bị thiết lập thành công.
	Luồng sự kiện chính (Basic Flow)
	1. Người dùng bấm "Thêm thiết bị mới".
2. Điền MAC Address, Tên thiết bị, Chọn trạm gán vào.
3. Bấm "Lưu".
4. Backend thẩm định dữ liệu và lưu DB.
5. Báo thêm mới thành công, thiết bị có thể bắt đầu được kết nối.
	Luồng sự kiện phụ (Alternative Flow)
	4.a: MAC Address trùng lặp
 - 4.a.1: Backend báo thiết bị này đang thuộc trạm khác/ người khác.
 - 4.a.2: Hệ thống báo lỗi "MAC ID không hợp lệ".
	Đặc tả chức năng Thêm thiết bị
  

Biểu đồ hoạt động chức năng Thêm thiết bị
  

Biểu đồ trình tự chức năng Thêm thiết bị


3.1.12 Chức năng Sửa cấu hình thiết bị
Thông tin
	Nội dung
	Use Case
	Sửa cấu hình thiết bị
	Mục đích
	Định cấu hình giá tiền, thời gian tương ứng.
	Mô tả
	Cập nhật tên thiết bị, trạm gán hoặc bảng giá cước (Ví dụ x vnđ/phút).
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống, đang ở màn hình Thiết bị và thiết bị đã tồn tại.
	Điều kiện sau
	Thiết bị lưu trữ thông tin cấu hình mới nhất.
	Luồng sự kiện chính (Basic Flow)
	1. Bấm nút "Sửa" ở dòng thiết bị cần chỉnh.
2. Thay đổi các thuộc tính như Tên, Đơn giá/phút.
3. Bấm "Cập nhật".
4. Backend ghi lại DB, update Cache (nếu có).
5. Trả kết quả thành công.
	Luồng sự kiện phụ (Alternative Flow)
	2.a: Nhập số âm cho đơn giá
 - 2.a.1: Web validation bắt lỗi.
 - 2.a.2: Hiển thị lỗi "Đơn giá phải lớn hơn 0" trên form.
	Đặc tả chức năng Sửa cấu hình thiết bị
  

Biểu đồ hoạt động chức năng Sửa cấu hình thiết bị
  

Biểu đồ trình tự chức năng Sửa cấu hình thiết bị


3.1.13 Chức năng Xóa thiết bị
Thông tin
	Nội dung
	Use Case
	Xóa thiết bị
	Mục đích
	Xóa hoàn toàn thiết bị khỏi hệ thống khi hư hỏng/dời đi.
	Mô tả
	Xóa liên kết và dữ liệu thiết bị, từ đó thiết bị vật lý này sẽ không cấp phép nối lên Server được nữa.
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị.
	Điều kiện sau
	Thiết bị biến mất khỏi hệ thống.
	Luồng sự kiện chính (Basic Flow)
	1. Bấm xoá thiết bị.
2. Nhận popup cảnh báo rủi ro thao tác.
3. Bấm xác nhận xóa.
4. Backend cô lập dữ liệu giao dịch cũ (giữ lại) nhưng xoá thực thể device table.
5. Thông báo xoá thành công.
	Luồng sự kiện phụ (Alternative Flow)
	4.a: Thiết bị đang trong trạng thái BUSY (đáp ứng khách)
 - 4.a.1: Backend chặn tiến tình xoá để tránh mất tiền của khách đang dùng dở.
 - 4.a.2: Web báo lỗi "Hãy chờ chu kỳ rửa hoàn tất để xoá".
	

Đặc tả chức năng Xóa thiết bị
  

Biểu đồ hoạt động chức năng Xóa thiết bị
  

Biểu đồ trình tự chức năng Xóa thiết bị


3.1.14 Chức năng Thanh toán
Thông tin
	Nội dung
	Use Case
	Thanh toán
	Mục đích
	Cho phép khách hàng trả phí để bắt đầu sử dụng máy rửa xe.
	Mô tả
	Khách hàng quét mã QR, thanh toán qua cổng điện tử và nhấn nút bắt đầu trên web.
	Tác nhân
	Khách hàng
	Điều kiện trước
	Khách hàng ở gần trạm rửa xe, có thiết bị kết nối internet.
	Điều kiện sau
	Máy bơm được kích hoạt (Relay ON) trong khoảng thời gian đã mua.
	Luồng sự kiện chính (Basic Flow)
	1. Khách hàng sử dụng điện thoại quét mã QR cố định được dán trên tủ máy rửa xe.
2. Trình duyệt mở trang chọn gói dịch vụ (Dựa trên ID thiết bị lưu ở URL).
3. Khách hàng bấm chọn số lượng tiền (Vd 10.000đ).
4. Hệ thống hiển thị thông tin thanh toán bao gồm: Số tài khoản, Ngân hàng và Nội dung chuyển khoản (Mã tham chiếu) để khách hàng thực hiện giao dịch.
5. Khách hàng thực hiện chuyển khoản qua ứng dụng ngân hàng.
6. Hệ thống thanh toán (SePay/Webhook) gửi callback xác nhận về Backend.
7. Web polling hoặc WebSocket nhận được tín hiệu thành công và hiện nút "Bắt đầu".
8. Khách hàng bấm "Bắt đầu".
9. Backend chuyển lệnh qua mạng để ESP32 đóng relay máy bơm.
10. Web hiển thị đồng hồ đếm ngược.
	Luồng sự kiện phụ (Alternative Flow)
	5.a: Khách hàng rời đi / Đóng trang
 - 5.a.1: Giao dịch không diễn ra, trạng thái máy vẫn Idle.


9.a: Ngay lúc bấm bắt đầu, Thiết bị ngắt kết nối Wifi
 - 9.a.1: Backend gọi xuống ESP32 nhưng Timeout.
 - 9.a.2: Web thông báo "Thiết bị gặp sự cố kết nối, chúng tôi đã ghi nhận hoàn tiền vào tài khoản/SĐT...".
	

Đặc tả chức năng Thanh toán
  

Biểu đồ hoạt động chức năng Thanh toán
  

Biểu đồ trình tự chức năng Thanh toán


3.1.15 Chức năng Đăng ký hệ thống
Thông tin
	Nội dung
	Use Case
	Đăng ký hệ thống
	Mục đích
	Báo danh để Server nhận diện và cấp phép tham gia mạng lưới.
	Mô tả
	Khi thiết bị ESP32 boot lên, nó sẽ gửi một gói tin HTTP kèm MAC ADDRESS để thông báo danh tính lên API Server.
	Tác nhân
	IoT Device
	Điều kiện trước
	Đã cấu hình Wifi mật khẩu tại trạm thành công.
	Điều kiện sau
	Thiết bị bước vào vòng lặp làm việc bình thường.
	Luồng sự kiện chính (Basic Flow)
	1. Node ESP32 khởi động, truy cập Wifi.
2. Gửi lệnh POST /api/iot/register bao gồm tham số bắt buộc là MAC_ADDRESS.
3. Backend đối chiếu MAC_ADDRESS này trong Schema của Tenant/Admin tải lên trước đó.
4. Backend ghi nhận trạng thái thiết bị online và gửi phản hồi 200 kèm Token/cấu hình pin.
5. ESP32 lưu thông số và vào vòng lặp chờ lệnh.
	Luồng sự kiện phụ (Alternative Flow)
	3.a: MAC Address chua được cấu hình trong bảng Backend
 - 3.a.1: Backend trả HTTP 403 Forbidden.
 - 3.a.2: ESP32 đi vào trạng thái chờ 5p rồi đăng ký lại.
	Đặc tả chức năng Đăng ký hệ thống
  

Biểu đồ hoạt động chức năng Đăng ký hệ thống
  

Biểu đồ trình tự chức năng Đăng ký hệ thống


3.1.16 Chức năng Gửi trạng thái
Thông tin
	Nội dung
	Use Case
	Gửi trạng thái (Heartbeat)
	Mục đích
	Duy trì bằng chứng thiết bị vẫn đang sống (Online).
	Mô tả
	Thiết bị ping định kỳ về server 30-60s 1 lần cập nhật trạng thái làm việc hiện tại (Bật hay đang Tắt).
	Tác nhân
	IoT Device
	Điều kiện trước
	ESP32 đã đăng ký hệ thống thành công (UC-7.1).
	Điều kiện sau
	Last_seen của thiết bị được cấp nhật.
	Luồng sự kiện chính (Basic Flow)
	1. Mỗi N giây, ESP32 gọi HTTP GET tới /api/iot/heartbeat.
2. Gói tin gắn kèm State (Bật/Tắt).
3. Backend Cập nhật timestamp trong DB.
4. Server phản hồi 200 OK.
	Luồng sự kiện phụ (Alternative Flow)
	1.a: Rớt mạng Wifi trong lúc chạy
 - 1.a.1: Gửi request thất bại.
 - 1.a.2: Phần cứng tiếp tục cho phép chạy nếu còn timer, sau đó nó sẽ retry liên tục tới khi có net.
	Đặc tả chức năng Gửi trạng thái
  

Biểu đồ hoạt động chức năng Gửi trạng thái
  

Biểu đồ trình tự chức năng Gửi trạng thái


3.1.17 Chức năng Nhận lệnh điều khiển
Thông tin
	Nội dung
	Use Case
	Nhận lệnh điều khiển
	Mục đích
	Nhận tín hiệu khởi động từ xa sau khi người dùng trả tiền.
	Mô tả
	ESP32 đáp ứng các mệnh lệnh bật và tắt Relay vật lý qua giao tiếp Server (HTTP long polling hoặc Websocket tùy lựa chọn công nghệ IoT).
	Tác nhân
	IoT Device
	Điều kiện trước
	Đang có kết nối mạng ổn định với Backend.
	Điều kiện sau
	Rơ-le (Relay) được kích mức cao hoặc mức thấp thành công, trạng thái máy vật lý đổi khác.
	Luồng sự kiện chính (Basic Flow)
	1. Admin/Customer kích hoạt lệnh "Bật" cho thời gian N phút trên Server.
2. Server đẩy lệnh cmd=START&duration=N xuống module ESP32.
3. ESP32 phân tích gói lệnh.
4. ESP32 Set-Pin kích hoạt GPIO liên kết Relay => Bơm bắt đầu chạy.
5. ESP32 Gửi POST status_log=STARTED báo điểm danh thành công lên Server.
6. (Kết thúc) Sau khi timer đếm ngược tại ESP32 kết thúc, nó Set-Pin ngắt Relay và Gửi POST status=STOPPED lên server một lần nữa.
	Luồng sự kiện phụ (Alternative Flow)
	4.a: Mạch chập cháy, Relay không hoạt động
 - 4.a.1: Trạng thái không thể thay đổi, phần cứng ghi nhận timeout hoặc ADC check.
 - 4.a.2: Gửi gói Error packet Error=Hardware_Fails ngược lên Server cho Admin check tu bổ.
	

Đặc tả chức năng Nhận lệnh điều khiển
  

Biểu đồ hoạt động chức năng Nhận lệnh điều khiển
  

Biểu đồ trình tự chức năng Nhận lệnh điều khiển


3.1.18 Chức năng Quên mật khẩu
Thông tin
	Nội dung
	Use Case
	Quên mật khẩu
	Mục đích
	Cho phép người dùng thiết lập lại mật khẩu mới khi không nhớ mật khẩu cũ.
	Mô tả
	Người dùng yêu cầu mã xác thực qua email, sau đó nhập mã kèm mật khẩu mới để hệ thống cập nhật.
	Tác nhân
	Admin, Người thuê
	Điều kiện trước
	Tác nhân đang ở trang đăng nhập hoặc trang quên mật khẩu.
	Điều kiện sau
	Mật khẩu mới được cập nhật vào CSDL, người dùng có thể đăng nhập bằng mật khẩu mới.
	Luồng sự kiện chính (Basic Flow)
	1. Người dùng bấm chọn "Quên mật khẩu" tại trang đăng nhập.
2. Hệ thống hiển thị form nhập Email.
3. Người dùng nhập Email và bấm "Gửi mã xác thực".
4. Backend kiểm tra sự tồn tại của Email, sinh mã OTP 4 số và gửi về hòm thư người dùng.
5. Hệ thống hiển thị form nhập mã OTP và mật khẩu mới.
6. Người dùng nhập mã OTP nhận được, nhập mật khẩu mới và xác nhận mật khẩu.
7. Backend kiểm tra tính hợp lệ của mã OTP và thời gian hiệu lực.
8. Backend băm mật khẩu mới và cập nhật vào bảng users.
9. Thông báo thành công và điều hướng người dùng về trang đăng nhập.
	Luồng sự kiện phụ (Alternative Flow)
	4.a: Email không tồn tại
 - 4.a.1: Hệ thống thông báo email không có trong hệ thống hoặc hiển thị thông báo chung để đảm bảo bảo mật.
7.a: Mã OTP sai hoặc hết hạn
 - 7.a.1: Hệ thống báo lỗi "Mã xác thực không hợp lệ hoặc đã hết hạn".
 - 7.a.2: Cho phép người dùng yêu cầu gửi lại mã mới.
	
Đặc tả chức năng Quên mật khẩu
   

Biểu đồ hoạt động chức năng Quên mật khẩu
   

Biểu đồ trình tự chức năng Quên mật khẩu

CHƯƠNG 4. TRIỂN KHAI VÀ XÂY DỰNG GIAO DIỆN HỆ THỐNG


 4.1. Trang Đăng nhập
Trang đăng nhập là giao diện cho phép quản trị viên (Admin) và các chủ trạm (Tenant) truy cập vào hệ thống quản lý bằng cách cung cấp thông tin tài khoản hợp lệ bao gồm:
- Trường nhập Email và Mật khẩu.
- Nút "Đăng nhập" để gửi thông tin và kiểm tra xác thực qua hệ thống.
- Liên kết "Quên mật khẩu" để lấy lại mật khẩu nếu người dùng quên.
- Hiển thị thông báo lỗi (Validate) trực quan khi nhập sai thông tin tài khoản hoặc mật khẩu.
Trang đăng nhập đóng vai trò quan trọng trong việc bảo mật, giúp chỉ những người dùng được cấp quyền mới truy cập được vào bảng điều khiển (Dashboard) bên trong hệ thống.


![Hình 4.1: Form đăng nhập](vị_trí_chèn_ảnh_form_dang_nhap)


![Hình 4.2: Thông báo lỗi Validate khi đăng nhập](vị_trí_chèn_ảnh_loi_dang_nhap)


 4.2. Trang Quên mật khẩu
Chức năng quên mật khẩu là tính năng hỗ trợ người dùng khi không nhớ mật khẩu để đăng nhập vào hệ thống.
Quy trình được thực hiện qua các bước sau:
- Người dùng nhập địa chỉ email đã dùng để đăng ký tài khoản.
- Khi bấm nút TIẾP TỤC, hệ thống sẽ tự động gửi một email chứa mã xác thực (OTP) hoặc đường dẫn an toàn đến hòm thư của người dùng.
- Giao diện hiển thị rõ email mà mã đã được gửi đến, giúp người dùng kiểm tra và tránh sai sót.
- Người dùng nhập mã xác thực vào form để tiến hành đặt lại mật khẩu mới.
- Có nút liên kết "Quay lại" để trở về trang đăng nhập ban đầu.


![Hình 4.3: Form yêu cầu lấy lại mật khẩu](vị_trí_chèn_ảnh_quen_mat_khau)


![Hình 4.4: Nhập mã xác thực để đổi mật khẩu](vị_trí_chèn_ảnh_nhap_ma_xac_thuc)


 4.3. Trang Quản lý Người thuê (Tenant)
Trang quản lý người thuê là giao diện dành riêng cho Admin hệ thống giúp hiển thị và quản lý toàn bộ thông tin đối tác/chủ trạm đã đăng ký.
Chức năng chính:
- Hiển thị danh sách tất cả các Tenant đang hoạt động trên nền tảng.
- Hỗ trợ tìm kiếm nhanh theo: Tên chủ trạm, Số điện thoại hoặc Email.
- Hỗ trợ bộ lọc dữ liệu theo trạng thái hoạt động (Đang hoạt động, Bị khóa).
- Cho phép thực hiện các thao tác quản lý trực tiếp trên hàng dữ liệu:
  - Xem chi tiết thông tin Tenant.
  - Chỉnh sửa thông tin (icon Bút).
  - Khóa hoặc xóa Tenant (icon Thùng rác).


![Hình 4.5: Trang danh sách quản lý người thuê](vị_trí_chèn_ảnh_danh_sach_tenant)


 4.4. Trang Thêm mới và Chỉnh sửa Người thuê
Trang Thêm mới là giao diện cho phép Admin tạo tài khoản mới cho một chủ trạm (Tenant) để họ có thể bắt đầu sử dụng dịch vụ. Trang Chỉnh sửa cho phép cập nhật lại các thông tin nếu có sự thay đổi.
Các trường thông tin yêu cầu:
- Họ và tên chủ trạm.
- Số điện thoại liên hệ.
- Địa chỉ Email (dùng làm tài khoản đăng nhập).
- Số lượng thiết bị tối đa được phép quản lý.
- Cấu hình thông tin tích hợp thanh toán (SePay API Key) để tự động hóa doanh thu.
Thiết kế giao diện yêu cầu nhập đủ các thông tin cần thiết, tự động báo lỗi (Validate) nếu bỏ trống hoặc sai định dạng email.


![Hình 4.6: Form thêm mới người thuê](vị_trí_chèn_ảnh_form_them_tenant)


 4.5. Trang Quản lý Thiết bị (IoT ESP32)
Trang quản lý thiết bị giúp người thuê (Tenant) có thể thêm mới, cấu hình và theo dõi tình trạng của các trạm rửa xe vật lý.
- Thêm thiết bị mới: Yêu cầu nhập địa chỉ MAC của bộ ESP32 và Tên trạm.
- Cấu hình giá tiền: Giao diện cho phép đặt mức giá dịch vụ (Ví dụ: 2000đ/phút).
- Theo dõi trạng thái: Hiển thị danh sách thiết bị kèm các huy hiệu trạng thái thời gian thực như "Online" (Xanh lá), "Offline" (Xám) hoặc "Busy" (Đỏ - Đang có khách rửa).
- Điều khiển từ xa: Cho phép chủ trạm bật/tắt thiết bị khẩn cấp thông qua các nút gạt (Toggle Switch) ngay trên giao diện.


![Hình 4.7: Trang quản lý trạng thái thiết bị](vị_trí_chèn_ảnh_quan_ly_thiet_bi)


 4.6. Trang Xem Doanh thu và Giao dịch
Đây là trang Dashboard tài chính, đóng vai trò như một báo cáo trực quan cho các chủ trạm:
- Hiển thị các thẻ thống kê tổng quan (Thống kê số dư hiện tại, Doanh thu trong ngày, Doanh thu tuần).
- Tích hợp biểu đồ trực quan (Bar chart/Line chart) thể hiện dòng tiền theo từng chu kỳ.
- Bảng lịch sử giao dịch bên dưới giúp đối soát từng khoản tiền khách hàng chuyển vào thông qua quét QR.
- Hỗ trợ xuất dữ liệu (Export) ra file Excel/CSV phục vụ việc kế toán.


![Hình 4.8: Trang thống kê doanh thu và giao dịch](vị_trí_chèn_ảnh_thong_ke_doanh_thu)


 4.7. Trang Thanh toán tự động (Dành cho Khách hàng)
Trang thanh toán là giao diện hướng tới khách hàng cuối (End-user), hiện ra khi người dùng quét mã QR cố định tại trạm rửa xe.
- Giao diện tối ưu hoàn toàn cho thiết bị di động (Mobile-first).
- Hiển thị rõ tên trạm rửa xe hiện tại.
- Cung cấp các gói thời gian/số tiền để khách hàng lựa chọn (Ví dụ: 10.000đ - 5 phút).
- Khi chọn gói, hệ thống hiển thị thông tin thanh toán (Số tài khoản, Ngân hàng, Nội dung chuyển khoản) tương ứng với trạm để khách hàng thực hiện chuyển khoản thủ công hoặc quét mã VietQR hỗ trợ.
- Màn hình tự động chuyển sang giao diện "Đếm ngược thời gian" ngay khi hệ thống ngân hàng báo nhận được tiền qua Webhook SePay, kèm theo hoạt ảnh sinh động báo hiệu máy đã được bật.


![Hình 4.9: Giao diện chọn gói và quét mã thanh toán](vị_trí_chèn_ảnh_trang_thanh_toan_khach_hang)


 KẾT LUẬN


Trong quá trình xây dựng và phát triển hệ thống ACW-SRS (Auto Car Wash Smart Rental System), em đã đúc kết ra được những thành quả và bài học quý giá sau:

Kết quả đã đạt được:
- Hoàn thành đầy đủ các chức năng lõi đã đề ra: Quản trị đa người dùng (Multi-tenant), Quản lý trạng thái thiết bị IoT thời gian thực, tự động hóa thanh toán và báo cáo doanh thu.
- Hoàn thiện hệ thống với kiến trúc Full-stack chặt chẽ, tối ưu hiệu năng.
- Sử dụng thành thạo framework Next.js và React để xây dựng giao diện người dùng mượt mà, trực quan, hỗ trợ tốt trên cả thiết bị di động và máy tính.
- Áp dụng thành công hệ quản trị cơ sở dữ liệu MySQL kết hợp cùng Prisma ORM giúp thao tác dữ liệu (CRUD) an toàn, linh hoạt và truy vấn tốc độ cao.
- Triển khai thành công thiết bị phần cứng ESP32, lập trình luồng kết nối tự động phục hồi và xử lý tín hiệu bật/tắt thiết bị vật lý với độ trễ thấp (< 3 giây).
- Tích hợp giải pháp thanh toán không tiền mặt tự động qua Webhook SePay, mang lại giá trị thực tiễn lớn trong việc tự động hóa mô hình kinh doanh.
- Nâng cao kỹ năng thiết kế UI/UX (Tailwind CSS, shadcn/ui) giúp giao diện trở nên thân thiện và chuyên nghiệp hơn.

Hạn chế:
- Giao diện dành cho khách hàng quét mã QR vẫn còn khá đơn giản, chưa tích hợp nhiều hoạt ảnh (animation) thu hút.
- Hệ thống hiện tại chỉ mới kết nối thanh toán qua tài khoản ngân hàng, chưa tích hợp các ví điện tử phổ biến như MoMo, ZaloPay.
- Thiết bị IoT ESP32 phụ thuộc hoàn toàn vào mạng Wi-Fi, có thể gặp rủi ro mất kết nối tại các khu vực sóng yếu.

Phương hướng phát triển:
- Nâng cấp UI/UX cho toàn bộ hệ thống để mang lại trải nghiệm tiệm cận các ứng dụng thương mại cao cấp.
- Tích hợp thêm các module kết nối 4G/LTE cho phần cứng IoT nhằm khắc phục điểm yếu của sóng Wi-Fi.
- Phát triển thêm tính năng "Thẻ thành viên" hoặc "Ví nạp trước" giúp khách hàng thân thiết thao tác nhanh hơn mà không cần phải chuyển khoản ngân hàng nhiều lần.
- Triển khai thử nghiệm thực tế tại một số trạm rửa xe trên địa bàn để thu thập phản hồi và tối ưu hóa hệ thống.


---


     TÀI LIỆU THAM KHẢO

[1] Tài liệu chính thức của Next.js (App Router) và hệ sinh thái Vercel, https://nextjs.org/docs
[2] Tài liệu hướng dẫn lập trình thư viện ReactJS, https://react.dev/
[3] Kiến trúc và tài liệu hướng dẫn sử dụng Prisma ORM, https://www.prisma.io/docs
[4] Node.js Documentation, https://nodejs.org/docs
[5] Tài liệu kỹ thuật vi điều khiển ESP32 và tập lệnh ESP-IDF, Espressif Systems.
[6] Cấu trúc và tài liệu tích hợp thanh toán tự động qua Webhook, SePay, https://docs.sepay.vn/
[7] Sách "Clean Code: A Handbook of Agile Software Craftsmanship", Robert C. Martin.
[8] Tài liệu tham khảo về giao thức MQTT và HTTP trong IoT.
[9] Giáo trình Phát triển Ứng dụng Web, Đại học Công nghệ thông tin và Truyền thông Thái Nguyên.


---


     PHỤ LỤC

- Mã nguồn Firmware ESP32.
- Sơ đồ mạch điện và thiết kế PCB.
- Hình ảnh triển khai trạm rửa xe thực tế.
