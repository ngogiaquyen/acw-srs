CHƯƠNG 1. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ PHẦM MỀM
1.1. Tổng quan về ngôn ngữ lập trình JavaScript và TypeScript
1.1.1. Lịch sử hình thành và vị thế của JavaScript
JavaScript là một ngôn ngữ lập trình kịch bản dựa trên đối tượng, được sử dụng rộng rãi trong phát triển Web. Ban đầu được tạo ra bởi Brendan Eich tại Netscape vào năm 1995 chỉ trong vòng 10 ngày với mục đích ban đầu là tạo ra các hiệu ứng nhỏ trên trình duyệt. Tuy nhiên, qua hơn hai thập kỷ phát triển, JavaScript đã tiến hóa từ một ngôn ngữ kịch bản đơn giản thành một nền tảng lập trình toàn diện. Hiện nay, nó được quản lý và tiêu chuẩn hóa bởi tổ chức ECMA International thông qua các phiên bản ECMAScript (ES). JavaScript đã trở thành ngôn ngữ phổ biến hàng đầu, đóng vai trò nền tảng trong phát triển ứng dụng hiện đại nhờ khả năng chạy trên cả trình duyệt (Client-side) và máy chủ (Server-side).
- Đặc tính ngôn ngữ cốt lõi: 
  - JavaScript là ngôn ngữ thông dịch (interpreted) với tốc độ thực thi cao.
  - Hỗ trợ đa mô hình lập trình như hướng đối tượng (OOP) và lập trình hàm.
  - Khả năng xử lý bất đồng bộ mạnh mẽ qua cơ chế Promise và Async/Await. 
- Cơ chế Event Loop và Non-blocking I/O: 
  - Đây là trung tâm điều khiển giúp JavaScript xử lý đơn luồng cực kỳ hiệu quả.
  - Cho phép hệ thống xử lý hàng nghìn yêu cầu cùng lúc mà không gây tắc nghẽn.
  - Tối ưu hóa tài nguyên phần cứng bằng cách đẩy tác vụ nặng vào hàng đợi.
- Node.js và cuộc cách mạng Backend: 
  - Cho phép JavaScript thực thi trực tiếp trên hệ điều hành bên ngoài trình duyệt.
  - Cung cấp thư viện chuẩn phong phú để thao tác với file, mạng và cơ sở dữ liệu.
  - Giúp lập trình viên sử dụng một ngôn ngữ duy nhất cho toàn bộ hệ thống (Full-stack).

1.1.2. Kiến trúc Event Loop và cơ chế bất đồng bộ chuyên sâu
Trái tim của Node.js chính là cơ chế Event Loop, được hỗ trợ bởi thư viện libuv (viết bằng C++). Khác với các ngôn ngữ truyền thống như Java hay PHP sử dụng mô hình đa luồng (Multi-threaded) – nơi mỗi kết nối mới sẽ chiếm dụng một luồng riêng – Node.js vận hành theo mô hình đơn luồng (Single-threaded) nhưng lại có khả năng xử lý bất đồng bộ cực kỳ mạnh mẽ nhờ cơ chế Non-blocking I/O.

Quy trình hoạt động của Event Loop bao gồm 6 pha chính tuần hoàn liên tục:
- **Timers**: Pha này xử lý các hàm gọi ngược (callbacks) từ `setTimeout()` và `setInterval()`. Node.js sẽ kiểm tra xem thời gian chờ đã hết chưa để đưa callback vào hàng đợi thực thi.
- **Pending Callbacks**: Thực thi các callback của các tác vụ hệ thống bị trì hoãn, ví dụ như các loại lỗi mạng TCP cụ thể.
- **Idle, Prepare**: Đây là các pha sử dụng nội bộ của Node.js nhằm chuẩn bị các tài nguyên hệ thống cần thiết cho các bước tiếp theo.
- **Poll**: Đây được coi là pha quan trọng nhất. Node.js sẽ đợi các kết nối I/O mới (như HTTP request từ người dùng hoặc dữ liệu từ thiết bị IoT). Nếu hàng đợi poll trống, nó sẽ tính toán thời gian chờ và chuyển sang pha tiếp theo hoặc tiếp tục đợi.
- **Check**: Thực thi các callback từ `setImmediate()`. Đây là hàm đặc biệt giúp lập trình viên thực hiện các tác vụ ngay sau khi pha Poll kết thúc.
- **Close Callbacks**: Xử lý các sự kiện đóng như `socket.destroy()`, giúp giải phóng tài nguyên bộ nhớ cho hệ thống.

