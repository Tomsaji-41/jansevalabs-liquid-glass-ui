import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, User, Phone, Package, Clock, CreditCard, FileBarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { orders, patients, results, tests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OrderStatusActions from "@/components/admin/OrderStatusActions";

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  booked: { label: "Booked", class: "bg-blue-50 text-blue-700 border-blue-100" },
  sample_collected: { label: "Sample Collected", class: "bg-amber-50 text-amber-700 border-amber-100" },
  processing: { label: "Processing", class: "bg-purple-50 text-purple-700 border-purple-100" },
  report_ready: { label: "Report Ready", class: "bg-[#F0FFF5] text-[#1D7D31] border-[#2DB549]/20" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-700 border-red-100" },
};

const ORDER_STEPS = ["booked", "sample_collected", "processing", "report_ready"];

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) notFound();

  const [orderRow] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      total: orders.total,
      subtotal: orders.subtotal,
      discount: orders.discount,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      razorpayPaymentId: orders.razorpayPaymentId,
      collectionMode: orders.collectionMode,
      collectionAddress: orders.collectionAddress,
      collectionPincode: orders.collectionPincode,
      items: orders.items,
      createdAt: orders.createdAt,
      patientId: orders.patientId,
      patientName: patients.name,
      patientMobile: patients.mobile,
      patientEmail: patients.email,
    })
    .from(orders)
    .leftJoin(patients, eq(orders.patientId, patients.id))
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!orderRow) notFound();

  const orderResults = await db
    .select({
      id: results.id,
      status: results.status,
      reportUrl: results.reportUrl,
      testName: tests.name,
      testCode: tests.code,
    })
    .from(results)
    .leftJoin(tests, eq(results.testId, tests.id))
    .where(eq(results.orderId, orderId));

  const st = STATUS_MAP[orderRow.status ?? "booked"] ?? STATUS_MAP.booked;
  const stepIndex = ORDER_STEPS.indexOf(orderRow.status ?? "booked");
  const orderItems = orderRow.items as Array<{ name: string; type: string; price: number }> | null ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-slate-500")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
        <div className="flex-1 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#0B1F4E]">Order #{orderRow.orderNumber}</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Placed on {orderRow.createdAt ? formatDate(orderRow.createdAt) : "—"}
            </p>
          </div>
          <Badge className={`border text-sm px-3 py-1 ${st.class}`}>{st.label}</Badge>
        </div>
      </div>

      {/* Progress tracker */}
      <Card className="border-border shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-0">
            {ORDER_STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const isLast = i === ORDER_STEPS.length - 1;
              const label = STATUS_MAP[step]?.label ?? step;
              return (
                <div key={step} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
                      done ? "bg-[#2DB549] border-[#2DB549] text-white" : "bg-white border-border text-slate-400"
                    )}>
                      {i + 1}
                    </div>
                    <span className={cn("text-[10px] mt-1 text-center leading-tight w-16", done ? "text-[#2DB549] font-semibold" : "text-slate-400")}>
                      {label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={cn("flex-1 h-0.5 mx-1 mb-4", done && i < stepIndex ? "bg-[#2DB549]" : "bg-border")} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Patient */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E] flex items-center gap-2">
              <User className="w-4 h-4" /> Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-800">{orderRow.patientName ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mobile</span>
              <span className="font-mono text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {orderRow.patientMobile ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email</span>
              <span className="text-slate-700">{orderRow.patientEmail ?? "—"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Collection */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E] flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Collection Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Mode</span>
              <span className="font-medium capitalize text-slate-800">{orderRow.collectionMode}</span>
            </div>
            {orderRow.collectionMode === "home" && orderRow.collectionAddress && (
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 shrink-0">Address</span>
                <span className="text-slate-700 text-right">
                  {orderRow.collectionAddress}, {orderRow.collectionPincode}
                </span>
              </div>
            )}
            {orderRow.collectionPincode && (
              <div className="flex justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Pincode
                </span>
                <span className="font-mono text-slate-700">{orderRow.collectionPincode}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-[#0B1F4E] flex items-center gap-2">
            <Package className="w-4 h-4" /> Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 font-semibold text-slate-500 text-xs uppercase tracking-wide">Item</th>
                <th className="pb-2 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orderItems.map((item, i) => (
                <tr key={i}>
                  <td className="py-3">
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{item.type}</p>
                  </td>
                  <td className="py-3 text-right font-semibold text-slate-700">{formatPrice(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{formatPrice(orderRow.subtotal)}</span>
            </div>
            {(orderRow.discount ?? 0) > 0 && (
              <div className="flex justify-between text-[#2DB549]">
                <span>Discount</span>
                <span>−{formatPrice(orderRow.discount ?? 0)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[#0B1F4E] text-base pt-1 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(orderRow.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment + Results */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E] flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <Badge className={
                orderRow.paymentStatus === "paid"
                  ? "bg-[#F0FFF5] text-[#1D7D31] border-[#2DB549]/20 border"
                  : orderRow.paymentStatus === "failed"
                  ? "bg-red-50 text-red-700 border-red-100 border"
                  : "bg-amber-50 text-amber-700 border-amber-100 border"
              }>
                {orderRow.paymentStatus === "paid" ? "Paid" : orderRow.paymentStatus === "failed" ? "Failed" : "Pending"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Razorpay ID</span>
              <span className="font-mono text-xs text-slate-700">{orderRow.razorpayPaymentId ?? "—"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E] flex items-center gap-2">
              <FileBarChart className="w-4 h-4" /> Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {orderResults.length === 0 ? (
              <p className="text-xs text-slate-400">No results uploaded yet.</p>
            ) : (
              orderResults.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <span className="text-slate-700 text-xs">
                    {r.testName ?? "—"}
                    {r.testCode && <span className="font-mono text-slate-400 ml-1">({r.testCode})</span>}
                  </span>
                  {r.reportUrl ? (
                    <a href={r.reportUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2DB549] hover:underline font-medium">
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-amber-500 font-medium capitalize">{r.status ?? "Pending"}</span>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status update */}
      {orderRow.status !== "cancelled" && (
        <Card className="border-[#1E3A8A]/20 bg-navy-50 shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Update Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusActions orderId={orderRow.id} currentStatus={orderRow.status ?? "booked"} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
