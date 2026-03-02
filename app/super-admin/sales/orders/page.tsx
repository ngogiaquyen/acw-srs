import { OrderList } from "@/components/super-admin/OrderList";
import { getOrders } from "@/lib/db/orders";

export default async function SuperAdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Orders</h2>
        <p className="text-sm text-muted-foreground">Quản lý đơn hàng và tự động tạo tenant.</p>
      </div>

      <OrderList orders={orders} />
    </div>
  );
}