Một điểm đặc biệt làm nên sức mạnh của Node.js chính là sự tồn tại của **Microtask Queue** (bao gồm `process.nextTick()` và các `Promise`). Các tác vụ trong hàng đợi này luôn có ưu tiên cao nhất và sẽ được thực thi ngay lập tức sau mỗi pha của Event Loop trước khi chuyển sang pha kế tiếp. Đối với hệ thống ACW-SRS, việc nắm vững cơ chế này giúp tối ưu hóa tốc độ phản hồi khi nhận tín hiệu từ trạm rửa xe, đảm bảo không có độ trễ trong việc xác nhận thanh toán và kích hoạt thiết bị. Ngoài ra, đối với các tác vụ nặng (như mã hóa dữ liệu hoặc thao tác file lớn), libuv sẽ sử dụng một **Thread Pool** riêng biệt để xử lý ngầm, đảm bảo luồng chính (Main Thread) luôn luôn sẵn sàng tiếp nhận yêu cầu mới.
1.1.3. Sự ra đời của ngôn ngữ TypeScript (TS)
TypeScript là một dự án mã nguồn mở được phát triển và duy trì bởi Microsoft, ra mắt lần đầu vào năm 2012. Về bản chất, nó được định nghĩa là một "superset" của JavaScript, cung cấp hệ thống định kiểu tĩnh (Static Typing) mà JavaScript thuần túy còn thiếu. TypeScript không thay thế JavaScript mà cung cấp thêm một lớp bảo vệ vững chắc, giúp quản lý mã nguồn hiệu quả hơn trong các dự án phần mềm có quy mô lớn và độ phức tạp cao.

- Giải quyết bài toán quy mô dự án: 
  - TypeScript giúp phát hiện lỗi ngay trong giai đoạn biên dịch thay vì lúc vận hành.
  - Giảm thiểu rủi ro khi làm việc nhóm và bảo trì mã nguồn trong thời gian dài.
- Cơ chế Transpile và tính tương thích: 
  - Mã TypeScript sẽ được biên dịch về JavaScript thuần để chạy trên trình duyệt.
  - Hỗ trợ các tính năng mới nhất của ECMAScript mà vẫn đảm bảo tính tương thích.
1.1.3. Các đặc tính kỹ thuật nổi bật của TypeScript
TypeScript cung cấp một hệ thống các tính năng mạnh mẽ giúp nâng cao chất lượng mã nguồn và hỗ trợ quy trình phát triển phần mềm một cách chuyên nghiệp. Các đặc tính này bao gồm:
- **Hệ thống kiểu tĩnh (Static Typing)**: Cho phép định nghĩa rõ ràng kiểu dữ liệu cho biến, tham số hàm và giá trị trả về. Các kiểu dữ liệu cơ bản bao gồm: string, number, boolean, array, enum, tuple, và any. Việc xác định kiểu giúp trình biên dịch phát hiện lỗi ngay từ giai đoạn phát triển.
- **Interfaces và Type Aliases**: Giúp định nghĩa cấu trúc của các đối tượng phức tạp, tạo ra một bản thiết kế (blueprint) cho các thành phần trong hệ thống, giúp mã nguồn trở nên minh bạch và dễ hiểu.
- **Tính năng hướng đối tượng (OOP)**: TypeScript hỗ trợ đầy đủ các khái niệm của lập trình hướng đối tượng như Class, Inheritance, Interface, và Encapsulation (Access Modifiers: public, private, protected).
- **Generic**: Cho phép tạo ra các thành phần có khả năng tái sử dụng cao với nhiều kiểu dữ liệu khác nhau mà vẫn đảm bảo tính an toàn về kiểu.
- **Hỗ trợ công cụ (Tooling)**: Cung cấp khả năng tự động hoàn thành mã (IntelliSense), kiểm tra lỗi thời gian thực và hỗ trợ tái cấu trúc mã nguồn (Refactoring) một cách an toàn trên quy mô toàn dự án.
1.2. Thư viện ReactJS và Thuật toán Virtual DOM chuyên sâu
1.2.1. Giới thiệu về thư viện ReactJS
ReactJS là một thư viện JavaScript mã nguồn mở chuyên dụng để xây dựng giao diện người dùng (UI), được phát triển và duy trì bởi Facebook. Kể từ khi ra mắt, React đã thay đổi hoàn toàn cách thức xây dựng các ứng dụng web hiện đại thông qua các đặc điểm:
- **Thư viện thay vì Framework**: React tập trung duy nhất vào lớp hiển thị (View), cho phép tích hợp linh hoạt với các thư viện khác để quản lý định tuyến hoặc trạng thái.
- **Lập trình khai báo (Declarative)**: Giúp mã nguồn trở nên dễ đoán và dễ gỡ lỗi hơn bằng cách mô tả trạng thái của giao diện tại bất kỳ thời điểm nào.
- **JSX (JavaScript XML)**: Một phần mở rộng cú pháp cho phép viết cấu trúc HTML ngay trong JavaScript, giúp tăng tính trực quan và gắn kết giữa logic và giao diện.

