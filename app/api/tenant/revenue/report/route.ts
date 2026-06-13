import { NextResponse } from "next/server";
import { getCurrentUserFromCookies, resolveTenantAccess } from "@/lib/auth/middleware";
import { pool } from "@/lib/db/connection";
import { convertToExcelBuffer } from "@/lib/utils/excel";
import { sendEmail } from "@/lib/utils/email";

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUserFromCookies();
    if (!auth.isAuthenticated) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const body = await request.json();
    const { rangeDays = 30, email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email nhận là bắt buộc" }, { status: 400 });
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

    // 1. Fetch Tenant details
    const [tenantRows] = await pool.query("SELECT * FROM tenants WHERE id = ? LIMIT 1", [tenantId]);
    const tenant = (tenantRows as any[])[0];
    if (!tenant) {
      return NextResponse.json({ error: "Tenant không tồn tại" }, { status: 404 });
    }

    // 2. Fetch transactions in the selected period
    const [txRows] = await pool.query(
      `SELECT t.*, d.name AS device_name, d.device_id AS device_code
       FROM transactions t
       LEFT JOIN devices d ON d.id = t.device_id
       WHERE t.tenant_id = ?
         AND t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       ORDER BY t.created_at DESC`,
      [tenantId, Number(rangeDays)]
    );
    const transactions = txRows as any[];

    // 3. Compute stats
    const completedTx = transactions.filter(t => t.status === "completed");
    const totalRevenue = completedTx.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCount = transactions.length;
    const completedCount = completedTx.length;

    // 4. Create CSV content
    const csvData = transactions.map((tx) => ({
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

    const csvColumns = [
      { key: "id", label: "Mã giao dịch hệ thống" },
      { key: "device_name", label: "Tên thiết bị" },
      { key: "device_code", label: "Mã thiết bị" },
      { key: "amount", label: "Số tiền (VND)" },
      { key: "duration", label: "Thời lượng sử dụng" },
      { key: "status", label: "Trạng thái" },
      { key: "tx_id", label: "Mã đối chiếu ngân hàng" },
      { key: "created_at", label: "Thời gian giao dịch" },
    ];

    const excelBuffer = convertToExcelBuffer(csvData, csvColumns, "Giao dịch");

    // 5. Generate beautiful HTML Email content
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });

    const recentTxRows = transactions.slice(0, 10).map((tx) => {
      const statusText =
        tx.status === "completed"
          ? `<span style="color: #16a34a; font-weight: 600;">Thành công</span>`
          : tx.status === "failed"
          ? `<span style="color: #dc2626; font-weight: 600;">Thất bại</span>`
          : `<span style="color: #475569;">${tx.status}</span>`;

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-size: 13px; color: #475569;">#${tx.id}</td>
          <td style="padding: 10px; font-size: 13px; font-weight: 500; color: #1e293b;">${tx.device_name ?? `Thiết bị #${tx.device_id}`}</td>
          <td style="padding: 10px; font-size: 13px; font-weight: 600; color: #2563eb;">${formatter.format(Number(tx.amount))}</td>
          <td style="padding: 10px; font-size: 13px; color: #475569;">${tx.duration_minutes} phút</td>
          <td style="padding: 10px; font-size: 13px;">${statusText}</td>
          <td style="padding: 10px; font-size: 12px; color: #64748b; font-family: monospace;">${tx.payment_transaction_id ?? "-"}</td>
          <td style="padding: 10px; font-size: 12px; color: #64748b;">${new Date(tx.created_at).toLocaleString("vi-VN")}</td>
        </tr>
      `;
    }).join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Báo cáo doanh thu</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">BÁO CÁO DOANH THU NGƯỜI THUÊ</h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 500;">Người thuê: ${tenant.name}</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.75;">Kỳ báo cáo: ${rangeDays} ngày qua (Tính đến hôm nay)</p>
          </div>

          <!-- Content -->
          <div style="padding: 24px;">
            <!-- KPI Cards -->
            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
              <div style="flex: 1; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #1e3a8a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Tổng Doanh Thu</p>
                <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: 800; color: #2563eb;">${formatter.format(totalRevenue)}</p>
              </div>
              <div style="flex: 1; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #166534; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Giao Dịch Thành Công</p>
                <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: 800; color: #16a34a;">${completedCount} / ${totalCount}</p>
              </div>
            </div>

            <!-- Intro text -->
            <p style="font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 24px;">
              Chào bạn,<br>
              Hệ thống xin gửi đến bạn báo cáo chi tiết về tình hình kinh doanh của các thiết bị rửa xe tự phục vụ thuộc tài khoản của bạn trong <strong>${rangeDays} ngày qua</strong>. Chi tiết toàn bộ danh sách giao dịch đã được đính kèm trong tệp tin <code>.xlsx</code> của email này.
            </p>

            <!-- Table of recent transactions -->
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 15px; color: #1e293b; font-weight: 600; margin-bottom: 12px; border-left: 4px solid #2563eb; padding-left: 8px;">10 Giao Dịch Gần Nhất</h3>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                  <thead>
                    <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Mã GD</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Thiết bị</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Số tiền</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Thời lượng</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Trạng thái</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Mã đối chiếu</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentTxRows || '<tr><td colspan="7" style="padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">Chưa có giao dịch nào trong kỳ này.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Notice -->
            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #b45309; line-height: 1.4;">
              <strong>Lưu ý:</strong> Vui lòng sử dụng Microsoft Excel, Google Sheets hoặc phần mềm tương thích để xem tệp tin <code>.xlsx</code> đính kèm chứa toàn bộ các giao dịch phát sinh trong kỳ này.
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">Đây là email tự động từ Hệ thống quản lý thiết bị cho trạm rửa xe tự phục vụ ACW-SRS.</p>
            <p style="margin: 4px 0 0 0;">Vui lòng không phản hồi trực tiếp email này.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `bao_cao_doanh_thu_tenant_${tenantId}_${timestamp}.xlsx`;

    // 6. Send the email
    const mailResult = await sendEmail({
      to: email,
      subject: `[ACW-SRS] Báo cáo doanh thu ${rangeDays} ngày qua - Người thuê: ${tenant.name}`,
      html: emailHtml,
      attachments: [
        {
          filename,
          content: excelBuffer,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    });

    if (!mailResult.success) {
      return NextResponse.json(
        { error: "Gửi email thất bại, vui lòng kiểm tra cấu hình máy chủ SMTP" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: mailResult.simulated
        ? "Báo cáo đã giả lập gửi thành công (kiểm tra console server)"
        : "Báo cáo đã gửi thành công qua email của bạn",
      simulated: mailResult.simulated,
    });
  } catch (error) {
    console.error("Error in POST /api/tenant/revenue/report:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo và gửi báo cáo" }, { status: 500 });
  }
}
