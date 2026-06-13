TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
KHOA CÔNG NGHỆ THÔNG TIN

  


 
NGÔ GIA QUYẾN



  
ỨNG DỤNG THIẾT BỊ IOT XÂY DỰNG HỆ THỐNG QUẢN LÝ THIẾT BỊ CHO TRẠM RỬA XE TỰ PHỤC VỤ



ĐỒ ÁN TỐT NGHIỆP ĐẠI HỌC
NGÀNH KỸ THUẬT PHẦN MỀM 







THÁI NGUYÊN, NĂM 2026

TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
KHOA CÔNG NGHỆ THÔNG TIN

	

ĐỒ ÁN
TỐT NGHIỆP ĐẠI HỌC
NGÀNH KỸ THUẬT PHẦN MỀM


Đề tài:
ỨNG DỤNG THIẾT BỊ IOT XÂY DỰNG HỆ THỐNG QUẢN LÝ THIẾT BỊ CHO TRẠM RỬA XE TỰ PHỤC VỤ

	Sinh viên thực hiện: NGÔ GIA QUYẾN
	Lớp: KTPM K21A
	Giảng viên hướng dẫn: TS. QUÁCH XUÂN TRƯỞNG




THÁI NGUYÊN, NĂM 2026

LỜI CẢM ƠN
Trong thời gian thực hiện đồ án tốt nghiệp, em đã nhận được sự quan tâm và tạo điều kiện từ thầy cô cùng các bạn bè xung quanh. Đây là nguồn động lực giúp em hoàn thành đề tài của mình.
Em xin gửi lời cảm ơn chân thành đến thầy Quách Xuân Trưởng – giảng viên hướng dẫn đã đồng hành và hỗ trợ em trong suốt thời gian thực hiện đồ án.
Em cũng xin trân trọng cảm ơn Ban Giám hiệu và toàn thể giảng viên Trường Đại học Công nghệ Thông tin và Truyền thông Thái Nguyên đã tạo điều kiện thuận lợi trong suốt quá trình học tập. Những kiến thức được truyền đạt đã trở thành nền tảng quan trọng giúp em thực hiện đồ án này.
Bên cạnh đó, em cảm ơn các bạn bè đã hỗ trợ, chia sẻ tài liệu và đồng hành cùng em trong suốt quá trình nghiên cứu và hoàn thiện đề tài.
Do kinh nghiệm ít nên là đồ án không tránh khỏi những thiếu sót. Em rất mong nhận được những ý kiến đóng góp từ các thầy, các cô để đề tài được hoàn thiện hơn.
Em xin chân thành cảm ơn!


Trân trọng,


Ngô Gia Quyến


LỜI CAM ĐOAN
Em xin cam đoan đồ án tốt nghiệp với đề tài "Ứng dụng thiết bị IoT xây dựng hệ thống quản lý thiết bị cho trạm rửa xe tự phục vụ" là công trình do bản thân em trực tiếp tham gia nghiên cứu, xây dựng và triển khai. Hệ thống phần mềm, firmware và các kết quả được trình bày trong đồ án là thành quả từ quá trình tự thực hành thực tế của cá nhân em, có sự định hướng của giảng viên hướng dẫn.
Em cam kết rằng phần mã nguồn, thiết kế cơ sở dữ liệu và các giải pháp kỹ thuật được đề xuất trong đồ án này là do em tự xây dựng, thể hiện sự hiểu biết và nỗ lực của cá nhân em trong suốt quá trình thực hiện đề tài.
Trong trường hợp có bất kỳ sai phạm nào được phát hiện, em xin hoàn toàn chịu trách nhiệm và chấp nhận các hình thức xử lý kỷ luật theo quy định của Trường Đại học Công nghệ Thông tin và Truyền thông Thái Nguyên – Đại học Thái Nguyên.

Trân trọng,


Ngô Gia Quyến


MỤC LỤC

LỜI CẢM ƠN	i
LỜI CAM ĐOAN	ii
MỤC LỤC	iii
DANH MỤC HÌNH ẢNH	vi
DANH MỤC BẢNG	viii
CHƯƠNG 1. CƠ SỞ LÝ THUYẾT.	1
1.1. Tổng quan về ngôn ngữ lập trình JavaScript.	1
1.1.1. Khái niệm và đặc điểm của JavaScript.	1
1.1.2. Sự ra đời của TypeScript (TS).	2
1.1.3. Các đặc tính kỹ thuật nổi bật của TypeScript.	3
1.1.4. So sánh JavaScript và TypeScript trong phát triển dự án lớn.	3
1.2. Thư viện ReactJS và Thuật toán Virtual DOM chuyên sâu .	4
1.2.1. Giới thiệu về thư viện ReactJS.	4
1.2.2. Kiến trúc thành phần của ReactJS (Component).	4
1.2.3. Quản lý luồng dữ liệu (Statevà Props).	5
1.3. Framework Next.js và Các phương thức Rendering tiên tiến.	6
1.3.1. Giới thiệu về Framework Next.js.	6
1.3.2. Server-Side Rendering (SSR) và Lợi ích SEO.	6
1.4. Giao thức giao tiếp RESTful API	7
1.5. Công nghệ IoT và Vi điều khiển ESP32.	8
1.6. Hệ quản trị Cơ sở dữ liệu (MySQL & Prisma ORM).	9
1.6.1. Hệ quản trị cơ sở dữ liệu MySQL.	9
1.6.2. Prisma ORM và lợi ích trong phát triển hệ thống.	9
1.7. Công nghệ Thanh toán và Giải pháp SePay tự động.	10
1.7.1. QR Dynamic và Chuẩn VietQR (NAPAS 247).	10
1.7.2. Giải pháp SePay và Cơ chế Webhook tự động hóa.	10
CHƯƠNG 2. KHẢO SÁT VÀ THIẾT KẾ HỆ THỐNG	13
2.1. Khảo sát nhu cầu thông qua phỏng vấn doanh nghiệp vận tải	13
2.1.1. Những điểm nghẽn trong phương thức vận hành hiện tại	13
2.1.2. Cơ hội tích hợp tiện ích IoT tại hệ thống trạm sạc xe điện	13
2.1.3. Định hướng phát triển hệ thống ACW-SRS	14
2.2. Giới thiệu hệ thống	14
2.2.1. Giới thiệu về hệ thống quản lý thiết bị cho trạm rửa xe tự phục vụ (ACW-SRS)	14
2.2.2. Giới thiệu hệ thống	15
2.2.3. Mô tả bài toán	16
2.3. Yêu cầu về hệ thống.	16
2.3.1. Yêu cầu chức năng của hệ thống	16
2.3.2. Yêu cầu phi chức năng	17
2.4. Sơ đồ Use Case.	18
2.5. Thiết kế chi tiết từng chức năng	19
2.5.1. Chức năng Đăng nhập	19
2.5.2. Xem thông tin người thuê.	21
2.5.3. Thêm người thuê.	23
2.5.4. Sửa người thuê.	25
2.5.5. Chức năng Xóa người thuê.	27
2.5.6. Chức năng Xem doanh thu.	29
2.5.7. Chức năng Gửi báo cáo doanh thu.	31
2.5.8. Chức năng Xem giao dịch.	33
2.5.9. Chức năng Xuất file thống kê.	35
2.5.10. Chức năng Xem thiết bị.	37
2.5.11. Thêm thiết bị.	39
2.5.12. Sửa cấu hình thiết bị.	41
2.5.13. Xóa thiết bị.	43
2.5.14. Chức năng Thanh toán.	45
2.5.15. Đăng ký hệ thống.	47
2.5.16. Chức năng Gửi trạng thái	49
2.5.17. Chức năng Nhận lệnh điều khiển.	51
2.6. Biểu đồ lớp.	53
CHƯƠNG 3. TRIỂN KHAI VÀ XÂY DỰNG GIAO DIỆN HỆ THỐNG	54
3.1. Môi trường và công cụ phát triển	54
3.2. Nguyên lý xây dựng giao diện (UI/UX)	54
3.3. Cấu hình triển khai máy chủ (Deployment)	54
3.4. Trang Đăng nhập.	55
3.5. Trang Quên mật khẩu.	56
3.6. Trang dashboard	57
3.7. Trang Quản lý Người thuê (Tenant).	59
3.8. Trang Thêm mới và Chỉnh sửa Người thuê.	60
3.9. Trang Quản lý Thiết bị (IoT ESP32).	61
3.10. Giao diện Quản lý Thiết bị IoT (Dành cho Chủ trạm)	62
3.11. Giao diện Cấu hình và Tinh chỉnh tham số Thiết bị	63
3.12. Giao diện Quản lý Lịch sử Giao dịch	63
3.13. Giao diện Cấu hình Hệ thống Thanh toán	64
3.14. Trang Xem Doanh thu và Giao dịch.	65
KẾT LUẬN	67
TÀI LIỆU THAM KHẢO	68
NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN	70






DANH MỤC HÌNH ẢNH

Hình 1.1: Logo ngôn ngữ TypeScript.	2
Hình 1.2: Sơ đồ cấu trúc các Component của ứng dụng Frontend.	5
Hình 1.3: Sơ đồ mô tả luồng xử lý của SSR (Server-Side Rendering).	6
Hình 1.4: Sơ đồ chi tiết các chân chức năng GPIO trên bo mạch ESP32 chuẩn.	8
Hình 1.5: Sơ đồ luồng hoạt động của giải pháp thanh toán trung gian SePay	11
Hình 2.1: Sơ đồ Use Case chi tiết hệ thống.	18
Hình 2.2: Biểu đồ hoạt động chức năng Đăng nhập.	20
Hình 2.3: Biểu đồ trình tự chức năng Đăng nhập	20
Hình 2.4: Biểu đồ hoạt động chức năng Xem thông tin người thuê.	22
Hình 2.5: Biểu đồ trình tự chức năng Xem thông tin người thuê	22
Hình 2.6: Biểu đồ hoạt động chức năng Thêm người thuê.	24
Hình 2.7: Biểu đồ trình tự chức năng Thêm người thuê.	24
Hình 2.8: Biểu đồ hoạt động chức năng Sửa người thuê	26
Hình 2.9: Biểu đồ trình tự chức năng Sửa người thuê.	26
Hình 2.10: Biểu đồ hoạt động chức năng Xóa người thuê.	28
Hình 2.11: Biểu đồ trình tự chức năng Xóa người thuê.	28
Hình 2.12: Biểu đồ hoạt động chức năng Xem doanh thu.	30
Hình 2.13: Biểu đồ trình tự chức năng Xem doanh thu.	30
Hình 2.14: Biểu đồ hoạt động chức năng Gửi báo cáo doanh thu.	32
Hình 2.15: Biểu đồ trình tự chức năng Gửi báo cáo doanh thu.	32
Hình 2.16: Biểu đồ hoạt động chức năng Xem giao dịch.	34
Hình 2.17: Biểu đồ trình tự chức năng Xem giao dịch.	34
Hình 2.18: Biểu đồ hoạt động chức năng Xuất file thống kê.	36
Hình 2.19: Biểu đồ trình tự chức năng Xuất file thống kê.	36
Hình 2.20: Biểu đồ hoạt động chức năng Xem thiết bị.	38
Hình 2.21: Biểu đồ trình tự chức năng Xem thiết bị.	38
Hình 2.22: Biểu đồ hoạt động chức năng Thêm thiết bị.	40
Hình 2.23: Biểu đồ trình tự chức năng Thêm thiết bị.	40
Hình 2.24: Biểu đồ hoạt động chức năng Sửa cấu hình thiết bị.	42
Hình 2.25: Biểu đồ trình tự chức năng Sửa cấu hình thiết bị.	42
Hình 2.26: Biểu đồ hoạt động chức năng Xóa thiết bị.	44
Hình 2.27: Biểu đồ trình tự chức năng Xóa thiết bị.	44
Hình 2.28: Biểu đồ hoạt động chức năng Thanh toán.	46
Hình 2.29: Biểu đồ trình tự chức năng Thanh toán.	46
Hình 2.30: Biểu đồ hoạt động chức năng Đăng ký hệ thống.	48
Hình 2.31: Biểu đồ trình tự chức năng Đăng ký hệ thống.	48
Hình 2.32: Biểu đồ hoạt động chức năng Gửi trạng thái.	50
Hình 2.33: Biểu đồ trình tự chức năng Gửi trạng thái.	50
Hình 2.34: Biểu đồ hoạt động chức năng Nhận lệnh điều khiển	52
Hình 2.35: Biểu đồ trình tự chức năng Nhận lệnh điều khiển	52
Hình 2.36: Biểu đồ lớp.	53
Hình 3.1: Trang đăng nhập.	55
Hình 3.2: Thông báo lỗi khi đăng nhập.	56
Hình 3.3: Form yêu cầu lấy lại mật khẩu.	57
Hình 3.4: Nhập mã xác thực để đổi mật khẩu.	57
Hình 3.5: Giao diện Tổng quan Bảng điều khiển dành cho Quản trị viên cấp cao	58
Hình 3.6: Giao diện Tổng quan Bảng điều khiển dành cho Chủ trạm	59
Hình 3.7: Trang danh sách quản lý người thuê.	60
Hình 3.8: Form thêm mới người thuê.	61
Hình 3.9: Trang quản lý trạng thái thiết bị.	61
Hình 3.10: Giao diện Quản lý danh sách và trạng thái thiết bị phần cứng của Chủ trạm	62
Hình 3.11: Giao diện thiết lập thông số vận hành và tích hợp thanh toán cho thiết bị IoT	63
Hình 3.12: Giao diện theo dõi lịch sử thanh toán và đối soát giao dịch	64
Hình 3.13: Giao diện thiết lập tham số tích hợp thanh toán tự động SePay	65
Hình 3.14: Trang thống kê doanh thu và giao dịch.	66





