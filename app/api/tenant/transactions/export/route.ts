import { NextResponse } from "next/server";
import { getCurrentUserFromCookies, resolveTenantAccess } from "@/lib/auth/middleware";
import { getTransactionsByTenantId } from "@/lib/db/transactions";
import { convertToExcelBuffer } from "@/lib/utils/excel";

export async function GET(request: Request) {
  try {
    const auth = await getCurrentUserFromCookies();
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantIdParam = searchParams.get("tenantId");

    const access = resolveTenantAccess(auth.user, tenantIdParam);
    if (!access.ok) {
      return access.response;
    }

    const tenantId = access.tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: "Không tìm thấy thông tin tenant" }, { status: 400 });
    }

    const transactions = await getTransactionsByTenantId(tenantId);

    // Mapped data for Excel
    const excelData = transactions.map((tx) => ({
      id: tx.id,
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
      { key: "device_name", label: "Tên thiết bị" },
      { key: "device_code", label: "Mã thiết bị" },
      { key: "amount", label: "Số tiền (VND)" },
      { key: "duration", label: "Thời lượng sử dụng" },
      { key: "status", label: "Trạng thái" },
      { key: "tx_id", label: "Mã đối chiếu ngân hàng" },
      { key: "created_at", label: "Thời gian giao dịch" },
    ];

    const buffer = convertToExcelBuffer(excelData, columns, "Giao dịch");

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `giao_dich_tenant_${tenantId}_${timestamp}.xlsx`;

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/tenant/transactions/export:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi xuất dữ liệu" }, { status: 500 });
  }
}
