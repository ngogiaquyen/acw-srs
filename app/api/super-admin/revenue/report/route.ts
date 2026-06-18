import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { pool } from "@/lib/db/connection";
import { convertToExcelBuffer } from "@/lib/utils/excel";
import { sendEmail } from "@/lib/utils/email";

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUserFromCookies();
    if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const body = await request.json();
    const { rangeDays = 30, email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email nhận là bắt buộc" }, { status: 400 });
    }

    // 1. Fetch system transactions in the selected period
    const [txRows] = await pool.query(
      `SELECT t.*, d.name AS device_name, d.device_id AS device_code, tn.name AS tenant_name
       FROM transactions t
       LEFT JOIN devices d ON d.id = t.device_id
       LEFT JOIN tenants tn ON tn.id = t.tenant_id
       WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       ORDER BY t.created_at DESC`,
      [Number(rangeDays)]
    );
    const transactions = txRows as any[];

    // 2. Fetch top tenants by revenue in this period
    const [tenantStatsRows] = await pool.query(
      `SELECT
         tn.id AS tenant_id,
         tn.name AS tenant_name,
         COALESCE(SUM(t.amount), 0) AS revenue,
         COUNT(t.id) AS transactions,
         COUNT(DISTINCT d.id) AS devices
       FROM tenants tn
       LEFT JOIN transactions t ON t.tenant_id = tn.id AND t.status = 'completed' AND t.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       LEFT JOIN devices d ON d.tenant_id = tn.id
       GROUP BY tn.id
       ORDER BY revenue DESC`,
      [Number(rangeDays)]
    );
    const topTenants = tenantStatsRows as any[];

    // 3. Compute stats
    const completedTx = transactions.filter(t => t.status === "completed");
    const totalRevenue = completedTx.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCount = transactions.length;
    const completedCount = completedTx.length;

    // 4. Create CSV content
    const csvData = transactions.map((tx) => ({
      id: tx.id,
      tenant_name: tx.tenant_name ?? `Chủ trạm #${tx.tenant_id}`,
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
      { key: "tenant_name", label: "Tên chủ trạm" },
      { key: "device_name", label: "Tên thiết bị" },
      { key: "device_code", label: "Mã thiết bị" },
      { key: "amount", label: "Số tiền (VND)" },
      { key: "duration", label: "Thời lượng sử dụng" },
      { key: "status", label: "Trạng thái" },
      { key: "tx_id", label: "Mã đối chiếu ngân hàng" },
      { key: "created_at", label: "Thời gian giao dịch" },
    ];

    const excelBuffer = convertToExcelBuffer(csvData, csvColumns, "Hệ thống");

    // 5. Generate beautiful HTML Email content
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });

    const tenantRowsHtml = topTenants.map((tn, index) => {
      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-size: 13px; color: #475569; font-weight: bold;">#${index + 1}</td>
          <td style="padding: 10px; font-size: 13px; font-weight: 500; color: #1e293b;">${tn.tenant_name}</td>
          <td style="padding: 10px; font-size: 13px; font-weight: 600; color: #10b981;">${formatter.format(Number(tn.revenue))}</td>
          <td style="padding: 10px; font-size: 13px; color: #475569;">${tn.transactions} GD</td>
          <td style="padding: 10px; font-size: 13px; color: #475569;">${tn.devices} thiết bị</td>
        </tr>
      `;
    }).join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Báo cáo doanh thu toàn hệ thống</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">BÁO CÁO DOANH THU TOÀN HỆ THỐNG</h1>
            <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9; font-weight: 500;">Vai trò: Quản Trị Viên Cấp Cao (Super Admin)</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.75;">Kỳ báo cáo: ${rangeDays} ngày qua (Tính đến hôm nay)</p>
          </div>

          <!-- Content -->
          <div style="padding: 24px;">
            <!-- KPI Cards -->
            <div style="display: flex; gap: 16px; margin-bottom: 24px;">
              <div style="flex: 1; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #166534; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Tổng Doanh Thu Hệ Thống</p>
                <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: 800; color: #10b981;">${formatter.format(totalRevenue)}</p>
              </div>
              <div style="flex: 1; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #1e3a8a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Giao Dịch Hệ Thống</p>
                <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: 800; color: #3b82f6;">${completedCount} / ${totalCount}</p>
              </div>
            </div>

            <!-- Intro text -->
            <p style="font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 24px;">
              Chào Quản trị viên,<br>
              Dưới đây là báo cáo tổng hợp tình hình kinh doanh của toàn bộ nền tảng quản lý thiết bị rửa xe tự phục vụ ACW-SRS trong <strong>${rangeDays} ngày qua</strong>. Chi tiết toàn bộ danh sách giao dịch đã được đính kèm trong tệp tin <code>.xlsx</code> của email này.
            </p>

            <!-- Table of top tenants -->
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 15px; color: #1e293b; font-weight: 600; margin-bottom: 12px; border-left: 4px solid #0f172a; padding-left: 8px;">Bảng Xếp Hạng Người Thuê (Tenants)</h3>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                  <thead>
                    <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b; width: 60px;">Hạng</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Chủ trạm</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Doanh thu</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Giao dịch</th>
                      <th style="padding: 10px; font-size: 12px; font-weight: 600; color: #64748b;">Quy mô thiết bị</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tenantRowsHtml || '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">Chưa có dữ liệu hoạt động.</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Notice -->
            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #b45309; line-height: 1.4;">
              <strong>Thông báo đối soát:</strong> Tệp đính kèm chứa dữ liệu thô bao gồm thông tin chi tiết của tất cả các giao dịch hệ thống trong kỳ này để thuận tiện cho việc kế toán và đối chiếu dữ liệu.
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
    const filename = `bao_cao_doanh_thu_toan_he_thong_${timestamp}.xlsx`;

    // 6. Send the email
    const mailResult = await sendEmail({
      to: email,
      subject: `[ACW-SRS] Báo cáo doanh thu hệ thống ${rangeDays} ngày qua - Super Admin`,
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
    console.error("Error in POST /api/super-admin/revenue/report:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo và gửi báo cáo" }, { status: 500 });
  }
}