DANH MỤC BẢNG

Bảng 2.1: Đặc tả chức năng đăng nhập	19
Bảng 2.2: Đặc tả chức năng Xem thông tin người thuê	21
Bảng 2.3: Đặc tả chức năng Thêm thông tin người thuê	23
Bảng 2.4: Đặc tả chức năng Sửa người thuê.	25
Bảng 2.5: Đặc tả chức năng Xóa người thuê	27
Bảng 2.6: Đặc tả chức năng Xem doanh thu.	29
Bảng 2.7: Đặc tả chức năng Gửi báo cáo doanh thu	31
Bảng 2.8: Đặc tả chức năng Xem giao dịch	33
Bảng 2.9: Đặc tả chức năng Xuất file thống kê.	35
Bảng 2.10: Đặc tả chức năng Xem thiết bị.	37
Bảng 2.11: Đặc tả chức năng Thêm thiết bị	39
Bảng 2.12: Đặc tả chức năng Sửa cấu hình thiết bị.	41
Bảng 2.13: Đặc tả chức năng Xóa thiết bị	43
Bảng 2.14: Đặc tả chức năng Thanh toán	45
Bảng 2.15:  Đặc tả chức năng Đăng ký hệ thống.	47
Bảng 2.16: Đặc tả chức năng Gửi trạng thái	49
Bảng 2.17: Đặc tả chức năng Nhận lệnh điều khiển	51




CHƯƠNG 1.CƠ SỞ LÝ THUYẾT.
1.1.Tổng quan về ngôn ngữ lập trình JavaScript.
1.1.1.Khái niệm và đặc điểm của JavaScript.
JavaScript là ngôn ngữ lập trình thường được sử dụng khi phát triển website. Ngôn ngữ này ra đời vào những năm 1990 nhằm tăng khả năng tương tác cho các trang web và dần trở thành công nghệ quan trọng trong lập trình hiện đại.
Hiện nay, JavaScript được ứng dụng ở cả Frontend và Backend nhờ khả năng hoạt động linh hoạt trên nhiều nền tảng khác nhau.
 Đặc điểm của JavaScript:
+Cú pháp tối giản, thân thiện và dễ tiếp cận: JavaScript sở hữu cấu trúc mã nguồn tường minh, chịu ảnh hưởng lớn từ ngôn ngữ C nên rất trực quan đối với người mới bắt đầu.
+Đa mô hình lập trình, tối ưu hóa hướng đối tượng và xử lý bất đồng bộ: Không chỉ dừng lại ở một ngôn ngữ kịch bản đơn giản, JavaScript là một ngôn ngữ đa mô hình (multi-paradigm). Nó hỗ trợ mạnh mẽ lập trình hướng đối tượng (OOP) dựa trên cơ chế Prototype (và cú pháp class hiện đại), kết hợp linh hoạt với lập trình hàm (Functional Programming). 
+Nền tảng kiến tạo giao diện web tương tác động cao: JavaScript là "linh hồn" tạo nên sự sống động cho thế giới Web. Bằng cách can thiệp và thao tác trực tiếp vào mô hình tài liệu DOM (Document Object Model), ngôn ngữ này cho phép thay đổi nội dung, cấu trúc và định dạng trang web theo thời gian thực dựa trên hành vi của người dùng. 
 Vai trò của Node.js:
+Nền tảng tối ưu cho các ứng dụng Server-side hiệu năng cao, thời gian thực: Node.js thay đổi tư duy kiến trúc máy chủ truyền thống bằng cách áp dụng mô hình Kiến trúc hướng sự kiện (Event-driven) và Cơ chế I/O không chặn (Non-blocking I/O) dựa trên một luồng duy nhất (Single-threaded Event Loop). Thay vì tạo ra một luồng mới cho mỗi yêu cầu từ người dùng (gây tốn tài nguyên phần cứng), Node.js xử lý hàng ngàn kết nối đồng thời với mức tiêu hao bộ nhớ cực thấp. Đặc điểm này biến Node.js thành lựa chọn tối ưu hàng đầu để xây dựng các hệ thống API (RESTful, GraphQL) và các ứng dụng trao đổi dữ liệu thời gian thực (Real-time) như hệ thống chat, trò chơi trực tuyến, video streaming hay các nền tảng IoT.
+Chuẩn hóa ngôn ngữ toàn diện (Full-stack JavaScript), tối ưu hóa quy trình vận hành: Trước khi Node.js ra đời, một dự án web bắt buộc phải chia tách nhân sự: Frontend viết bằng JavaScript, còn Backend sử dụng PHP, Java hay Python. Node.js xóa bỏ rào cản này bằng cách kiến tạo xu hướng Full-stack JavaScript.
1.1.2.Sự ra đời của TypeScript (TS).
TypeScript là ngôn ngữ lập trình mã nguồn mở do Microsoft phát triển. Về bản chất, nó được định nghĩa là một "superset" của JavaScript, cung cấp hệ thống định kiểu tĩnh (Static Typing) mà JavaScript thuần túy còn thiếu. TypeScript không thay thế JavaScript mà cung cấp thêm một lớp bảo vệ vững chắc, giúp quản lý mã nguồn thống nhất hơn.

Hình 1.1: Logo ngôn ngữ TypeScript.
 TypeScript hỗ trợ phát triển các dự án quy mô lớn: 
+	Cho phép kiểm tra lỗi trong quá trình biên dịch trước khi chương trình được thực thi. 
+	Tăng khả năng phối hợp giữa nhiều lập trình viên và giúp việc bảo trì hệ thống thuận tiện hơn. 
Cơ chế biên dịch và khả năng tương thích: 
+	Mã nguồn TypeScript sẽ được chuyển thành mã JavaScript để trình duyệt có thể thực thi câu lệnh. 
+	Cung cấp khả năng sử dụng các tính năng mới của ECMAScript nhưng vẫn duy trì tính tương thích trên nhiều môi trường khác nhau.
1.1.3.Các đặc tính kỹ thuật nổi bật của TypeScript.
TypeScript được xây dựng nhằm mở rộng khả năng của JavaScript thông qua việc bổ sung nhiều cơ chế hỗ trợ kiểm soát mã nguồn và phát triển phần mềm hiệu quả hơn. Một số đặc điểm tiêu biểu của TypeScript gồm:
+Hệ thống kiểu dữ liệu (Type System): Cho phép khai báo kiểu rõ ràng cho biến, tham số và giá trị trả về của hàm. Các kiểu dữ liệu thường dùng gồm: string, number, boolean, array, enum, tuple và any. Việc xác định kiểu giúp hạn chế lỗi trong quá trình phát triển và tăng độ ổn định cho chương trình. 
+Interfaces và Type Aliases: Hỗ trợ mô tả cấu trúc dữ liệu và định nghĩa khuôn mẫu cho các đối tượng trong hệ thống. Nhờ đó mã nguồn được tổ chức chặt chẽ và dễ dàng hơn hơn khi mở rộng dự án. 
+Lập trình hướng đối tượng (OOP): TypeScript hỗ trợ đầy đủ các thành phần của lập trình hướng đối tượng như Class, Inheritance, Interface và Encapsulation thông qua các phạm vi truy cập như public, private và protected. 
1.1.4.So sánh JavaScript và TypeScript trong phát triển dự án lớn.
JavaScript có ưu điểm về tính linh hoạt và dễ tiếp cận hơn khi mới học. Tuy nhiên, khi sử dụng ở các hệ thống phức tạp, việc thiếu cơ chế kiểm soát kiểu dữ liệu rõ ràng có thể làm tăng nguy cơ phát sinh lỗi trong quá trình phát triển.
1. Cơ chế phát hiện lỗi sớm và tối ưu hóa vận hành
JavaScript vận hành theo cơ chế thông dịch, nghĩa là mã nguồn chỉ được kiểm tra khi chương trình thực sự chạy trên môi trường thực tế (Runtime). Điều này dễ dẫn đến rủi ro sót lỗi ẩn, gây sập hệ thống bất ngờ khi người dùng cuối tương tác. Trong khi đó, TypeScript sở hữu trình biên dịch mạnh mẽ đóng vai trò như một màng lọc bảo vệ, giúp rà soát toàn bộ cú pháp và cấu trúc dữ liệu ngay trong quá trình phát triển (Compile-time). Nhờ tính năng khai báo kiểu dữ liệu nghiêm ngặt, mọi xung đột hệ thống hay sai sót logic cơ bản đều bị chặn đứng trước khi mã nguồn được đóng gói và triển khai.
2. Nâng cao trải nghiệm lập trình và tối ưu hóa hiệu suất làm việc nhóm
Nhờ hệ thống kiểu dữ liệu tường minh, TypeScript cung cấp cho các trình soạn thảo mã nguồn (như VS Code) nền tảng dữ liệu vững chắc để kích hoạt các tính năng thông minh như IntelliSense, tự động gợi ý mã (Auto-complete) và điều hướng nhanh cấu trúc thư mục. Lập trình viên có thể nắm bắt ngay thông số của các hàm hoặc API mà không cần tốn thời gian lật mở lại tài liệu gốc. Đặc biệt trong môi trường làm việc nhóm, các ràng buộc chặt chẽ của TypeScript đóng vai trò như một bản tài liệu sống, giúp giảm thiểu tối đa các hiểu lầm khi tích hợp mã nguồn giữa các thành viên và đẩy nhanh tiến độ review code.
3. Kiến trúc mở rộng và khả năng duy trì hệ thống dài hạn
Khi một dự án phần mềm dịch chuyển sang quy mô lớn với hàng trăm nghìn dòng code, JavaScript rất dễ rơi vào tình trạng mất kiểm soát do cấu trúc quá tự do. TypeScript giải quyết triệt để bài toán này bằng cách áp dụng các nguyên lý lập trình hướng đối tượng (OOP) nâng cao như Interface, Namespace và Generics, giúp module hóa hệ thống một cách khoa học. Việc phân tách tường minh các lớp dữ liệu và hành vi không chỉ giữ cho kiến trúc tổng thể luôn đồng nhất, mạch lạc mà còn giúp quá trình tái cấu trúc mã nguồn (Refactoring) trở nên an toàn hơn, biến TypeScript thành lựa chọn chiến lược cho các sản phẩm công nghệ dài hạn.
1.2.Thư viện ReactJS và Thuật toán Virtual DOM chuyên sâu .
1.2.1.Giới thiệu về thư viện ReactJS.
ReactJS là một thư viện của JavaScript được tạo ra bởi Facebook. Trước khi React ra đời, việc quản lý giao diện web dựa trên việc thay đổi trực tiếp cây DOM là một thách thức lớn về hiệu năng. React ra đời với triết lý hoàn toàn mới, tập trung vào lớp hiển thị (View) và mô hình thành phần (Component-based). Nó giúp xây dựng các ứng dụng web với dữ liệu thay đổi liên tục một cách hiệu quả, minh bạch và dễ bảo trì hơn rất nhiều.
Triết lý Declarative (Lập trình khai báo): 
+Lập trình viên chỉ cần mô tả trạng thái mong muốn của giao diện người dùng.
+React sẽ tự động quản lý việc cập nhật và render lại các thành phần tương ứng.
Cú pháp JSX (JavaScript XML): 
+Kết hợp sức mạnh của JavaScript với sự trực quan của cấu trúc HTML.
+Giúp mã nguồn giao diện trở nên mạch lạc, dễ đọc và dễ gỡ lỗi hơn.
Luồng dữ liệu một chiều (Unidirectional Data Flow): 
+Dữ liệu luôn được truyền từ cha xuống con thông qua các thuộc tính (Props).
+Giúp kiểm soát luồng dữ liệu minh bạch và hạn chế các lỗi logic phát sinh.
1.2.2.Kiến trúc thành phần của ReactJS (Component).
Kiến trúc của ReactJS xoay quanh khái niệm Component, đóng vai trò như các thành phần của ứng dụng:
+Tính đóng gói (Encapsulation): Mỗi thành phần tự quản lý trạng thái riêng, giúp mã nguồn trở nên sạch sẽ và dễ quản lý.
+Tính tái sử dụng (Reusability): Các component của giao diện có thể được đóng gói và sử dụng lại ở những vị trí khác nhau trong ứng dụng, giúp giảm thiểu trùng lặp mã nguồn.