1.2.2. Kiến trúc dựa trên thành phần (Component-Based)
Kiến trúc của ReactJS xoay quanh khái niệm Component, đóng vai trò như các khối xây dựng cơ bản của ứng dụng:
- **Tính đóng gói (Encapsulation)**: Mỗi Component tự quản lý trạng thái và logic riêng, giúp mã nguồn trở nên sạch sẽ và dễ quản lý.
- **Tính tái sử dụng (Reusability)**: Các thành phần giao diện phổ biến có thể được đóng gói và sử dụng lại ở nhiều vị trí khác nhau trong ứng dụng, giúp giảm thiểu trùng lặp mã nguồn.
- **Cấu trúc phân cấp (Hierarchy)**: Các Component trong React không tồn tại độc lập mà được tổ chức theo một sơ đồ hình cây (Component Tree). Trong cấu trúc này, các Component "Cha" (Parent) đóng vai trò bao bọc và điều phối, truyền dữ liệu xuống các Component "Con" (Child) thông qua cơ chế Props. Sự phân cấp rõ ràng này tạo ra một luồng dữ liệu một chiều (One-way data flow), giúp việc theo dõi và kiểm soát trạng thái của ứng dụng trở nên minh bạch. Đối với các ứng dụng phức tạp như ACW-SRS, việc phân cấp giúp chia nhỏ giao diện thành các lớp logic: từ các thành phần nguyên tử (Atom) như Button, Input đến các khối chức năng (Organism) như Form thanh toán hay Dashboard quản lý, từ đó tối ưu hóa quá trình bảo trì và mở rộng hệ thống.

