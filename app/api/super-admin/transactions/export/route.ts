import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getAllTransactions } from "@/lib/db/transactions";
import { convertToExcelBuffer } from "@/lib/utils/excel";

export async function GET(request: Request) {
  try {
    const auth = await getCurrentUserFromCookies();
    if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tenantIdParam = searchParams.get("tenantId");
    const tenantId = tenantIdParam ? parseInt(tenantIdParam, 10) : undefined;
    const deviceIdParam = searchParams.get("deviceId");
    const deviceId = deviceIdParam ? parseInt(deviceIdParam, 10) : undefined;

    const transactions = await getAllTransactions(tenantId, deviceId);

    // Mapped data for Excel
    const excelData = transactions.map((tx) => ({
      id: tx.id,
      tenant_name: tx.tenant_name ?? "-",
      device_name: tx.device_name ?? `Thiết bị #${tx.device_id}`,
      device_code: tx.device_code ?? "-",
      amount: tx.amount,
      duration: `${tx.duration_minutes} phút`,
      status:
        tx.status === "completed"
          ? "Thành công"
          : tx.status === "failed"
          ? "Thất bại"
          : tx.status === "refunded"
          ? "Hoàn tiền"
          : "Chờ xử lý",
      tx_id: tx.payment_transaction_id ?? "-",
      created_at: tx.created_at,
    }));

    const columns = [
      { key: "id", label: "Mã giao dịch hệ thống" },
      { key: "tenant_name", label: "Chủ trạm" },
      { key: "device_name", label: "Tên thiết bị" },
      { key: "device_code", label: "Mã thiết bị" },
      { key: "amount", label: "Số tiền (VND)" },
      { key: "duration", label: "Thời lượng sử dụng" },
      { key: "status", label: "Trạng thái" },
      { key: "tx_id", label: "Mã đối chiếu ngân hàng" },
      { key: "created_at", label: "Thời gian giao dịch" },
    ];

    const buffer = convertToExcelBuffer(excelData, columns, "Giao dịch hệ thống");

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `giao_dich_he_thong_${timestamp}.xlsx`;

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/super-admin/transactions/export:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xuất dữ liệu" }, { status: 500 });
  }
}