Hình 1.2: Sơ đồ cấu trúc các Component của ứng dụng Frontend.
1.2.3.Quản lý luồng dữ liệu (Statevà Props).
Props (Properties): Là các thuộc tính được truyền từ thành phần cha xuống tới thành phần con. Props là dữ liệu chỉ đọc (Immutable), giúp cho luồng của hệ thống minh bạch.
State: Là các biến lưu thông tin của Component, có khả năng thay đổi theo thời gian dựa trên các thao tác của người dùng trên trình duyệt hoặc phản hồi từ hệ thống. Khi State thay đổi thì React sẽ tự tiến hành cập nhật giao diện (Re-render).
1.3.Framework Next.js và Các phương thức Rendering tiên tiến.
1.3.1.Giới thiệu về Framework Next.js.
Next.js là một framework dựa trên React, cung cấp các tính năng cần thiết để xây dựng các ứng dụng web sẵn sàng cho sản xuất (Production-ready). Các tính năng cốt lõi bao gồm:
Hệ thống Routing (File-based Routing): Tự động tạo ra các đường dẫn dựa trên cấu trúc thư mục và tệp tin, giúp quản lý cấu trúc trang web một cách minh bạch và dễ dàng mở rộng.
Tối ưu hóa tài nguyên (Optimization): Hỗ trợ tự động tối ưu hóa hình ảnh (Image), phông chữ (Fonts) và các đoạn mã script bên thứ ba để đảm bảo tốc độ tải trang nhanh nhất và tối ưu hóa trải nghiệm của người dùng.
Hỗ trợ TypeScript: Tích hợp sẵn TypeScript với các cấu hình tối ưu, giúp phát triển mã nguồn nhanh chóng và hiệu quả thông qua hệ thống kiểu tĩnh.
1.3.2.Server-Side Rendering (SSR) và Lợi ích SEO.
Server-Side Rendering (SSR) là cơ chế kết xuất giao diện ngay trên máy chủ trước khi gửi nội dung HTML hoàn chỉnh đến trình duyệt người dùng. Nhờ đó, trang web có thể hiển thị dữ liệu nhanh hơn và cải thiện khả năng truy cập nội dung đối với các công cụ tìm kiếm.
Việc áp dụng SSR mang lại nhiều lợi ích như:
1.Tăng tốc độ hiển thị nội dung ban đầu của trang Web.
2.Hỗ trợ các công cụ tìm kiếm dễ dàng thu thập và lập chỉ mục dữ liệu.
3.Cải thiện SEO trên các công cụ tìm kiếm và tối ưu trải nghiệm người dùng

Hình 1.3: Sơ đồ mô tả luồng xử lý của SSR (Server-Side Rendering).
Sơ đồ trên trình bày chu trình vòng đời kết xuất giao diện của một ứng dụng web áp dụng kiến trúc Server-Side Rendering (SSR). Quá trình này được thiết kế nhằm giảm thiểu tối đa thời gian chờ đợi (First Contentful Paint) và tối ưu hóa khả năng lập chỉ mục của các công cụ tìm kiếm. Luồng hoạt động được chia thành các giai đoạn tuần tự như sau:
+Giai đoạn 1: Khởi tạo yêu cầu truy xuất (Request): Quá trình bắt đầu khi trình duyệt (Client) gửi yêu cầu giao thức HTTP tới máy chủ để truy cập vào một tài nguyên hoặc đường dẫn cụ thể của ứng dụng.
+Giai đoạn 2: Thu thập dữ liệu và Kết xuất tại máy chủ (Fetch & Render): Khác với mô hình Client-Side Rendering truyền thống (chỉ trả về một khung HTML rỗng), máy chủ ở cơ chế SSR sẽ chủ động thực hiện các truy vấn đến cơ sở dữ liệu hoặc API nội bộ. Sau khi gom đủ dữ liệu, máy chủ tiến hành biên dịch các React Component và kết xuất chúng thành một tệp tài liệu HTML hoàn chỉnh trước khi gửi qua môi trường mạng.
+Giai đoạn 3: Hiển thị nội dung tức thời (First Paint): Trình duyệt nhận được tệp HTML đã có sẵn nội dung văn bản và cấu trúc hiển thị. Ngay lập tức, trang web được phác họa lên màn hình, cho phép người dùng đọc và quan sát thông tin ngay cả khi quá trình xử lý mã nền (background scripts) chưa hoàn tất. Đặc điểm này mang lại lợi thế tuyệt đối cho kỹ thuật SEO.
+Giai đoạn 4: Quá trình Thủy hợp (Hydration / Event Attachment): Mặc dù nội dung trực quan đã xuất hiện, trang web lúc này vẫn chưa có khả năng tương tác động. Trình duyệt sẽ tiếp tục tải xuống các tệp tin JavaScript đi kèm. Lúc này, React sẽ tiến hành khởi tạo cây Virtual DOM và đính kèm các bộ lắng nghe sự kiện (Event Listeners) vào các phần tử HTML tĩnh hiện có trên trang.
+Giai đoạn 5: Trạng thái Tương tác hoàn chỉnh (Fully Interactive): Sau khi quá trình Thủy hợp kết thúc, ứng dụng web chuyển đổi liền mạch thành một Single Page Application (SPA) đúng nghĩa. Người dùng có thể thực hiện mọi thao tác tương tác mượt mà mà không cần phải tải lại trang ở các lần chuyển hướng tiếp theo.
Bên cạnh SSR, Next.js còn hỗ trợ Client-Side Rendering (CSR): dữ liệu được xử lý và hiển thị trực tiếp trên trình duyệt người dùng. Phương pháp này phù hợp với các ứng dụng yêu cầu khả năng tương tác cao hoặc cập nhật dữ liệu realtime.
1.4.Giao thức giao tiếp RESTful API
REST là viết tắt của “Representational State Transfer” là một kiểu kiến trúc phần mềm tiêu chuẩn chi phối cách thức các dịch vụ web giao tiếp với nhau qua môi trường Internet. Hệ thống tuân thủ REST (RESTful API) sử dụng giao thức HTTP/HTTPS làm phương tiện truyền tải thông điệp, thường định dạng dữ liệu dưới chuẩn JSON (JavaScript Object Notation).
Một hệ thống RESTful hoạt động dựa trên nguyên tắc phi trạng thái (Stateless), nghĩa là máy chủ không lưu trữ thông tin về phiên làm việc của máy khách giữa các yêu cầu. Mỗi luồng yêu cầu (Request) từ thiết bị ngoại vi hoặc trình duyệt gửi lên máy chủ đều phải chứa đầy đủ thông tin xác thực và ngữ cảnh để xử lý. Các phương thức HTTP cơ bản như GET (truy xuất), POST (tạo mới/gửi lệnh), PUT (cập nhật) và DELETE (xóa bỏ) được ánh xạ trực tiếp vào các hành động tương tác với tài nguyên hệ thống, tạo ra một chuẩn mực giao tiếp thống nhất giữa nền tảng web, cổng thanh toán trung gian và thiết bị vi điều khiển IoT.
1.5.Công nghệ IoT và Vi điều khiển ESP32.
ESP32 là một thiết bị phần cứng hiệu năng cao. Trên mạch tích hợp Wi-Fi và Bluetooth rất phù hợp cho các hệ thống Internet of Things (IoT). Trong những hệ thống yêu cầu sự tương tác chặt chẽ giữa thiết bị vật lý và chương trình điều khiển, dòng chip này mang đến một môi trường xử lý đáng tin cậy, nổi bật với tốc độ tính toán cao cùng các phương thức giao tiếp mạng đa dạng.

Hình 1.4: Sơ đồ chi tiết các chân chức năng GPIO trên bo mạch ESP32 chuẩn.
Một số ứng dụng thực tế phổ biến của ESP32:
+Nhà thông minh (Smart Home): Điều khiển đèn, điều hòa, rèm cửa tự động và các thiết bị khác thông qua Wi-Fi hoặc Bluetooth.
+Nông nghiệp thông minh (Smart Agriculture): Theo dõi độ ẩm đất, nhiệt độ, ánh sáng và có thể áp dụng tự động hóa hệ thống tưới tiêu, giúp tăng năng suất cây trồng.
+Hệ thống an ninh: Tích hợp với camera (như ESP32-CAM), cảm biến chuyển động và hệ thống báo động để bảo vệ nhà ở và văn phòng.
Vai trò trong hệ thống ACW-SRS: 
+Đóng vai trò là thiết bị thực thi (Actuator) tại các trạm rửa xe vật lý.
+Tiếp nhận lệnh điều khiển từ Server Next.js thông qua giao thức HTTP/HTTPS.
+Điều khiển các module Relay và liên tục gửi báo cáo trạng thái về trung tâm
1.6.Hệ quản trị Cơ sở dữ liệu (MySQL & Prisma ORM).
1.6.1.Hệ quản trị cơ sở dữ liệu MySQL.
Để xử lý và lưu trữ luồng thông tin có tính ràng buộc phức tạp, hệ thống sử dụng MySQL một trong những hệ quản trị cơ sở dữ liệu quan hệ (Relational Database Management System – RDBMS) mã nguồn mở được sử dụng phổ biến hiện nay. MySQL cho phép quản lý dữ liệu thông qua ngôn ngữ truy vấn SQL và tổ chức dữ liệu dưới dạng bảng có liên kết với nhau. MySQL được đánh giá cao nhờ khả năng hoạt động ổn định, tốc độ xử lý nhanh và phù hợp với nhiều quy mô hệ thống khác nhau. 
Trong dự án, MySQL được sử dụng để:
1. Lưu trữ thông tin người dùng và dữ liệu hệ thống. 
2. Quản lý các mối quan hệ giữa các bảng dữ liệu. 
3. Hỗ trợ truy vấn, thêm, sửa và xóa dữ liệu một cách hiệu quả. 
Nhờ khả năng tương thích tốt với Node.js và các framework phát triển Web hiện đại, MySQL trở thành lựa chọn phù hợp cho việc xây dựng và triển khai hệ thống ứng dụng Web.
1.6.2.Prisma ORM và lợi ích trong phát triển hệ thống.
Prisma là một bộ công cụ cơ sở dữ liệu hiện đại, giúp lập trình viên thao tác với dữ liệu một cách hiệu quả hơn thông qua:
+Tự động tạo mã (Auto-generated Client): Dựa trên sơ đồ dữ liệu (Schema), Prisma tự động tạo ra thư viện truy vấn mạnh mẽ, hỗ trợ đầy đủ TypeScript.
+Truy vấn an toàn (Type-safe Queries): Loại bỏ các lỗi cú pháp SQL và đảm bảo dữ liệu truy vấn luôn đúng kiểu, giúp giảm thiểu lỗi thời gian chạy (Runtime errors).
+Tính năng Migration: Hỗ trợ đồng bộ cấu trúc dữ liệu giữa cơ sở dữ liệu và mã nguồn thực tế một cách có kiểm soát.
Ví dụ về cách triển khai Prisma:
Prisma Schema (Định nghĩa dữ liệu):
model Station {
  uuid        Int      @id  @Default(Autoincrement())
  Station_name      String
  status    String   @default("OFFLINE")
  location  String?
  Created_At DateTime @default(now())
}
- Prisma Client (Truy vấn dữ liệu):
// Lấy danh sách tất cả các trạm đang hoạt động
const activeStations = await prisma.station.findMany({
  where: { status: "ONLINE" }
});
Việc sử dụng Prisma giúp loại bỏ các câu lệnh SQL thô (raw SQL) phức tạp, thay vào đó là các hàm gọi trực quan, giúp tăng tốc độ phát triển và giảm thiểu sai sót về logic dữ liệu.
1.7.Công nghệ Thanh toán và Giải pháp SePay tự động.
1.7.1.QR Dynamic và Chuẩn VietQR (NAPAS 247).
Trong hệ thống ACW-SRS, thanh toán phải diễn ra chính xác. Dự án sử dụng tiêu chuẩn VietQR để tạo ra các mã code QR động cho mỗi trạm. Khách hàng chỉ cần quét mã, mọi thông tin về số tài khoản, số tiền và nội dung chuyển khoản (Memo) sẽ được điền tự động.
1.7.2.Giải pháp SePay và Cơ chế Webhook tự động hóa.
SePay là giải pháp trung gian kết nối giữa ngân hàng và hệ thống phần mềm. Cơ chế Webhook cho phép SePay gửi thông tin giao dịch tự động cho Server Next.js ngay khi tài khoản ngân hàng nhận được tiền. 
SePay sẽ gửi tới server một request với phương thức là POST, có nội dung như sau:
{
    "id": 909,
    "gateway": "Vietabank",
    "transactionDate": "2022-06-21 12:07:50",
    "accountNumber": "0999888787",
    "content": "NGO GIA QUYEN chuyen tien",
    "transferType": "in",
    "transferAmount": 15000,
    "accumulated": 889998,
    "subAccount": null,
    "referenceCode": "ABC.92754",
    "description": "BCA"
}

Hình 1.5: Sơ đồ luồng hoạt động của giải pháp thanh toán trung gian SePay
Sơ đồ trên trình bày kiến trúc tích hợp và luồng luân chuyển dữ liệu tự động của dịch vụ thanh toán SePay. Hệ thống vận hành theo mô hình hướng sự kiện (Event-driven), bao gồm ba phân lớp xử lý rành mạch:
+Lớp tiếp nhận sự kiện (Nguồn phát dữ liệu): Nhóm bên trái thể hiện mạng lưới liên kết với hơn 15 ngân hàng lớn (như Viettinbank, MB, Techcombank,...). Bất cứ khi nào tài khoản thụ hưởng phát sinh giao dịch ghi có (nhận tiền), hệ thống ngân hàng sẽ tạo ra tín hiệu biến động số dư.
+Lớp trung gian phân tích (Lõi hệ thống SePay): Toàn bộ dữ liệu thô từ ngân hàng được tập trung về máy chủ SePay. Tại đây, công cụ giải mã sẽ tự động trích xuất, phân tích và chuẩn hóa các trường thông tin mang tính quyết định như: số tiền giao dịch, nội dung chuyển khoản (Memo) và mã tham chiếu duy nhất.
+Lớp phân phối và tích hợp (Điểm tiếp nhận cuối): Ở phía bên phải, sau khi dữ liệu đã được định dạng chuẩn hóa, SePay lập tức sử dụng công nghệ Webhooks hoặc RESTful API để đẩy (Push) thông tin đến các nền tảng ngoại vi.