1.2.3. Quản lý luồng dữ liệu (Props và State)
- **Props (Properties)**: Là các thuộc tính được truyền từ Component cha xuống Component con. Props là dữ liệu chỉ đọc (Immutable), giúp đảm bảo tính minh bạch của luồng dữ liệu trong hệ thống.
- **State**: Là đối tượng lưu trữ dữ liệu nội bộ của Component, có khả năng thay đổi theo thời gian dựa trên các hành động của người dùng hoặc phản hồi từ hệ thống. Khi State thay đổi, React sẽ tự động kích hoạt quá trình cập nhật giao diện (Re-render).
- **Unidirectional Data Flow**: Dữ liệu luôn chảy theo một chiều duy nhất từ trên xuống dưới, giúp việc theo dõi sự thay đổi dữ liệu trở nên đơn giản và hiệu quả hơn.
1.2.4. React Hooks và vai trò trong phát triển ứng dụng
React Hooks được giới thiệu từ phiên bản React 16.8 nhằm cho phép Functional Component sử dụng các tính năng mạnh mẽ trước đây chỉ có ở Class Component như quản lý trạng thái, xử lý vòng đời và tương tác với dữ liệu bên ngoài.
Hooks giúp mã nguồn ngắn gọn hơn, dễ đọc hơn và giảm đáng kể độ phức tạp trong quá trình phát triển ứng dụng.
Một số Hooks phổ biến gồm:
useState:
Dùng để quản lý trạng thái (State) bên trong Functional Component.
Khi giá trị state thay đổi, React sẽ tự động render lại giao diện tương ứng.
Ví dụ: quản lý trạng thái mở/đóng của menu, dữ liệu nhập trong form hoặc danh sách sản phẩm.
useEffect:
Dùng để xử lý các tác vụ phụ (Side Effects) như gọi API, xử lý sự kiện, đồng bộ dữ liệu hoặc thao tác với Local Storage.
Hook này thường được sử dụng thay thế cho các phương thức vòng đời như `componentDidMount`, `componentDidUpdate` và `componentWillUnmount`.
useContext:
Giúp chia sẻ dữ liệu giữa nhiều component mà không cần truyền Props qua nhiều cấp trung gian.
Thường dùng cho các dữ liệu dùng chung như thông tin người dùng, giao diện sáng/tối hoặc ngôn ngữ hệ thống.
useRef:
Cho phép tham chiếu trực tiếp đến phần tử DOM hoặc lưu trữ giá trị mà không làm component render lại.
Thường dùng để focus input, thao tác animation hoặc lưu dữ liệu tạm thời.
useMemo và useCallback:
Hỗ trợ tối ưu hiệu năng bằng cách ghi nhớ giá trị tính toán hoặc hàm xử lý, tránh việc tạo lại không cần thiết trong mỗi lần render.
Việc sử dụng Hooks giúp React hiện đại trở nên linh hoạt hơn, đồng thời phù hợp với các dự án quy mô lớn yêu cầu khả năng mở rộng và bảo trì lâu dài. Đây cũng là phương pháp được ưu tiên trong hầu hết các dự án ReactJS hiện nay.
1.3. Framework Next.js và Các phương thức Rendering tiên tiến
1.3.1. Giới thiệu về Framework Next.js
Next.js là một framework mạnh mẽ dựa trên React, cung cấp các tính năng cần thiết để xây dựng các ứng dụng web sẵn sàng cho sản xuất (Production-ready). Các tính năng cốt lõi bao gồm:
- **Hệ thống Routing (File-based Routing)**: Tự động tạo ra các đường dẫn dựa trên cấu trúc thư mục và tệp tin, giúp quản lý cấu trúc trang web một cách minh bạch và dễ dàng mở rộng.
- **Tối ưu hóa tài nguyên (Optimization)**: Hỗ trợ tự động tối ưu hóa hình ảnh (Image), phông chữ (Fonts) và các đoạn mã script bên thứ ba để đảm bảo tốc độ tải trang nhanh nhất và tối ưu hóa trải nghiệm người dùng.
- **Hỗ trợ TypeScript**: Tích hợp sẵn TypeScript với các cấu hình tối ưu, giúp phát triển mã nguồn an toàn và hiệu quả thông qua hệ thống kiểu tĩnh.

