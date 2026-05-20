import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import Link from "next/link";
import { db } from "@/lib/db";
import { orders, patients } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  booked: { label: "Booked", class: "bg-blue-50 text-blue-700 border-blue-100" },
  sample_collected: { label: "Sample Collected", class: "bg-amber-50 text-amber-700 border-amber-100" },
  processing: { label: "Processing", class: "bg-purple-50 text-purple-700 border-purple-100" },
  report_ready: { label: "Report Ready", class: "bg-teal-50 text-teal-700 border-teal-100" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-700 border-red-100" },
};

export default async function AdminOrdersPage() {
  const allOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      total: orders.total,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      collectionMode: orders.collectionMode,
      collectionPincode: orders.collectionPincode,
      createdAt: orders.createdAt,
      items: orders.items,
      patientName: patients.name,
      patientMobile: patients.mobile,
    })
    .from(orders)
    .leftJoin(patients, eq(orders.patientId, patients.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white/95">Orders</h1>
        <p className="text-white/60 mt-1">Manage and track all patient orders.</p>
      </div>

      <Card className="border-white/20 shadow-xl">
        <CardContent className="p-0">
          {allOrders.length === 0 ? (
            <p className="text-sm text-white/50 px-5 py-8">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 relative z-10">
                    {["Order", "Patient", "Tests", "Mode", "Payment", "Status", "Date", "Amount", ""].map((h) => (
                      <th key={h} className={`px-4 py-3 text-left font-semibold text-white/60 text-xs uppercase tracking-wide ${h === "" ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allOrders.map((order) => {
                    const st = STATUS_MAP[order.status ?? "booked"] ?? STATUS_MAP.booked;
                    const itemNames = (order.items as Array<{ name: string }> | null)
                      ?.map((i) => i.name)
                      .join(", ") ?? "—";
                    return (
                      <tr key={order.id} className="hover:relative z-10/50 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-white/95">
                          #{order.orderNumber}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-white/80">{order.patientName ?? "—"}</p>
                          <p className="text-xs text-white/50 font-mono">{order.patientMobile ?? ""}</p>
                        </td>
                        <td className="px-4 py-3.5 text-white/60 text-xs max-w-[140px] truncate">{itemNames}</td>
                        <td className="px-4 py-3.5 text-xs text-white/60 capitalize">{order.collectionMode}</td>
                        <td className="px-4 py-3.5">
                          <Badge className={`border text-xs ${
                            order.paymentStatus === "paid"
                              ? "bg-[#2DB549]/10 text-[#1D7D31] border-[#2DB549]/20"
                              : order.paymentStatus === "failed"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
                            {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "failed" ? "Failed" : "Pending"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge className={`border text-xs ${st.class}`}>{st.label}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-white/60">
                          {order.createdAt ? formatDate(order.createdAt) : "—"}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-white/80">{formatPrice(order.total)}</td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-[#1E3A8A] hover:bg-navy-50 text-xs")}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
