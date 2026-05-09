import codecs

filepath = r'e:\JOB\esp32\acw-srs\documents\file_do_an.md'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

references_text = """

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
"""

# append to file
with codecs.open(filepath, 'a', 'utf-8') as f:
    f.write(references_text)

print("Appended references successfully.")
