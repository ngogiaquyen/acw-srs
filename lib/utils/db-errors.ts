import { NextResponse } from "next/server";

/**
 * Mảng ánh xạ tên cột sang thông báo lỗi tiếng Việt thân thiện
 */
const duplicateKeyMap: Record<string, string> = {
  "email": "Email này đã được sử dụng. Vui lòng chọn email khác.",
  "users.email": "Email này đã được sử dụng. Vui lòng chọn email khác.",
  "tenants.email": "Email này đã được sử dụng. Vui lòng chọn email khác.",
  "device_id": "Device ID này đã tồn tại trên một thiết bị khác.",
  "devices.device_id": "Device ID này đã tồn tại trên một thiết bị khác.",
  "payment_code": "Mã thanh toán này đã được sử dụng.",
  "devices.payment_code": "Mã thanh toán này đã được sử dụng.",
  "order_number": "Mã đơn hàng này đã tồn tại.",
  "orders.order_number": "Mã đơn hàng này đã tồn tại.",
  "invoice_number": "Mã hóa đơn này đã tồn tại.",
  "invoices.invoice_number": "Mã hóa đơn này đã tồn tại.",
  "qr_code": "Mã QR này đã được sử dụng.",
  "stations.qr_code": "Mã QR này đã được sử dụng.",
  "code": "Mã này đã được sử dụng.",
  "qr_codes.code": "Mã này đã được sử dụng."
};

/**
 * Xử lý lỗi Database chung và trả về NextResponse phù hợp
 * Nếu không phải lỗi xác định, trả về null để route tự xử lý tiếp
 */
export function handleDatabaseError(error: any): NextResponse | null {
  if (!error || !error.code) return null;

  // Xử lý lỗi trùng lặp dữ liệu (UNIQUE constraint fails)
  if (error.code === 'ER_DUP_ENTRY') {
    // Thông báo lỗi mẫu của MySQL: "Duplicate entry 'value' for key 'table.key_name'"
    // hoặc "Duplicate entry 'value' for key 'key_name'"
    let errorMessage = "Dữ liệu bị trùng lặp.";
    
    if (error.sqlMessage) {
      const match = error.sqlMessage.match(/for key '([^']+)'/);
      if (match && match[1]) {
        const keyName = match[1];
        if (duplicateKeyMap[keyName]) {
          errorMessage = duplicateKeyMap[keyName];
        } else {
          // Fallback parsing: lấy phần đuôi của key (ví dụ: users_email_unique -> email)
          const lowerKey = keyName.toLowerCase();
          if (lowerKey.includes("email")) errorMessage = duplicateKeyMap["email"];
          else if (lowerKey.includes("device_id")) errorMessage = duplicateKeyMap["device_id"];
          else if (lowerKey.includes("order_number")) errorMessage = duplicateKeyMap["order_number"];
          else if (lowerKey.includes("qr_code")) errorMessage = duplicateKeyMap["qr_code"];
          else if (lowerKey.includes("payment_code")) errorMessage = duplicateKeyMap["payment_code"];
        }
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 409 });
  }

  // Xử lý lỗi khóa ngoại (Foreign key constraint fails)
  if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2') {
    return NextResponse.json(
      { error: "Dữ liệu liên kết không hợp lệ hoặc đang được sử dụng ở nơi khác." },
      { status: 400 }
    );
  }

  return null;
}