1.3.2. Các chiến lược hiển thị (Rendering Strategies)
Next.js nổi bật với khả năng hỗ trợ đa dạng các phương thức hiển thị nội dung, phù hợp với nhiều loại ứng dụng khác nhau:
- **Server-Side Rendering (SSR)**: Nội dung được tạo ra trên máy chủ tại thời điểm yêu cầu, giúp tối ưu hóa SEO và đảm bảo nội dung luôn được cập nhật mới nhất.
- **Static Site Generation (SSG)**: Tạo ra các trang HTML tĩnh ngay tại thời điểm biên dịch, mang lại tốc độ truy cập tối ưu và giảm tải cho hệ thống máy chủ.
- **Incremental Static Regeneration (ISR)**: Cho phép cập nhật nội dung các trang tĩnh sau khi đã biên dịch mà không cần phải xây dựng lại toàn bộ ứng dụng.
- **Client-Side Rendering (CSR)**: Thực hiện hiển thị dữ liệu trực tiếp trên trình duyệt người dùng, phù hợp cho các ứng dụng yêu cầu tính tương tác cao và cá nhân hóa dữ liệu.
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
- **Runtime Engine**: Node.js đóng vai trò là "động cơ" cho phép Next.js thực hiện Server-Side Rendering (SSR). Khi người dùng truy cập, Node.js sẽ chạy mã React trên server để tạo ra file HTML hoàn chỉnh trước khi gửi về trình duyệt. Quá trình này được tiếp nối bởi **Hydration** – nơi React trên client sẽ "đắp" các sự kiện JavaScript vào HTML tĩnh để trang web trở nên tương tác.
- **API Handling và Middleware**: Các API Route trong Next.js thực chất là các hàm xử lý của Node.js. Lập trình viên có thể sử dụng các thư viện Node.js thuần túy để thao tác với hệ thống file, mã hóa mật khẩu hoặc kết nối trực tiếp đến các cơ sở dữ liệu như MySQL thông qua Prisma ORM. Middleware trong Next.js cho phép can thiệp vào quá trình request/response ở mức thấp, giúp kiểm tra quyền truy cập (Authorization) một cách nhanh chóng ngay tại lớp server.
- **Bảo mật và Hiệu suất**: Nhờ chạy trên Node.js, Next.js có thể quản lý các biến môi trường (Environment Variables) một cách an toàn. Các khóa bí mật (Secret Keys) của SePay hay thông tin đăng nhập Database sẽ chỉ tồn tại ở phía server, không bao giờ lộ diện ra phía client. Ngoài ra, cơ chế **Streaming** của Node.js giúp Next.js có thể truyền dữ liệu HTML theo từng phần (chunks), giúp người dùng thấy được nội dung trang web nhanh hơn đáng kể so với việc đợi toàn bộ trang được render xong.
- **Ecosystem**: Sự tương thích hoàn hảo giúp dự án dễ dàng tận dụng hàng triệu gói thư viện từ npm, từ việc xử lý ngày tháng (date-fns) đến việc xây dựng các logic nghiệp vụ phức tạp.
1.4. Công nghệ IoT và Vi điều khiển ESP32
1.4.1. Giới thiệu về dòng chip ESP32
ESP32 là một hệ thống trên chip (SoC) hiệu năng cao được phát triển bởi Espressif Systems. Nó tích hợp sẵn Wi-Fi và Bluetooth công suất thấp, phù hợp hoàn hảo cho các ứng dụng Internet of Things (IoT). Đối với các dự án kết hợp giữa phần mềm và phần cứng, ESP32 cung cấp một nền tảng thực thi mạnh mẽ với khả năng tính toán vượt trội và kết nối mạng linh hoạt.

**Một số ứng dụng thực tế phổ biến của ESP32:**
- **Nhà thông minh (Smart Home):** Điều khiển hệ thống chiếu sáng, điều hòa, rèm cửa tự động và các thiết bị gia dụng thông qua Wi-Fi hoặc Bluetooth.
- **Nông nghiệp thông minh (Smart Agriculture):** Giám sát độ ẩm đất, nhiệt độ, ánh sáng và tự động hóa hệ thống tưới tiêu, giúp tối ưu hóa năng suất cây trồng.
- **Công nghiệp tự động hóa (Industrial Automation):** Thu thập dữ liệu từ các cảm biến công nghiệp, giám sát trạng thái máy móc và điều khiển các cánh tay robot hoặc băng chuyền.
- **Hệ thống an ninh:** Tích hợp với camera (như ESP32-CAM), cảm biến chuyển động và hệ thống báo động để bảo vệ nhà ở và văn phòng.
- **Thiết bị đeo (Wearables):** Nhờ kích thước nhỏ gọn và tiêu thụ năng lượng thấp, ESP32 được dùng trong các thiết bị theo dõi sức khỏe, đồng hồ thông minh cơ bản.