CHƯƠNG 2.KHẢO SÁT VÀ THIẾT KẾ HỆ THỐNG
2.1.Khảo sát nhu cầu thông qua phỏng vấn doanh nghiệp vận tải
Để đảm bảo tính xác thực và bám sát nhu cầu của thị trường kinh doanh dịch vụ vận tải, thay vì thực hiện các biểu mẫu khảo sát đại trà thiếu tính chuyên sâu, đề tài đã tiến hành phỏng vấn trực tiếp bộ phận quản lý vận hành của một đơn vị kinh doanh taxi thuần điện (taxi xanh).
Kết quả trao đổi cho thấy những đặc thù riêng biệt của ngành: Phương tiện dịch vụ phải di chuyển liên tục, trung bình mỗi tháng một xe cần được vệ sinh ít nhất 4 lần. Đặc biệt, đại diện doanh nghiệp nhấn mạnh rằng tài xế không cần các dịch vụ chăm sóc nội thất cầu kỳ hay phủ bóng mất thời gian. Mục đích chính của họ chỉ là làm sạch nhanh phần ngoại thất (bụi bẩn, bùn đất bám trên thân vỏ) nhằm duy trì diện mạo chuyên nghiệp của hãng xe và có thể nhanh chóng quay lại ca làm việc.
2.1.1.Những điểm nghẽn trong phương thức vận hành hiện tại
Dưới lăng kính của doanh nghiệp quản lý đội xe, việc tiếp tục sử dụng các cơ sở rửa xe truyền thống đang bộc lộ nhiều điểm hạn chế, làm giảm hiệu suất khai thác của toàn hệ thống:
+ Gây lãng phí quỹ thời gian: Vào những khung giờ cao điểm, tài xế thường xuyên phải xếp hàng chờ đợi nhân viên thao tác. Việc xe phải nằm chờ quá lâu làm ảnh hưởng trực tiếp đến thời gian chạy cuốc, giảm thu nhập của tài xế và ảnh hưởng đến năng suất của cả hãng.
+ Khó khăn trong quản lý chi phí và khung giờ hoạt động: Các điểm rửa xe truyền thống thường giao dịch bằng tiền mặt hoặc chuyển khoản thủ công, dễ gây độ trễ trong đối soát chi phí giữa tài xế và công ty. Đồng thời, các cơ sở này chỉ hoạt động trong giờ hành chính, không thể đáp ứng nhu cầu xịt rửa nhanh vào ban đêm hay rạng sáng của các tài xế chạy ca đêm.
2.1.2.Cơ hội tích hợp tiện ích IoT tại hệ thống trạm sạc xe điện
Từ những bất cập trên, buổi phỏng vấn đã gợi mở một định hướng giải quyết bài toán tối ưu quỹ thời gian: Tận dụng khoảng thời gian sạc pin của xe điện. Thông thường, một chu kỳ sạc pin tại trạm sạc sẽ kéo dài từ 20 đến 30 phút. Đây là khoảng thời gian trống lý tưởng để tài xế kết hợp thực hiện các công việc chăm sóc phương tiện.
Việc đưa các module máy rửa xe tự phục vụ vào ngay bãi đỗ của trạm sạc là một bước đi chiến lược. Tài xế có thể tranh thủ tự xịt rửa ngoại thất xe trong lúc chờ nạp năng lượng. Mô hình này không chỉ giúp tối ưu hóa thời gian nghỉ của tài xế mà còn nâng cao hiệu suất khai thác mặt bằng cho các chủ trạm sạc. Cùng với đó, nền tảng vi điều khiển IoT (tiêu biểu là mạch ESP32) và mã QR động hoàn toàn đủ năng lực để tự động hóa khâu thanh toán và điều khiển máy bơm mà không cần tốn chi phí thuê nhân sự túc trực.
2.1.3.Định hướng phát triển hệ thống ACW-SRS
Từ những dữ liệu thu thập được qua quá trình phỏng vấn chuyên sâu, đề tài xác định việc xây dựng Hệ thống quản lý thiết bị cho trạm rửa xe tự phục vụ là hướng đi khả thi, đáp ứng trúng yêu cầu của doanh nghiệp. Hệ thống được thiết kế tập trung giải quyết các mục tiêu cốt lõi:
1. Số hóa và tự động hóa toàn diện: Cho phép tài xế tự chủ việc quét mã QR thanh toán và sử dụng máy. Hệ thống tự động đối soát luồng tiền qua Webhook và đóng ngắt rơ-le (Relay) qua giao thức mạng, loại bỏ hoàn toàn sự can thiệp của con người trong khâu vận hành.
2. Mô hình tích hợp trạm sạc linh hoạt: Cung cấp tiện ích xịt rửa ngoại thất nhanh chóng, chi phí thấp, khả năng hoạt động xuyên suốt 24/7, cực kỳ phù hợp để triển khai quy mô lớn tại các trạm sạc xe điện hiện hữu.
3. Phân quyền và quản lý độc lập (Multi-tenant): Cung cấp cho các đối tác (chủ trạm sạc, quản lý hãng xe) một hệ thống quản trị trực quan. Qua đó, họ có thể giám sát tình trạng online/offline của thiết bị máy bơm và thống kê dòng tiền doanh thu một cách minh bạch, chính xác theo thời gian thực.
2.2.Giới thiệu hệ thống
2.2.1.Giới thiệu về hệ thống quản lý thiết bị cho trạm rửa xe tự phục vụ (ACW-SRS)
ACW-SRS là viết tắt của Automatic Car Wash – Self-service System, có nghĩa là Hệ thống Rửa xe Tự động Tự phục vụ. Tên gọi phản ánh đúng bản chất của hệ thống: khách hàng chủ động thanh toán qua mã QR và sử dụng máy rửa xe  mà không cần bất kỳ hỗ trợ nào từ nhân viên, mọi thứ được tự động thông qua nền tảng web và thiết bị IoT.
ACW-SRS là một hệ thống rửa xe tự phục vụ thông minh, tích hợp giữa nền tảng web hiện đại (Next.js, React, TypeScript) và thiết bị phần cứng nhúng (ESP32), nhằm tự động hóa toàn bộ quy trình thanh toán và vận hành trạm rửa xe. Hệ thống được phát triển với mục tiêu loại bỏ sự can thiệp thủ công của người quản lý trong quá trình thanh toán và kích hoạt máy, từ đó giảm chi phí nhân sự, tăng tính minh bạch và nâng cao trải nghiệm của khách hàng.
ACW-SRS được xây dựng theo mô hình tự phục vụ (self-service) kết hợp Multi-tenant, trong đó khách hàng chủ động quét mã QR, thực hiện thanh toán và sử dụng máy rửa xe mà không cần nhân viên thu tiền hay vận hành trực tiếp. Đồng thời, nhiều chủ trạm (Tenant) độc lập sẽ cùng quản lý thiết bị rửa xe của riêng mình trên một nền tảng chung mà không ảnh hưởng lẫn nhau. Hệ thống sẽ có các tác vụ sau:
1.Quản lý trạm rửa xe và thiết bị IoT của trạm thông qua Dashboard web.
2.Tự động kích hoạt máy rửa xe khi hoàn tất thanh toán qua mã QR Dynamic (VietQR).
3.Giám sát trạng thái thiết bị IoT theo thời gian thực và nhận cảnh báo khi có sự cố.
4.Theo dõi doanh thu và lịch sử giao dịch một cách trực quan.
ACW-SRS cung cấp các tính năng cốt lõi giúp tối ưu hóa hoạt động kinh doanh dịch vụ rửa xe:
+Thanh toán tự động qua QR Dynamic: Khách hàng quét mã QR, thực hiện chuyển khoản ngân hàng; hệ thống tự động nhận biến động số dư qua Webhook SePay và kích hoạt máy mà không cần sự can thiệp con người.
+Giám sát IoT thời gian thực: Dashboard hiển thị trạng thái Online/Offline của thiết bị ESP32, thời gian còn lại của lượt sử dụng và các cảnh báo sự cố.
+Quản lý đa trạm (Multi-tenant): Mỗi chủ trạm có không gian quản lý riêng biệt, an toàn và được cô lập dữ liệu hoàn toàn.
+Thống kê doanh thu trực quan: Biểu đồ doanh thu theo ngày, tuần, tháng giúp chủ trạm quản lý được hiệu quả kinh doanh.
+Điều khiển thiết bị từ xa: Cho phép bật/tắt cưỡng bức thiết bị từ Dashboard trong trường hợp cần bảo trì.
2.2.2.Giới thiệu hệ thống
Dịch vụ rửa xe là một ngành dịch vụ phổ biến tại Việt Nam với hàng nghìn cơ sở hoạt động trên cả nước. Tuy nhiên, phần lớn các trạm rửa xe hiện nay vẫn theo cách truyền thống là thu tiền mặt. Mô hình vận hành này tồn tại nhiều hạn chế, bao gồm sự phụ thuộc vào nhân lực trực tiếp, nguy cơ thất thoát doanh thu do thiếu minh bạch và không có khả năng phát hiện sự cố thiết bị kịp thời.
Mục tiêu chính khi xây dựng hệ thống ACW-SRS là tạo ra một nền tảng quản lý thiết bị cho trạm rửa xe tự phục vụ toàn diện, giúp người dùng:
+Tự động hóa hoàn toàn quy trình thanh toán và kích hoạt thiết bị thông qua tích hợp cổng thanh toán SePay và giao tiếp HTTP với thiết bị ESP32.
+Giám sát hệ thống 24/7 với khả năng theo dõi trạng thái thiết bị IoT theo thời gian thực, nhận cảnh báo sự cố và điều khiển từ xa.
+Quản lý đa trạm linh hoạt theo mô hình Multi-tenant, đảm bảo cô lập dữ liệu tuyệt đối giữa các chủ trạm.
+Minh bạch hóa doanh thu thông qua thống kê chi tiết các giao dịch.
2.2.3.Mô tả bài toán
Nghiệp vụ:
Về phía khách hàng:  Khách hàng thanh toán qua mã QR được dán sẵn tại trạm, thực hiện chuyển khoản theo đúng nội dung có sẵn khi quét mã QR. Hệ thống tự động nhận biến động số dư, đối chiếu giao dịch và kích hoạt máy rửa xe mà không cần nhân viên can thiệp.
Về phía chủ trạm (Tenant):
+Đăng ký và đăng nhập: Admin sẽ tạo tài khoản và chủ trạm có thể đăng nhập vào hệ thống để quản lý các trạm của mình.
+Đổi mật khẩu / Quên mật khẩu: Chủ trạm có thể thay đổi mật khẩu hoặc lấy lại mật khẩu thông qua email.
+Quản lý trạm rửa xe: Thêm trạm mới bằng cách gán ID thiết bị ESP32, cấu hình đơn giá dịch vụ theo phút, chỉnh sửa thông tin hoặc tạm dừng hoạt động trạm.
+Giám sát và điều khiển IoT: Theo dõi trạng thái Online/Offline của thiết bị theo thời gian thực; điều khiển bật/tắt thiết bị từ Dashboard khi cần bảo trì; nhận cảnh báo khi thiết bị mất kết nối hoặc Relay gặp sự cố.
+Quản lý doanh thu: Xem thống kê doanh thu theo ngày, tuần, tháng cho từng trạm; xuất báo cáo lịch sử giao dịch; theo dõi biểu đồ tăng trưởng doanh thu.
Về phía quản trị viên (Admin):
+Đăng nhập hệ thống: Quản trị viên đăng nhập bằng tài khoản riêng có đặc quyền cao nhất.
+Quản lý tài khoản Tenant: Admin có thể xem danh sách, kích hoạt hoặc vô hiệu hóa tài khoản chủ trạm trên toàn hệ thống.
2.3.Yêu cầu về hệ thống.
2.3.1.Yêu cầu chức năng của hệ thống
Quản lý tài khoản: 
+Đăng nhập đổi mật khẩu, quên mật khẩu.
+Cập nhật thông tin chủ trạm.
Quản lý trạm rửa xe:
+Thêm trạm mới (Gán ID cho bộ ESP32).
+Cấu hình giá tiền thuê trạm theo phút.
+Chỉnh sửa thông tin trạm hoặc tạm dừng hoạt động trạm.
Giám sát & Điều khiển IoT:
+Theo dõi trạng thái Online/Offline của thiết bị ESP32 theo thời gian thực.
+Điều khiển bật/tắt cưỡng bức thiết bị từ Dashboard (trong trường hợp bảo trì).
+Nhận cảnh báo khi thiết bị mất kết nối hoặc Relay gặp sự cố.
Quản lý doanh thu:
+Xem thống kê doanh thu theo ngày, tuần, tháng cho từng trạm.
+Xuất báo cáo lịch sử giao dịch (thanh toán qua SePay).
+Biểu đồ trực quan hóa dữ liệu tăng trưởng doanh thu.
Thanh toán & Thuê máy:
+Quét mã QR Dynamic để thực hiện thanh toán tự động.
+Hệ thống tự động kích hoạt máy rửa xe sau khi nhận được tiền.
+Theo dõi tiến trình: Xem thời gian đếm ngược còn lại của lượt thuê trực tiếp trên giao diện web.
2.3.2.Yêu cầu phi chức năng
Bảo mật:
+Dữ liệu giữa các Tenant phải được cô lập hoàn toàn (Multi-tenancy isolation).
+Mã hóa mật khẩu người dùng.
+Đảm bảo an toàn cho các Webhook nhận biến động số dư từ ngân hàng.
Hiệu suất:
+Thời gian phản hồi từ lúc khách thanh toán đến khi máy kích hoạt (Relay đóng) phải dưới 5 giây.
+Giao diện Dashboard quản lý phải hoạt động mượt mà, phản hồi chuyển trang dưới 2 giây.
Độ tin cậy:
+Hệ thống hoạt động 24/7, có khả năng tự động khôi phục kết nối Wi-Fi cho ESP32 khi gặp sự cố mạng.
+Sao lưu cơ sở dữ liệu hàng ngày để đảm bảo an toàn dữ liệu doanh thu.

