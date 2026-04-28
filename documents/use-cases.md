
### 1. Nhóm chức năng chung
- **Đăng nhập** (Hệ thống xác thực cho Admin và Người thuê)

### 2. Nhóm Quản lý người thuê (Dành cho Admin)
- **Quản lý người thuê** (Use Case tổng quát)
    - Xem thông tin người thuê
    - Thêm người thuê
    - Sửa người thuê
    - Xóa người thuê

### 3. Nhóm Quản lý doanh thu (Dành cho Admin)
- **Quản lý doanh thu** (Use Case tổng quát)
    - Xem doanh thu
    - Gửi báo cáo doanh thu

### 4. Nhóm Quản lý giao dịch (Dành cho Admin & Người thuê)
- **Quản lý giao dịch** (Use Case tổng quát)
    - Xem giao dịch
    - Xuất file thống kê

### 5. Nhóm Quản lý thiết bị (Dành cho Admin & Người thuê)
- **Quản lý thiết bị** (Use Case tổng quát)
    - Xem thiết bị
    - Thêm thiết bị
    - Sửa cấu hình thiết bị
    - Xóa thiết bị

### 6. Nhóm chức năng Khách hàng (Customer)
- **Thanh toán**

### 7. Nhóm chức năng Thiết bị IoT (IoT Device)
- **Đăng ký hệ thống**
- **Gửi trạng thái**
- **Nhận lệnh điều khiển**

---
**Lưu ý về sơ đồ:** 
- Các chức năng "Xem, Thêm, Sửa, Xóa" được nối bằng quan hệ `<<extend>>` tới Use Case quản lý tổng quát. 
- Các Use Case quản lý đều có quan hệ `<<include>>` tới Use Case **Đăng nhập** (nghĩa là phải đăng nhập mới thực hiện được các thao tác quản lý).