Sơ đồ chi tiết các chân chức năng GPIO trên bo mạch ESP32 chuẩn
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
1.5.1. Hệ quản trị Cơ sở dữ liệu MySQL
MySQL là một hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) mã nguồn mở mạnh mẽ, được sử dụng rộng rãi để quản lý và tổ chức dữ liệu thông qua các bảng có mối liên kết.
- **Mô hình quan hệ (Relational Model)**: Dữ liệu được tổ chức thành các bảng với các hàng và cột. Các bảng liên kết với nhau thông qua các khóa (Primary Key và Foreign Key), đảm bảo tính logic và nhất quán.
- **Ngôn ngữ SQL tiêu chuẩn**: Sử dụng ngôn ngữ truy vấn có cấu trúc (SQL) để thực hiện các thao tác: SELECT (truy vấn), INSERT (thêm mới), UPDATE (cập nhật) và DELETE (xóa dữ liệu).
- **Tính bảo mật và ổn định**: Cung cấp các cơ chế quản lý quyền truy cập nghiêm ngặt và hỗ trợ các giao dịch (Transactions) để đảm bảo an toàn dữ liệu trong mọi tình huống.

1.5.2. Công cụ Prisma ORM
Prisma là một bộ công cụ cơ sở dữ liệu hiện đại, đóng vai trò là lớp trung gian giúp lập trình viên thao tác với dữ liệu một cách hiệu quả hơn:
- **Tự động tạo mã (Auto-generated Client)**: Dựa trên sơ đồ dữ liệu (Schema), Prisma tự động tạo ra thư viện truy vấn mạnh mẽ, hỗ trợ đầy đủ TypeScript.
- **Truy vấn an toàn (Type-safe Queries)**: Loại bỏ các lỗi cú pháp SQL và đảm bảo dữ liệu truy vấn luôn đúng kiểu, giúp giảm thiểu lỗi thời gian chạy (Runtime errors).
- **Quản lý Schema (Prisma Schema)**: Toàn bộ cấu trúc cơ sở dữ liệu được định nghĩa tập trung trong một tệp tin duy nhất, giúp việc quản lý và thay đổi trở nên dễ dàng.
- **Tính năng Migration**: Hỗ trợ đồng bộ hóa cấu trúc dữ liệu giữa mã nguồn và cơ sở dữ liệu thực tế một cách tự động và có kiểm soát.

**Ví dụ về cách triển khai Prisma:**
- **Prisma Schema (Định nghĩa dữ liệu):**
```prisma
model Station {
  id        Int      @id @default(autoincrement())
  name      String
  status    String   @default("OFFLINE")
  location  String?
  createdAt DateTime @default(now())
}
```
- **Prisma Client (Truy vấn dữ liệu):**
```typescript
// Lấy danh sách tất cả các trạm đang hoạt động
const activeStations = await prisma.station.findMany({
  where: { status: "ONLINE" }
});
```
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
JWT là một phương thức xác thực hiện đại, cho phép truyền tải thông tin an toàn giữa các bên dưới dạng một đối tượng JSON. Cấu trúc của một mã JWT bao gồm ba phần:
- **Header**: Chứa thông tin về loại token và thuật toán băm dữ liệu được sử dụng.
- **Payload**: Chứa các thông tin về người dùng và các dữ liệu cần thiết khác (Claims).
- **Signature**: Chữ ký số dùng để xác thực rằng thông tin gửi đi không bị thay đổi trong quá trình truyền tải.
Đặc tính cốt lõi của JWT là khả năng xác thực vô trạng thái (Stateless), giúp hệ thống có khả năng mở rộng tốt mà không tốn nhiều tài nguyên máy chủ để lưu trữ phiên làm việc.