2.4.Sơ đồ Use Case.

Hình 2.1: Sơ đồ Use Case chi tiết hệ thống.


2.5.Thiết kế chi tiết từng chức năng
2.5.1.Chức năng Đăng nhập
Bảng 2.1: Đặc tả chức năng đăng nhập
Thông tin	Nội dung
Use Case	Đăng nhập
Mục đích	Xác thực thông tin người dùng để cho phép họ có thể truy cập vào các chức năng.
Mô tả	Người dùng đăng nhập vào ứng dụng bằng cách nhập thông tin định danh (Email) và mật khẩu hợp lệ.
Tác nhân	Admin, Người thuê
Điều kiện trước	Tác nhân đã có tài khoản trên hệ thống và đang ở trang đăng nhập.
Điều kiện sau	Hệ thống chuyển người dùng đến màn hình Dashboard quản trị tương ứng theo phân quyền.
Luồng sự kiện chính	1. Người dùng truy cập trang đăng nhập.
2. Web hiển thị form đăng nhập.
3. Nhập Email và mật khẩu.
4. Bấm nút đăng nhập.
5. Web gửi thông tin gọi API đăng nhập xuống Backend.
6. Backend nhận yêu cầu và đối chiếu với database (users table).
7. Backend trả về kết quả thành công kèm Access Token.
8. Web lưu Access Token vào bộ nhớ local và điều hướng tới trang quản lý.
Luồng sự kiện phụ	3.a: Sai định dạng
  3.a.1: Hệ thống hiển thị cảnh báo ngay trên form.
  3.a.2: Người dùng nhập lại thông tin.
6.a: Sai thông tin đăng nhập hoặc tài khoản bị khóa
  6.a.1: Backend trả về lỗi 401 Unauthorized.
  6.a.2: Web hiển thị thẻ báo lỗi "Tài khoản hoặc mật khẩu không chính xác".

Hình 2.2: Biểu đồ hoạt động chức năng Đăng nhập.

Hình 2.3: Biểu đồ trình tự chức năng Đăng nhập

2.5.2.Xem thông tin người thuê.
Bảng 2.2: Đặc tả chức năng Xem thông tin người thuê 
Thông tin	Nội dung
Use Case	Xem thông tin người thuê
Mục đích	Cho phép xem chi tiết thông tin từng đối tác, gói dịch vụ dự kiến.
Mô tả	Xem danh sách tổng quan và thông tin người thuê, thông tin hợp đồng
Tác nhân	Admin
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê.
Điều kiện sau	Admin xem được dữ liệu Tenant và chi tiết cấu hình (như hạn mức thiết bị, cấu hình thanh toán SePay).
Luồng sự kiện chính	1. Web gọi API lấy danh sách Tenant.
2. Backend Load dữ liệu trả về mảng danh sách.
3. Web hiển thị bảng các thông tin cơ bản: Tên, Email, Số điện thoại.
4. Admin chọn "Xem chi tiết".
5. Hệ thống hiển thị thông tin chuyên sâu: Số thiết bị tối đa, Tài khoản ngân hàng, Hạn đăng ký.
Luồng sự kiện phụ	5.a Không tìm thấy bất kỳ Tenant nào, trả về bảng rỗng và hiện "Chưa có người thuê".


Hình 2.4: Biểu đồ hoạt động chức năng Xem thông tin người thuê.

Hình 2.5: Biểu đồ trình tự chức năng Xem thông tin người thuê
2.5.3.Thêm người thuê.
Bảng 2.3: Đặc tả chức năng Thêm thông tin người thuê
Use Case	Thêm người thuê
Mục đích	Ghi danh một đối tác mới vào nền tảng.
Mô tả	Tạo một Tenant record mới với các cấu hình về gói dịch vụ.
Tác nhân	Admin
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Quản lý người thuê.
Điều kiện sau	Lập bản ghi mới trong bảng tenants và liên kết với tài khoản users tương ứng.
Luồng sự kiện chính	1. Admin bấm nút "Thêm mới".
2. Hệ thống hiển thị form nhập thông tin (Tên, Email, SĐT, Số thiết bị tối đa, Chu kỳ đăng ký hợp đồng).
3. Admin điền thông tin và bấm "Lưu".
4. Backend ghi dữ liệu vào bảng tenants.
5. Backend trả về thông báo tạo thành công.
6. Cập nhật lại giao diện danh sách.
Luồng sự kiện phụ	4.a: Email đã tồn tại
 4.a.1: Database báo lỗi Unique Constraint.
 4.a.2: Server báo lỗi "Email này đã được sử dụng".


Hình 2.6: Biểu đồ hoạt động chức năng Thêm người thuê.

Hình 2.7: Biểu đồ trình tự chức năng Thêm người thuê.
2.5.4.Sửa người thuê.
Bảng 2.4: Đặc tả chức năng Sửa người thuê.
Thông tin	Nội dung
Use Case	Sửa người thuê
Mục đích	Quản lý thay đổi trạng thái, gian hạn hoặc cài đặt webhook hỗ trợ thanh toán tự động.
Mô tả	Cho phép chỉnh sửa thông tin thông thường cũng như tích hợp API cấu hình thanh toán (Ví dụ cài đặt SePay webhook).
Tác nhân	Admin
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống, đang ở màn hình Quản lý người thuê và có ít nhất 1 người thuê đang tồn tại.
Điều kiện sau	Thông tin người thuê (bao gồm thiết lập thanh toán) được lưu lại.
Luồng sự kiện chính	1. Admin chọn người thuê cần sửa.
2. Hệ thống hiển thị form với dữ liệu cũ (Tên, cấu hình ngân hàng, Token thanh toán).
3. Admin điều chỉnh và bấm "Cập nhật".
4. Gọi API cập nhật xuống Backend.
5. Backend cập nhật Database và trả về thành công.
6. Web tải lại danh sách/báo cáo.
Luồng sự kiện phụ	5.a: Lỗi không tìm thấy bản ghi (Màn hình báo lỗi không tìm thấy người thuê).


Hình 2.8: Biểu đồ hoạt động chức năng Sửa người thuê


Hình 2.9: Biểu đồ trình tự chức năng Sửa người thuê.
2.5.5.Chức năng Xóa người thuê.
Bảng 2.5: Đặc tả chức năng Xóa người thuê
Thông tin	Nội dung
Use Case	Xóa người thuê
Mục đích	Tiêu hủy dữ liệu những đối tác ngừng hợp đồng.
Mô tả	Xóa bỏ một Tenant, kéo theo các Thiết bị và Người dùng phụ thuộc cũng sẽ bị giải phóng.
Tác nhân	Admin
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang thao tác trên bảng Người thuê.
Điều kiện sau	Tenant bị đánh dấu vô hiệu hóa hoặc bị xóa khỏi DB.
Luồng sự kiện chính	1. Admin nhấn chọn "Xóa".
2. Hộp thoại cảnh báo xuất hiện.
3. Admin xác nhận thao tác.
4. Backend tiến hành chạy lệnh Xóa (Cascade/Soft Delete) Tenant.
5. Đóng hộp thoại và refresh UI danh sách.
Luồng sự kiện phụ	3.a: Admin hủy thao tác (Quay lại bước trước, tắt hộp thoại).


Hình 2.10: Biểu đồ hoạt động chức năng Xóa người thuê.

Hình 2.11: Biểu đồ trình tự chức năng Xóa người thuê.

2.5.6.Chức năng Xem doanh thu.
Bảng 2.6: Đặc tả chức năng Xem doanh thu.
Thông tin	Nội dung
Use Case	Xem doanh thu
Mục đích	Xác định lãi/lỗ thông qua báo cáo dạng biểu đồ và thẻ tổng kết.
Mô tả	Báo cáo tài chính cho nền tảng (Admin) hoặc riêng thiết bị của mình (Tenant).
Tác nhân	Admin, Người thuê
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Doanh thu.
Điều kiện sau	Hiển thị bảng tổng kết hoặc biểu đồ theo thời gian.
Luồng sự kiện chính	1. Người dùng chọn phạm vi ngày tháng cần lấy dữ liệu.
2. Gửi API request Report tổng hợp.
3. Backend duyệt qua bảng transactions có status completed, tổng hợp và nhóm số liệu.
4. Web tiếp nhận dữ liệu render lên các thành phần đồ họa (Bar Chart/Thẻ tổng kết).
Luồng sự kiện phụ	3.a: Giai đoạn không có thay đổi giao dịch (Hiển thị 0đ và chart phẳng)


Hình 2.12: Biểu đồ hoạt động chức năng Xem doanh thu.

Hình 2.13: Biểu đồ trình tự chức năng Xem doanh thu.
2.5.7.Chức năng Gửi báo cáo doanh thu.
Bảng 2.7: Đặc tả chức năng Gửi báo cáo doanh thu
Thông tin	Nội dung
Use Case	Gửi báo cáo doanh thu
Mục đích	Gửi thông tin tổng kết doanh thu định kỳ qua email.
Mô tả	Trích xuất báo cáo doanh thu dưới dạng PDF/Excel và tự động gửi tới email chỉ định.
Tác nhân	Admin, Tenant
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Doanh thu.
Điều kiện sau	Email chứa báo cáo được gửi đi thành công.
Luồng sự kiện chính	1. Admin bấm nút "Gửi báo cáo".
2. Hệ thống hiển thị popup chọn kỳ báo cáo và email nhận.
3. Admin điền thông tin và bấm "Gửi".
4. Backend tạo file tổng hợp và sử dụng Mail Service để gửi tin.
5. Backend trả về trạng thái gửi thành công.
6. Web thông báo "Báo cáo đã gửi thành công".
Luồng sự kiện phụ	4.a: Lỗi dịch vụ gửi Email (Mail server out/Timeout)
   4.a.1: Backend bắt lỗi gửi mail thất bại.
   4.a.2: Trả về thông báo "Lỗi khi gửi email, vui lòng xem lại cấu hình máy chủ".


Hình 2.14: Biểu đồ hoạt động chức năng Gửi báo cáo doanh thu.

Hình 2.15: Biểu đồ trình tự chức năng Gửi báo cáo doanh thu.
2.5.8.Chức năng Xem giao dịch.
Bảng 2.8: Đặc tả chức năng Xem giao dịch
Thông tin	Nội dung
Use Case	Xem giao dịch
Mục đích	Kiểm tra chi tiết thời gian, số tiền, trạng thái của từng giao dịch.
Mô tả	Khám phá dữ liệu từng bản ghi giao dịch để đối soát.
Tác nhân	Admin, Người thuê
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Giao dịch.
Điều kiện sau	Danh sách giao dịch được hiển thị đúng quyền hạn.
Luồng sự kiện chính	1. Web gửi yêu cầu lấy danh sách giao dịch (có phân trang/lọc).
2. Backend xác nhận quyền và trả về dữ liệu tương ứng.
3. Web hiển thị bảng giao dịch (Thời gian, Số tiền, Mã KH, Trạng thái).
4. Người dùng có thể bấm xem chi tiết từng dòng.
Luồng sự kiện phụ	2.a: Lọc theo thời điểm không cố định/ Lỗi DB
 - 2.a.1: Web thông báo không tìm thấy dữ liệu người dùng.


Hình 2.16: Biểu đồ hoạt động chức năng Xem giao dịch.


Hình 2.17: Biểu đồ trình tự chức năng Xem giao dịch.
2.5.9.Chức năng Xuất file thống kê.
Bảng 2.9: Đặc tả chức năng Xuất file thống kê.
Thông tin	Nội dung
Use Case	Xuất file thống kê
Mục đích	Xuất dữ liệu ra file mềm (Excel, CSV) cho việc kế toán ngoài hệ thống.
Mô tả	Người dùng chọn dữ liệu và hệ thống sẽ xuất định dạng file tải về máy.
Tác nhân	Admin, Người thuê
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang xem danh sách giao dịch.
Điều kiện sau	File lưu sẵn ở thiết bị cục bộ.
Luồng sự kiện chính	1. Người dùng bấm "Xuất file".
2. Chọn định dạng (Xuất toàn bộ hoặc theo bộ lọc hiện có).
3. Backend tạo file .csv tĩnh và trả lại luồng (stream).
4. Web tải file xuống máy tính của người dùng.
5. Thông báo xuất thành công.
Luồng sự kiện phụ	3.a: Khối lượng dữ liệu quá lớn
   3.a.1: Backend xử lý quá lâu, báo Timeout.
   3.a.2: Web đề xuất người dùng chia nhỏ bộ lọc thời gian để xuất.


