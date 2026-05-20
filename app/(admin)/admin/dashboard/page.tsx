import { ShoppingBag, Users, FlaskConical, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { db } from "@/lib/db";
import { orders, patients, tests } from "@/lib/db/schema";
import { eq, desc, gte, and, count, sql } from "drizzle-orm";

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  booked: { label: "Booked", class: "bg-blue-50 text-blue-700 border-blue-100" },
  sample_collected: { label: "Sample Collected", class: "bg-amber-50 text-amber-700 border-amber-100" },
  processing: { label: "Processing", class: "bg-purple-50 text-purple-700 border-purple-100" },
  report_ready: { label: "Report Ready", class: "bg-teal-50 text-teal-700 border-teal-100" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-700 border-red-100" },
};

export default async function AdminDashboard() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    [{ totalOrders }],
    [{ totalPatients }],
    [{ activeTests }],
    [{ mtdRevenue }],
    recentOrders,
  ] = await Promise.all([
    db.select({ totalOrders: count() }).from(orders),
    db.select({ totalPatients: count() }).from(patients),
    db.select({ activeTests: count() }).from(tests).where(eq(tests.isActive, true)),
    db
      .select({ mtdRevenue: sql<number>`coalesce(sum(${orders.total}), 0)` })
      .from(orders)
      .where(and(eq(orders.paymentStatus, "paid"), gte(orders.createdAt, startOfMonth))),
    db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
        patientName: patients.name,
        items: orders.items,
      })
      .from(orders)
      .leftJoin(patients, eq(orders.patientId, patients.id))
      .orderBy(desc(orders.createdAt))
      .limit(8),
  ]);

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: totalOrders.toLocaleString("en-IN"), color: "teal" },
    { icon: Users, label: "Total Patients", value: totalPatients.toLocaleString("en-IN"), color: "navy" },
    { icon: FlaskConical, label: "Active Tests", value: activeTests.toLocaleString("en-IN"), color: "sky" },
    { icon: TrendingUp, label: "Revenue (MTD)", value: formatPrice(Number(mtdRevenue)), color: "amber" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white/95">Dashboard</h1>
        <p className="text-white/60 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="border-white/20 shadow-xl">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${
                color === "teal" ? "bg-teal-50" :
                color === "navy" ? "bg-navy-50" :
                color === "sky" ? "bg-sky-50" : "bg-amber-50"
              }`}>
                <Icon className={`w-5 h-5 ${
                  color === "teal" ? "text-[#0D9488]" :
                  color === "navy" ? "text-[#1E3A8A]" :
                  color === "sky" ? "text-[#0284C7]" : "text-amber-600"
                }`} />
              </div>
              <p className="text-2xl font-bold text-white/95">{value}</p>
              <p className="text-xs text-white/60 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white/95">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-white/50 py-4">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 text-left">
                    {["Order", "Patient", "Tests", "Status", "Date", "Amount"].map((h) => (
                      <th key={h} className={`pb-3 font-semibold text-white/60 text-xs uppercase tracking-wide ${h === "Amount" ? "text-right" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((order) => {
                    const st = STATUS_MAP[order.status ?? "booked"] ?? STATUS_MAP.booked;
                    const itemNames = (order.items as Array<{ name: string }> | null)
                      ?.map((i) => i.name)
                      .join(", ") ?? "—";
                    return (
                      <tr key={order.id} className="hover:relative z-10 transition-colors">
                        <td className="py-3 font-mono text-xs font-semibold text-white/95">#{order.orderNumber}</td>
                        <td className="py-3 font-medium text-white/80">{order.patientName ?? "—"}</td>
                        <td className="py-3 text-white/60 text-xs max-w-[160px] truncate">{itemNames}</td>
                        <td className="py-3">
                          <Badge className={`border text-xs ${st.class}`}>{st.label}</Badge>
                        </td>
                        <td className="py-3 text-white/60 text-xs">
                          {order.createdAt ? formatDate(order.createdAt) : "—"}
                        </td>
                        <td className="py-3 text-right font-semibold text-white/80">{formatPrice(order.total)}</td>
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