1.9.2. Cơ chế phân quyền người dùng (Authorization)
Phân quyền là quá trình xác định những hành động mà một người dùng đã được xác thực có thể thực hiện trong hệ thống. Các mô hình phân quyền phổ biến bao gồm:
- **RBAC (Role-Based Access Control)**: Phân quyền dựa trên vai trò của người dùng. Mỗi vai trò sẽ có một tập hợp các quyền hạn nhất định.
- **ABAC (Attribute-Based Access Control)**: Phân quyền dựa trên các thuộc tính của người dùng, tài nguyên và môi trường.
Việc phân quyền đảm bảo tính bảo mật và toàn vẹn của dữ liệu bằng cách ngăn chặn người dùng truy cập vào các tài nguyên hoặc thực hiện các chức năng nằm ngoài phạm vi cho phép.
1.11. Các thư viện và công cụ hỗ trợ phát triển
Hệ sinh thái Node.js cung cấp hàng triệu thư viện mã nguồn mở, giúp rút ngắn thời gian phát triển và đảm bảo tính tiêu chuẩn cho dự án.
1.11.1. Quản lý gói với npm và pnpm
Hệ sinh thái Node.js phát triển mạnh mẽ nhờ các công cụ quản lý gói (Package Managers) giúp điều phối hàng triệu thư viện mã nguồn mở.
- **npm (Node Package Manager)**: Là trình quản lý gói mặc định và phổ biến nhất thế giới. Nó sử dụng file `package.json` để định nghĩa các phụ thuộc và `package-lock.json` để đảm bảo tính nhất quán của phiên bản thư viện trên tất cả các môi trường phát triển khác nhau. npm cài đặt thư viện theo cấu trúc "flat" (phẳng) trong thư mục `node_modules`, giúp giảm thiểu việc lặp lại các thư viện trùng lặp.
- **pnpm (performant npm)**: Trong dự án ACW-SRS, pnpm được ưu tiên sử dụng nhờ hiệu suất vượt trội. Khác với npm, pnpm sử dụng cơ chế **Content-addressable storage**. Điều này có nghĩa là nếu mười dự án cùng sử dụng một phiên bản của thư viện React, pnpm chỉ lưu duy nhất một bản sao vật lý trên ổ đĩa và tạo các **Hard link** hoặc **Symbolic link** đến thư mục của từng dự án. Cơ chế này không chỉ giúp tiết kiệm dung lượng đĩa cứng mà còn loại bỏ hoàn toàn vấn đề "Phantom dependencies" (sử dụng thư viện không được khai báo rõ ràng), giúp dự án trở nên minh bạch và an toàn hơn.
1.11.2. Các thư viện tiêu biểu sử dụng trong dự án
Để xây dựng một hệ thống hoàn chỉnh và chuyên nghiệp, dự án đã tích hợp các thư viện hàng đầu sau:
- **Axios**: Một HTTP Client dựa trên Promise dành cho trình duyệt và Node.js. Nó cung cấp các tính năng mạnh mẽ như tự động chuyển đổi dữ liệu JSON, ngăn chặn tấn công XSRF và cho phép cấu hình Interceptors để xử lý các yêu cầu hoặc phản hồi chung (như gắn Token xác thực).
- **React Hook Form**: Một thư viện tối ưu để quản lý trạng thái của các biểu mẫu. Thay vì sử dụng cơ chế Controlled Component của React (gây render lại toàn bộ form mỗi khi gõ phím), thư viện này sử dụng Uncontrolled Component thông qua Refs, giúp hiệu năng ứng dụng luôn ở mức cao nhất ngay cả với các form đăng ký trạm phức tạp.
- **Zustand**: Giải pháp quản lý trạng thái toàn cục (Global State Management) theo hướng tối giản. Zustand khắc phục các nhược điểm của Redux như sự rườm rà (boilerplate) và khó học, đồng thời cung cấp khả năng truy xuất dữ liệu cực nhanh thông qua các Selector, phù hợp hoàn hảo cho việc cập nhật trạng thái thời gian thực của các trạm rửa xe.
- **Tailwind CSS**: Một framework CSS theo triết lý "Utility-first". Thay vì viết các lớp CSS riêng lẻ, lập trình viên sử dụng các lớp tiện ích có sẵn để xây dựng giao diện ngay trong mã nguồn HTML/JSX. Điều này giúp đảm bảo tính nhất quán về mặt thiết kế (Design System), giảm kích thước file CSS cuối cùng và tăng tốc độ phát triển giao diện người dùng.
1.12. Ý nghĩa thực tiễn và Khoa học của đề tài
- Giá trị thực tiễn: Tự động hóa quy trình, giảm chi phí vận hành và tăng doanh thu.
- Giá trị khoa học: Ứng dụng thành công các công nghệ phần mềm hiện đại vào IoT.