Hình 2.18: Biểu đồ hoạt động chức năng Xuất file thống kê.

Hình 2.19: Biểu đồ trình tự chức năng Xuất file thống kê.
2.5.10.Chức năng Xem thiết bị.
Bảng 2.10: Đặc tả chức năng Xem thiết bị.
Thông tin	Nội dung
Use Case	Xem thiết bị
Mục đích	Xem trạng thái kết nối và thuộc tính của các thiết bị máy bơm.
Mô tả	Hiển thị tất cả thiết bị với label đánh dấu "Online", "Offline", "Busy".
Tác nhân	Admin, Người thuê
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị.
Điều kiện sau	Danh sách thiết bị cập nhật đúng trạng thái thực tế nhất.
Luồng sự kiện chính	1. Web gửi API lấy danh sách thiết bị.
2. Backend ghép với thông tin Heartbeat cuối cùng để tính toán trạng thái.
3. Backend trả dữ liệu kèm cờ Online/Offline.
4. Web hiển thị danh sách thiết bị dạng bảng hoặc dạng thẻ (Card).
Luồng sự kiện phụ	3.a: Mất đồng bộ Heartbeat Database
  3.a.1: Backend báo lỗi log.
  3.a.2: Web tạm nhận trạng thái cũ (Cached).


Hình 2.20: Biểu đồ hoạt động chức năng Xem thiết bị.


Hình 2.21: Biểu đồ trình tự chức năng Xem thiết bị.
2.5.11.Thêm thiết bị.
Bảng 2.11: Đặc tả chức năng Thêm thiết bị
Thông tin	Nội dung
Use Case	Thêm thiết bị
Mục đích	Gắn thẻ, thêm một module ESP32 mới tinh vào phần mềm quản lý trạm cụ thể.
Mô tả	Người dùng khai báo MAC Address và Tên cho hệ thống chấp nhận thiết bị kết nối lên.
Tác nhân	Admin, Người thuê
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị.
Điều kiện sau	Thiết bị thiết lập thành công.
Luồng sự kiện chính	1. Người dùng bấm "Thêm thiết bị mới".
2. Điền MAC Address, Tên thiết bị, Chọn trạm gán vào.
3. Bấm "Lưu".
4. Backend thẩm định dữ liệu và lưu DB.
5. Báo thêm mới thành công, thiết bị có thể bắt đầu được kết nối.
Luồng sự kiện phụ	4.a: MAC Address trùng lặp
 - 4.a.1: Backend báo thiết bị này đang thuộc trạm khác/ người khác.
 - 4.a.2: Hệ thống báo lỗi "MAC ID không hợp lệ".


Hình 2.22: Biểu đồ hoạt động chức năng Thêm thiết bị.


Hình 2.23: Biểu đồ trình tự chức năng Thêm thiết bị.
2.5.12.Sửa cấu hình thiết bị.
Bảng 2.12: Đặc tả chức năng Sửa cấu hình thiết bị.
Thông tin	Nội dung
Use Case	Sửa cấu hình thiết bị
Mục đích	Định cấu hình giá tiền, thời gian tương ứng.
Mô tả	Cập nhật tên thiết bị, trạm gán hoặc bảng giá cước (Ví dụ x vnđ/phút).
Tác nhân	Admin, Người thuê
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống, đang ở màn hình Thiết bị và thiết bị đã tồn tại.
Điều kiện sau	Thiết bị lưu trữ thông tin cấu hình mới nhất.
Luồng sự kiện chính	1. Bấm nút "Sửa" ở dòng thiết bị cần chỉnh.
2. Thay đổi các thuộc tính như Tên, Đơn giá/phút.
3. Bấm "Cập nhật".
4. Backend ghi lại DB, update Cache (nếu có).
5. Trả kết quả thành công.
Luồng sự kiện phụ	2.a: Nhập số âm cho đơn giá
 - 2.a.1: Web validation bắt lỗi.
 - 2.a.2: Hiển thị lỗi "Đơn giá phải lớn hơn 0" trên form.


Hình 2.24: Biểu đồ hoạt động chức năng Sửa cấu hình thiết bị.

Hình 2.25: Biểu đồ trình tự chức năng Sửa cấu hình thiết bị.

2.5.13.Xóa thiết bị.
Bảng 2.13: Đặc tả chức năng Xóa thiết bị
Thông tin	Nội dung
Use Case	Xóa thiết bị
Mục đích	Xóa hoàn toàn thiết bị khỏi hệ thống khi hư hỏng/dời đi.
Mô tả	Xóa liên kết và dữ liệu thiết bị, từ đó thiết bị vật lý này sẽ không cấp phép nối lên Server được nữa.
Tác nhân	Admin, Người thuê
Điều kiện trước	Tác nhân đã đăng nhập vào hệ thống và đang ở màn hình Thiết bị.
Điều kiện sau	Thiết bị biến mất khỏi hệ thống.
Luồng sự kiện chính	1. Bấm xoá thiết bị.
2. Nhận popup cảnh báo rủi ro thao tác.
3. Bấm xác nhận xóa.
4. Backend cô lập dữ liệu giao dịch cũ (giữ lại) nhưng xoá thực thể device table.
5. Thông báo xoá thành công.
Luồng sự kiện phụ	4.a: Thiết bị đang trong trạng thái BUSY (đáp ứng khách)
 - 4.a.1: Backend chặn tiến tình xoá để tránh mất tiền của khách đang dùng dở.
 - 4.a.2: Web báo lỗi "Hãy chờ chu kỳ rửa hoàn tất để xoá".


Hình 2.26: Biểu đồ hoạt động chức năng Xóa thiết bị.

Hình 2.27: Biểu đồ trình tự chức năng Xóa thiết bị.
2.5.14.Chức năng Thanh toán.
Bảng 2.14: Đặc tả chức năng Thanh toán
Thông tin	Nội dung
Use Case	Thanh toán
Mục đích	Cho phép khách hàng trả phí để bắt đầu sử dụng máy rửa xe.
Mô tả	Khách hàng quét mã QR, thanh toán qua cổng điện tử và nhấn nút bắt đầu trên web.
Tác nhân	Khách hàng
Điều kiện trước	Khách hàng ở gần trạm rửa xe, có thiết bị kết nối internet.
Điều kiện sau	Máy bơm được kích hoạt (Relay ON) trong khoảng thời gian đã mua.
Luồng sự kiện chính	1. Khách hàng sử dụng điện thoại quét mã QR được dán trên tủ máy rửa xe.
2. Hệ thống thanh toán (SePay/Webhook) gửi callback xác nhận về Backend.
3. Web polling hoặc WebSocket nhận được tín hiệu thành công
4. Backend chuyển lệnh qua mạng để ESP32 đóng relay máy bơm.
5. Web hiển thị đồng hồ đếm ngược.
Luồng sự kiện phụ	4.a: Ngay lúc bấm bắt đầu, Thiết bị ngắt kết nối Wifi
   4.a.1: Backend gọi xuống ESP32 nhưng Timeout.
   4.a.2: Web thông báo "Thiết bị gặp sự cố kết nối, chúng tôi đã ghi nhận hoàn tiền vào tài khoản/SĐT...".



Hình 2.28: Biểu đồ hoạt động chức năng Thanh toán.

Hình 2.29: Biểu đồ trình tự chức năng Thanh toán.
2.5.15.Đăng ký hệ thống.
Bảng 2.15:  Đặc tả chức năng Đăng ký hệ thống.
Thông tin	Nội dung
Use Case	Đăng ký hệ thống
Mục đích	Báo danh để Server nhận diện và cấp phép tham gia mạng lưới.
Mô tả	Khi thiết bị ESP32 boot lên, nó sẽ gửi một gói tin HTTP kèm MAC ADDRESS để thông báo danh tính lên API Server.
Tác nhân	IoT Device
Điều kiện trước	Đã cấu hình Wifi mật khẩu tại trạm thành công.
Điều kiện sau	Thiết bị bước vào vòng lặp làm việc bình thường.
Luồng sự kiện chính	1. Node ESP32 khởi động, truy cập Wifi.
2. Gửi lệnh POST /api/iot/register bao gồm tham số bắt buộc là MAC_ADDRESS.
3. Backend đối chiếu MAC_ADDRESS này trong Schema của Tenant/Admin tải lên trước đó.
4. Backend ghi nhận trạng thái thiết bị online và gửi phản hồi 200 kèm Token/cấu hình pin.
5. ESP32 lưu thông số và vào vòng lặp chờ lệnh.
Luồng sự kiện phụ	3.a: MAC Address chua được cấu hình trong bảng Backend
 - 3.a.1: Backend trả HTTP 403 Forbidden.
 - 3.a.2: ESP32 đi vào trạng thái chờ 5p rồi đăng ký lại.


Hình 2.30: Biểu đồ hoạt động chức năng Đăng ký hệ thống.

Hình 2.31: Biểu đồ trình tự chức năng Đăng ký hệ thống.
2.5.16.Chức năng Gửi trạng thái
Bảng 2.16: Đặc tả chức năng Gửi trạng thái
Thông tin	Nội dung
Use Case	Gửi trạng thái (Heartbeat)
Mục đích	Duy trì bằng chứng thiết bị vẫn đang sống (Online).
Mô tả	Thiết bị ping định kỳ về server 30-60s 1 lần cập nhật trạng thái làm việc hiện tại (Bật hay đang Tắt).
Tác nhân	IoT Device
Điều kiện trước	ESP32 đã đăng ký hệ thống thành công (UC-7.1)
Điều kiện sau	Last_seen của thiết bị được cấp nhật.
Luồng sự kiện chính	1. Mỗi N giây, ESP32 gọi HTTP GET tới /api/iot/heartbeat.
2. Gói tin gắn kèm State (Bật/Tắt).
3. Backend Cập nhật timestamp trong DB.
4. Server phản hồi 200 OK.
Luồng sự kiện phụ	1.a: Rớt mạng Wifi trong lúc chạy
 - 1.a.1: Gửi request thất bại.
 - 1.a.2: Phần cứng tiếp tục cho phép chạy nếu còn timer, sau đó nó sẽ retry liên tục tới khi có net.


Hình 2.32: Biểu đồ hoạt động chức năng Gửi trạng thái.

Hình 2.33: Biểu đồ trình tự chức năng Gửi trạng thái.
2.5.17.Chức năng Nhận lệnh điều khiển.
Bảng 2.17: Đặc tả chức năng Nhận lệnh điều khiển
Thông tin	Nội dung
Use Case	Nhận lệnh điều khiển
Mục đích	Nhận tín hiệu khởi động từ xa sau khi người dùng trả tiền.
Mô tả	ESP32 đáp ứng các mệnh lệnh bật và tắt Relay vật lý qua giao tiếp Server (HTTP long polling hoặc Websocket tùy lựa chọn công nghệ IoT).
Tác nhân	IoT Device
Điều kiện trước	Đang có kết nối mạng ổn định với Backend.
Điều kiện sau	Rơ-le (Relay) được kích mức cao hoặc mức thấp thành công, trạng thái máy vật lý đổi khác.
Luồng sự kiện chính	1. Admin/Customer kích hoạt lệnh "Bật" cho thời gian N phút trên Server.
2. Server đẩy lệnh cmd=START&duration=N xuống module ESP32.
3. ESP32 phân tích gói lệnh.
4. ESP32 Set-Pin kích hoạt GPIO liên kết Relay => Bơm bắt đầu chạy.
5. ESP32 Gửi POST status_log=STARTED báo điểm danh thành công lên Server.
6. (Kết thúc) Sau khi timer đếm ngược tại ESP32 kết thúc, nó Set-Pin ngắt Relay và Gửi POST status=STOPPED lên server một lần nữa.
Luồng sự kiện phụ	4.a: Mạch chập cháy, Relay không hoạt động
   4.a.1: Trạng thái không thể thay đổi, phần cứng ghi nhận timeout hoặc ADC check.
   4.a.2: Gửi gói Error packet Error=Hardware_Fails ngược lên Server cho Admin check tu bổ.


Hình 2.34: Biểu đồ hoạt động chức năng Nhận lệnh điều khiển

Hình 2.35: Biểu đồ trình tự chức năng Nhận lệnh điều khiển
2.6.Biểu đồ lớp.

Hình 2.36: Biểu đồ lớp.



CHƯƠNG 3.TRIỂN KHAI VÀ XÂY DỰNG GIAO DIỆN HỆ THỐNG
3.1.Môi trường và công cụ phát triển
Quá trình hiện thực hóa hệ thống ACW-SRS được triển khai dựa trên một hệ sinh thái công nghệ đồng bộ, đảm bảo sự liên kết chặt chẽ giữa ba phân hệ: tầng ứng dụng web, tầng dữ liệu và tầng thiết bị phần cứng.
Công nghệ lõi và Ngôn ngữ lập trình: Sử dụng Node.js kết hợp với Next.js – framework phục vụ cho việc phát triển. Việc sử dụng TypeScript làm ngôn ngữ lập trình chính giúp áp dụng cơ chế định kiểu tĩnh (static typing), từ đó kiểm soát nghiêm ngặt các rủi ro về kiểu dữ liệu ngay trong quá trình biên dịch và gia tăng tính ổn định của mã nguồn khi vận hành thực tế.
Hệ quản trị Cơ sở dữ liệu và ORM: Hệ thống sử dụng cơ sở dữ liệu quan hệ MySQL để tổ chức và lưu trữ thông tin, đáp ứng trọn vẹn bài toán phân tách dữ liệu độc lập giữa các chủ trạm (Multi-tenant). Việc thao tác với cơ sở dữ liệu được thực hiện thông qua Prisma ORM, giúp trừu tượng hóa các câu lệnh SQL phức tạp, tối ưu tốc độ truy vấn và ngăn chặn triệt để các lỗ hổng bảo mật như SQL Injection.
Vi điều khiển và Giao tiếp IoT: Ở phân hệ trạm rửa xe vật lý, mạch vi điều khiển ESP32 được lựa chọn làm thiết bị thực thi chính (Actuator). Phần mềm nhúng trên ESP32 được lập trình để liên tục duy trì giao tiếp với máy chủ thông qua các API Endpoint, đảm bảo khả năng tiếp nhận mệnh lệnh đóng ngắt rơ-le (Relay) và báo cáo trạng thái hệ thống với độ trễ ở mức tối thiểu.
3.2.Nguyên lý xây dựng giao diện (UI/UX)
Kiến trúc giao diện của hệ thống được phát triển theo triết lý thiết kế lấy người dùng làm trung tâm (User-Centered Design), hướng tới việc tối ưu hóa hiệu năng hiển thị và đơn giản hóa các luồng thao tác nghiệp vụ.
Thiết kế tương thích đa nền tảng (Responsive Design): Bằng việc ứng dụng các thư viện CSS hiện đại (điển hình như Tailwind CSS), hệ thống giao diện được xây dựng dựa trên mô hình lưới linh hoạt (flexbox/grid). Phương pháp này giúp bố cục trang tự động tinh chỉnh và thích ứng mượt mà trên mọi tỷ lệ màn hình. Đây là yếu tố mang tính quyết định, đảm bảo trải nghiệm liền mạch cho khách hàng khi thao tác quét mã QR thanh toán trên các thiết bị di động tại trạm rửa.
3.3.Cấu hình triển khai máy chủ (Deployment)
Để đảm bảo hệ thống ACW-SRS có khả năng phục vụ liên tục với độ sẵn sàng cao, quy trình triển khai mã nguồn (Deployment) được phân bổ lên các hạ tầng điện toán đám mây chuyên biệt và độc lập.
Lưu trữ và Vận hành ứng dụng (Web Hosting): Tầng Frontend và Backend của ứng dụng được biên dịch và triển khai trên các nền tảng đám mây Vercel. Mọi luồng truy cập và giao tiếp trên hệ thống đều được ép buộc sử dụng giao thức HTTPS với chứng chỉ bảo mật SSL/TLS được cấp phát tự động, tạo ra lớp mã hóa vững chắc bảo vệ dữ liệu nhạy cảm của người dùng và các phiên giao dịch.
Xử lý Webhook và Tự động hóa giao dịch: Một luồng tuyến API (Endpoint) được thiết kế tách biệt nhằm chuyên trách việc lắng nghe và tiếp nhận các sự kiện Webhook từ cổng trung gian thanh toán SePay. Phân hệ này được thiết lập với khả năng chịu tải tốt, đảm bảo ghi nhận tức thời mọi biến động số dư từ ngân hàng. Đây là mắt xích then chốt giúp hệ thống đối soát dữ liệu và tự động hóa hoàn toàn quy trình kích hoạt máy bơm nước mà không phụ thuộc vào sức người.
3.4.Trang Đăng nhập.
Trang đăng nhập cho phép quản trị viên (Admin) và các chủ trạm (Tenant) truy cập vào website quản lý bằng cách điền thông tin tài khoản hợp lệ bao gồm:
1.Trường nhập Email và Mật khẩu.
2.Nút "Đăng nhập" để gửi thông tin và hệ thống sẽ kiểm tra và xác thực.
3.Hiển thị thông báo lỗi khi người dùng nhập sai thông tin đăng nhập.

Hình 3.1: Trang đăng nhập.


Hình 3.2: Thông báo lỗi khi đăng nhập.
3.5.Trang Quên mật khẩu.
Trang này được thiết kế nhằm cung cấp cơ chế dự phòng an toàn, cho phép người dùng tự thiết lập lại thông tin truy cập trong các tình huống thất lạc hoặc không nhớ khóa bảo mật hiện tại.
Quy trình lấy lại mật khẩu như sau:
Bước 1:Người dùng tiến hành cung cấp chính xác địa chỉ thư điện tử (email) định danh đã được liên kết với hệ thống trong giai đoạn khởi tạo tài khoản ban đầu
Bước 2: Ngay sau khi lệnh yêu cầu được kích hoạt từ phía giao diện, máy chủ sẽ tự động phát sinh và phân phối một chuỗi mã xác minh (OTP) – hoặc một liên kết URL mã hóa dùng một lần – trực tiếp đến hộp thư cá nhân vừa khai báo.
Bước 3: Màn hình ứng dụng sẽ cập nhật trạng thái gửi thành công, đồng thời hiển thị trực quan lại địa chỉ email đích. Bước này đóng vai trò như một cơ chế đối chứng, hỗ trợ người dùng rà soát lại thông tin và hạn chế tối đa các sự cố do nhập liệu sai lệch.
Bước 4: Người dùng nhập mã xác thực vào form để tiến hành đặt lại mật khẩu mới.
Bước 5: Có nút liên kết "Quay lại" để trở về trang đăng nhập ban đầu.


Hình 3.3: Form yêu cầu lấy lại mật khẩu.

Hình 3.4: Nhập mã xác thực để đổi mật khẩu.
3.6.Trang dashboard
Trong hệ thống quản lý thiết bị cho trạm rửa xe tự phục vụ ACW-SRS, Bảng điều khiển (Dashboard) đóng vai trò là trung tâm kiểm soát và phân tích dữ liệu theo thời gian thực. Đặc trưng kỹ thuật nổi bật của phân hệ này là việc áp dụng triệt để kiến trúc Đa người thuê (Multi-tenant). Tùy thuộc vào cấp độ phân quyền của tài khoản tại thời điểm xác thực, hệ thống sẽ tự động định tuyến và cung cấp không gian quản trị với góc nhìn và luồng dữ liệu hoàn toàn tách biệt.
1. Bảng điều khiển dành cho Quản trị viên cấp cao (Super Admin Dashboard)
Giao diện "Hệ thống Quản trị" được thiết kế đặc thù dành cho Quản trị viên cấp cao (Super Admin) nhằm giám sát, phân tích và điều phối toàn cục nền tảng phần mềm. Bố cục giao diện phản ánh tư duy quản trị vĩ mô thông qua các phân hệ dữ liệu chuyên sâu:

Hình 3.5: Giao diện Tổng quan Bảng điều khiển dành cho Quản trị viên cấp cao
Thanh điều hướng hệ thống (System Navigation): Được bố trí bên trái giao diện, cung cấp các trình đơn quản trị cấp cao bao gồm: Quản lý danh sách Tenants, Thống kê Doanh thu tổng thể. Khu vực Thống kê Chỉ số nền tảng (Platform KPIs): Trình bày 4 lăng kính dữ liệu cốt lõi nhằm đánh giá mức độ hoạt động của toàn hệ thống.
Phân khu Biểu đồ Trực quan hóa (Data Visualization): Tích hợp hai biểu đồ dạng đường (Line chart) bố trí song song, biểu diễn xu hướng "Doanh thu theo ngày" và "Số giao dịch theo ngày".
2. Bảng điều khiển dành cho Người thuê (Tenant )
Trái ngược với góc nhìn vĩ mô của Admin, giao diện Bảng điều khiển Tenant tập trung vào lăng kính vi mô, phục vụ trực tiếp nhu cầu giám sát vận hành và kiểm soát dòng tiền của từng đối tác kinh doanh độc lập. Mọi dữ liệu tại đây được cô lập hoàn toàn, đảm bảo tính bảo mật và quyền riêng tư tuyệt đối cho chủ trạm.

Hình 3.6: Giao diện Tổng quan Bảng điều khiển dành cho Chủ trạm
Thanh điều hướng chuyên dụng (Sidebar Navigation): Chứa danh mục các nghiệp vụ tác nghiệp cốt lõi mà chủ trạm thường xuyên thao tác: Quản lý Thiết bị, Lịch sử Giao dịch, Thống kê Doanh thu và Thiết lập Cấu hình. Phía dưới cùng tích hợp khối thông tin định danh phiên làm việc (ID người dùng) kèm cơ chế "Đăng xuất" phiên an toàn.
Khu vực Thống kê Chỉ số Hiệu suất (KPI Cards): Nằm ở vị trí trung tâm, hệ thống truy xuất và hiển thị tức thời 4 thẻ thông số phản ánh tình hình kinh doanh thực tế trong ngày, được làm mới liên tục:
+Doanh thu hôm nay: Tổng hóa dòng tiền thực tế đã ghi nhận thành công qua luồng Webhook tự động.
+Giao dịch: Tổng số lượt khách hàng quét mã VietQR và hoàn tất thanh toán.
+Đang Online: Cung cấp thông số giám sát phần cứng, cho biết số lượng mạch vi điều khiển ESP32 đang duy trì kết nối mạng ổn định với máy chủ.
+Tổng thiết bị: Quy mô số lượng máy rửa xe vật lý được cấp phép và đang khai thác trên hệ thống.
3.7.Trang Quản lý Người thuê (Tenant).
Trang quản lý người thuê là giao diện dành riêng cho Admin hệ thống giúp hiển thị và quản lý toàn bộ thông tin đối tác/chủ trạm đã đăng ký.
Chức năng chính:
1.Hiển thị danh sách tất cả các Tenant đang hoạt động trên hệ thống.
2.Hỗ trợ tìm kiếm nhanh theo: Tên chủ trạm, Số điện thoại hoặc Email.
3.Hỗ trợ bộ lọc dữ liệu theo trạng thái hoạt động (Đang hoạt động, Bị khóa).
4.Cho phép thực hiện các thao tác quản lý trực tiếp trên hàng dữ liệu:
Xem chi tiết thông tin Tenant.
Chỉnh sửa thông tin (icon Bút).
 Khóa hoặc xóa Tenant (icon Thùng rác).

Hình 3.7: Trang danh sách quản lý người thuê.
3.8.Trang Thêm mới và Chỉnh sửa Người thuê.
Trang Thêm mới là giao diện cho phép Admin tạo tài khoản mới cho một chủ trạm (Tenant) để họ có thể bắt đầu sử dụng dịch vụ. Trang Chỉnh sửa cho phép cập nhật lại các thông tin nếu có sự thay đổi.
Các trường thông tin yêu cầu:
1.Họ và tên chủ trạm.
2.Số điện thoại liên hệ.
3.Địa chỉ Email (dùng làm tài khoản đăng nhập).
4.Số lượng thiết bị tối đa được phép quản lý.
5.Cấu hình thông tin tích hợp thanh toán (SePay API Key) để tự động hóa doanh thu.
Thiết kế giao diện yêu cầu nhập đủ các thông tin cần thiết, tự động báo lỗi (Validate) nếu bỏ trống hoặc sai định dạng email.

Hình 3.8: Form thêm mới người thuê.
3.9.Trang Quản lý Thiết bị (IoT ESP32).
Trang quản lý thiết bị giúp người thuê (Tenant) có thể thêm mới, cấu hình và giám sát được tình trạng của các trạm rửa xe vật lý.
1.Thêm thiết bị mới: Yêu cầu nhập địa chỉ MAC của bộ ESP32 và Tên trạm.
2.Cấu hình giá tiền: Giao diện cho phép đặt mức giá dịch vụ (Ví dụ: 2000đ/phút).
3.Theo dõi trạng thái: Hiển thị danh sách thiết bị kèm các huy hiệu trạng thái thời gian thực như "Online" (Xanh lá), "Offline" (Xám) hoặc "Busy" (Đỏ - Đang có khách rửa).
4.Điều khiển từ xa: Cho phép chủ trạm bật/tắt thiết bị khẩn cấp thông qua các nút gạt (Toggle Switch) ngay trên giao diện.

Hình 3.9: Trang quản lý trạng thái thiết bị.
3.10.Giao diện Quản lý Thiết bị IoT (Dành cho Chủ trạm)
Trang "Quản lý thiết bị" là phân hệ tác nghiệp cốt lõi, trao quyền cho các Chủ trạm (Tenant) kiểm soát toàn bộ vòng đời và trạng thái vận hành của các máy rửa xe vật lý (tích hợp vi điều khiển ESP32) thuộc phân khu quản lý của mình. Giao diện được thiết kế nhằm tối ưu hóa khả năng giám sát phần cứng từ xa thông qua nền tảng web

Hình 3.10: Giao diện Quản lý danh sách và trạng thái thiết bị phần cứng của Chủ trạm
Bố cục chức năng của phân hệ này được tổ chức chặt chẽ, bao gồm các thành phần trọng yếu sau:
+Bộ lọc và Truy xuất thông tin (Search Bar): Nằm ở phía trên cùng của vùng không gian làm việc, hệ thống cung cấp một thanh tìm kiếm đa năng. Chủ trạm có thể truy xuất nhanh chóng một hoặc một nhóm thiết bị cụ thể thông qua các từ khóa định danh.
+Bảng Giám sát Trạng thái (Monitoring Data Grid): Trung tâm của giao diện là bảng dữ liệu tổng hợp, trình bày các thông số kỹ thuật và kinh doanh của từng máy rửa xe theo thời gian thực:
+Trạng thái Kết nối (Hoạt động & Lần cuối): Cột "Hoạt động" sử dụng chỉ báo màu sắc (Ví dụ: chấm xám cho trạng thái Offline) kết hợp cùng cột "Lần cuối" (Dấu thời gian - Timestamp) để phản ánh chính xác tình trạng mạng của mạch ESP32. Dữ liệu này được nội suy từ cơ chế đồng bộ nhịp tim (Heartbeat) định kỳ giữa phần cứng và máy chủ Next.js.
+Thông số Kinh doanh (Giá/phút): Hiển thị cấu hình đơn giá dịch vụ đang được áp dụng cho dòng máy tương ứng (Ví dụ: 1.000đ/phút). Tham số này làm cơ sở để máy chủ tính toán thời gian bơm nước tự động khi nhận được Webhook thanh toán từ phía ngân hàng.
+Quản trị Hệ thống (Firmware & Kích hoạt): Cung cấp thông tin về phiên bản phần mềm nhúng đang chạy trên thiết bị và trạng thái cấp phép hoạt động (Active) của phần cứng đó trên hệ thống lưới.
+Khu vực Thao tác Nghiệp vụ (Action Group): Cột "Thao tác" tích hợp các bộ công cụ quản trị trực tiếp trên từng bản ghi dữ liệu. Bao gồm các biểu tượng lệnh (Icons):
+Xem chi tiết (Biểu tượng Mắt): Mở ra giao diện giám sát chuyên sâu các luồng tín hiệu và lịch sử hoạt động của thiết bị.
+Chỉnh sửa (Biểu tượng Bút): Cho phép chủ trạm cập nhật lại cấu hình tên gọi, trạm gán hoặc điều chỉnh đơn giá theo phút.
+Xóa (Biểu tượng Thùng rác): Thực thi lệnh gỡ bỏ thiết bị khỏi hệ thống. 
3.11.Giao diện Cấu hình và Tinh chỉnh tham số Thiết bị

Hình 3.11: Giao diện thiết lập thông số vận hành và tích hợp thanh toán cho thiết bị IoT
Trang "Chỉnh sửa thiết bị" cung cấp không gian tương tác chi tiết, cho phép các Chủ trạm (Tenant) thiết lập và cập nhật các tham số vận hành cốt lõi cho từng cụm máy rửa xe. Giao diện được thiết kế dưới dạng biểu mẫu (Form) với các trường thông tin được phân cụm logic, đảm bảo tính đồng bộ dữ liệu giữa máy chủ trung tâm và mạch vi điều khiển ESP32 tại hiện trường.
3.12.Giao diện Quản lý Lịch sử Giao dịch
Trang "Danh sách giao dịch" cung cấp cho Chủ trạm (Tenant) công cụ tổng hợp để theo dõi và đối soát toàn bộ các khoản thanh toán phát sinh từ hệ thống máy rửa xe tự phục vụ.

Hình 3.12: Giao diện theo dõi lịch sử thanh toán và đối soát giao dịch
Giao diện được thiết kế tối giản, tập trung vào bảng dữ liệu chi tiết với các trường thông tin phục vụ trực tiếp cho nghiệp vụ kế toán:
+Thiết bị: Hiển thị định danh của máy rửa xe phát sinh giao dịch, giúp chủ trạm phân loại được nguồn thu từ từng thiết bị cụ thể.
+Số tiền & Thời lượng: Thể hiện giá trị khoản thanh toán mà khách hàng đã chuyển khoản và thời gian hoạt động tương ứng được hệ thống quy đổi tự động (ví dụ: 10.000đ cho 10 phút).
+Trạng thái: Các nhãn trạng thái (ví dụ: "Thành công" màu xanh) giúp người quản lý nhận biết nhanh tiến trình xử lý của hệ thống thanh toán tự động.
+Mã giao dịch: Chuỗi định danh duy nhất sinh ra cho mỗi phiên thanh toán, đóng vai trò làm mã đối chứng khi chủ trạm cần tra cứu chéo với lịch sử biến động số dư trên ứng dụng ngân hàng.
+Thời gian: Ghi nhận chính xác mốc thời gian (Timestamp) hệ thống tiếp nhận Webhook và hoàn tất giao dịch.
3.13.Giao diện Cấu hình Hệ thống Thanh toán
Trang "Cấu hình" là phân hệ quan trọng cho phép Chủ trạm (Tenant) thiết lập và đồng bộ tài khoản ngân hàng nhận tiền với nền tảng trung gian SePay. Đây là cơ sở dữ liệu bắt buộc để hệ thống có thể tự động hóa quy trình đối soát giao dịch.

Hình 3.13: Giao diện thiết lập tham số tích hợp thanh toán tự động SePay
Biểu mẫu cấu hình được thiết kế trực quan, tập trung vào các tham số bảo mật và định danh tài chính cốt lõi:
+Số tài khoản ngân hàng & Mã ngân hàng: Thông tin định tuyến đích đến của dòng tiền (ví dụ: mã ngân hàng VTB). Hệ thống sử dụng dữ liệu này làm tham số gốc để khởi tạo mã QR động (VietQR) hiển thị cho khách hàng quét.
+Tên chủ tài khoản: Định danh người thụ hưởng chính thức. Thông tin này giúp khách hàng dễ dàng đối chứng và xác nhận trước khi thực hiện lệnh chuyển tiền trên ứng dụng ngân hàng.
+Webhook Secret: Chuỗi mã khóa bảo mật cấp cao, hoạt động như một chữ ký điện tử. Máy chủ ACW-SRS sử dụng khóa này để xác thực nguồn gốc các gói tin thông báo số dư đẩy về từ SePay, qua đó ngăn chặn triệt để các rủi ro tấn công giả mạo giao dịch (Fake Webhook).
+
+Thao tác lưu trữ: Nút "Lưu cấu hình" sẽ tiến hành mã hóa các dữ liệu nhạy cảm và cập nhật đồng bộ các thiết lập thanh toán này áp dụng lên toàn bộ mạng lưới máy rửa xe do chủ trạm đó quản lý.
3.14.Trang Xem Doanh thu và Giao dịch.
Đây là trang Dashboard tài chính, đóng vai trò như một báo cáo trực quan cho các chủ trạm:
1.Hiển thị các thẻ thống kê tổng quan (Thống kê số dư hiện tại, Doanh thu trong ngày, Doanh thu tuần).
2.Tích hợp biểu đồ trực quan (Bar chart/Line chart) thể hiện dòng tiền theo từng chu kỳ.
3.Bảng lịch sử giao dịch bên dưới giúp đối soát từng khoản tiền khách hàng chuyển vào thông qua quét QR.
4.Hỗ trợ xuất dữ liệu (Export) ra file Excel/CSV phục vụ việc kế toán.

Hình 3.14: Trang thống kê doanh thu và giao dịch.


KẾT LUẬN
Trong quá trình phát triển hệ thống ACW-SRS (Auto Car Wash Smart Rental System), em đã đúc kết ra được những thành quả và bài học quý giá sau:
Kết quả đã đạt được:
Hoàn thành đầy đủ các chức năng lõi đã đề ra: Quản trị đa người dùng (Multi-tenant), Quản lý trạng thái thiết bị IoT thời gian thực, tự động hóa thanh toán và báo cáo doanh thu.
 Hoàn thiện hệ thống với kiến trúc Full-stack chặt chẽ, tối ưu hiệu năng.
 Sử dụng thành thạo framework Next.js và React để xây dựng giao diện người dùng trực quan, hỗ trợ tốt trên cả thiết bị di động và máy tính.
 Áp dụng thành công hệ quản trị CSDL MySQL cùng Prisma ORM giúp thao tác dữ liệu (CRUD) an toàn, linh hoạt và truy vấn tốc độ cao.
 Triển khai thành công thiết bị phần cứng ESP32, lập trình luồng kết nối tự động phục hồi và xử lý tín hiệu bật/tắt thiết bị vật lý với độ trễ thấp (< 5 giây).
 Tích hợp giải pháp thanh toán không tiền mặt tự động qua Webhook SePay, mang lại giá trị thực tiễn lớn trong việc tự động hóa mô hình kinh doanh.
 Nâng cao kỹ năng thiết kế UI/UX (Tailwind CSS, shadcn/ui) giúp giao diện trở nên thân thiện và chuyên nghiệp hơn.
Hạn chế:
+Giao diện dành cho khách hàng quét mã QR vẫn còn khá đơn giản, chưa tích hợp nhiều hoạt ảnh (animation) thu hút.
+Hệ thống hiện tại chỉ mới kết nối thanh toán qua tài khoản ngân hàng, chưa tích hợp các ví điện tử phổ biến như MoMo, ZaloPay.
+Thiết bị IoT ESP32 phụ thuộc hoàn toàn vào mạng Wi-Fi, có thể gặp rủi ro mất kết nối tại các khu vực sóng yếu.
Phương hướng phát triển:
Nâng cấp UI/UX cho toàn bộ hệ thống để mang lại trải nghiệm tiệm cận các ứng dụng thương mại cao cấp.
Tích hợp thêm các module kết nối 4G/LTE cho phần cứng IoT nhằm khắc phục điểm yếu của sóng Wi-Fi.
Phát triển thêm tính năng "Thẻ thành viên" hoặc "Ví nạp trước" giúp khách hàng thân thiết thao tác nhanh hơn mà không cần phải chuyển khoản ngân hàng nhiều lần.
TÀI LIỆU THAM KHẢO
[1] Mozilla, Tài liệu hướng dẫn JavaScript (MDN Web Docs). [Trực tuyến]. Địa chỉ: https://developer.mozilla.org/
[2] Microsoft, Tài liệu ngôn ngữ TypeScript. [Trực tuyến]. Địa chỉ: https://www.typescriptlang.org/
[3] Meta Platforms, Tài liệu thư viện ReactJS. [Trực tuyến]. Địa chỉ: https://react.dev/
[4] Vercel, Tài liệu framework Next.js. [Trực tuyến]. Địa chỉ: https://nextjs.org/
[5] Node.js Foundation, Tài liệu nền tảng Node.js. [Trực tuyến]. Địa chỉ: https://nodejs.org/
[6] Oracle, Tài liệu hệ quản trị cơ sở dữ liệu MySQL. [Trực tuyến]. Địa chỉ: https://www.mysql.com/
[7] Prisma, Tài liệu hướng dẫn Prisma ORM. [Trực tuyến]. Địa chỉ: https://www.prisma.io/
[8] Espressif Systems, Tài liệu vi điều khiển ESP32. [Trực tuyến]. Địa chỉ: https://www.espressif.com/
[9] SePay, Hướng dẫn tích hợp cổng thanh toán SePay. [Trực tuyến]. Địa chỉ: https://docs.sepay.vn/
[10] Phạm Công Hoàng Anh, Đồ án tốt nghiệp: Xây dựng đồ thị tri thức từ văn bản tiếng Việt dựa trên các kỹ thuật xử lý ngôn ngữ tự nhiên. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2025.
[11] Nguyễn Thị Ngọc, Đồ án tốt nghiệp: Đánh giá thực trạng & đề xuất giải pháp nhằm nâng cao chất lượng thực hành tin học tại phòng máy. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2024.
[12] Trần Thị Cúc, Đồ án tốt nghiệp: Phát triển ứng dụng sổ liên lạc điện tử cho trường Tiểu học Hòa Bình - Thái Nguyên. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2023.
[13] Lý Thanh Hường, Đồ án tốt nghiệp: Xây dựng website bán đồng hồ. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2024.
[14] Trần Hưng, Đồ án tốt nghiệp: Xây dựng chương trình quản lý nhân sự bằng công nghệ DotNet. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2022.
[15] Phạm Thị Ngọc Phương, Đồ án tốt nghiệp: Xây dựng website thương mại điện tử giới thiệu điện thoại di động. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2023.
[16] Lê Thị Thanh, Đồ án tốt nghiệp: Xây dựng chương trình kế toán tiền lương cho công ty cổ phần xi măng Tiến Sơn - Hà Tây. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2021.
[17] TS. Quách Xuân Trưởng, Giáo trình nhập môn Công nghệ số. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2024.
[18] Nguyễn Thế Vịnh (Chủ biên), Nguyễn Toàn Thắng, Nguyễn Thu Phương, Đoàn Ngọc Phương, Nguyễn Thị Dung, Giáo trình Công nghệ phát triển ứng dụng: ASP.NET Core MVC, Entity Framework Core, Identity và tích hợp AI. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2025.
[19] Nguyễn Duy Minh, Nguyễn Thị Thu Hiền, Phạm Thị Hồng Anh, Giáo trình lý thuyết tập mờ và mạng nơ ron ứng dụng trong điều khiển. Thái Nguyên: Trường Đại học Công nghệ Thông tin và Truyền thông - Đại học Thái Nguyên, 2018.
[20] N.G.Quyến (2026), [Tài liệu đề cương tốt nghiệp], Trường Đại học Công nghệ Thông tin và Truyền thông Thái Nguyên.


NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN
	
	
	
	
	
	
	
	
	
	
	
	
	
Thái Nguyên, ngày .… tháng .… năm … ….
GIÁO VIÊN HƯỚNG DẪN


