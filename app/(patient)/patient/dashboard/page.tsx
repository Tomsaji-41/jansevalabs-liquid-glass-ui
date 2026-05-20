import { auth } from "@/lib/auth/config";
import { FlaskConical, FileText, CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";

const MOCK_RECENT_ORDERS = [
  { id: 1, orderNumber: "JL12ABC", tests: ["CBC", "HbA1c"], status: "report_ready", date: "2024-01-15", total: 64800 },
  { id: 2, orderNumber: "JL34DEF", tests: ["Thyroid Profile"], status: "processing", date: "2024-01-18", total: 59900 },
];

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  booked: { label: "Booked", class: "bg-blue-50 text-blue-700 border-blue-100" },
  sample_collected: { label: "Sample Collected", class: "bg-amber-50 text-amber-700 border-amber-100" },
  processing: { label: "Processing", class: "bg-purple-50 text-purple-700 border-purple-100" },
  report_ready: { label: "Report Ready", class: "bg-teal-50 text-teal-700 border-teal-100" },
  cancelled: { label: "Cancelled", class: "bg-red-50 text-red-700 border-red-100" },
};

export default async function PatientDashboard() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white/95">
          Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"}!
        </h1>
        <p className="text-white/60 mt-1">Here&apos;s your health overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FlaskConical, label: "Tests Done", value: "12", color: "teal" },
          { icon: FileText, label: "Reports Ready", value: "10", color: "navy" },
          { icon: CalendarDays, label: "Upcoming", value: "1", color: "sky" },
          { icon: Clock, label: "Pending", value: "1", color: "amber" },
        ].map(({ icon: Icon, label, value, color }) => (
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

      {/* Recent orders */}
      <Card className="border-white/20 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold text-white/95">Recent Orders</CardTitle>
          <Link
            href="/patient/results"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-[#0D9488] hover:text-[#0F766E]")}
          >
            View All
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_RECENT_ORDERS.map((order) => {
            const st = STATUS_MAP[order.status];
            return (
              <Link
                key={order.id}
                href={`/patient/results/${order.id}`}
                className="flex items-center gap-4 p-3 rounded-xl border border-white/20 hover:relative z-10 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white/90 text-sm">#{order.orderNumber}</p>
                  <p className="text-xs text-white/60 truncate">{order.tests.join(", ")}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className={`text-xs border ${st.class} mb-1`}>{st.label}</Badge>
                  <p className="text-xs text-white/50">{formatDate(order.date)}</p>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/book"
          className={cn(buttonVariants(), "bg-[#0D9488] hover:bg-[#0F766E] text-white flex-1 h-11 flex items-center justify-center")}
        >
          Book New Test
        </Link>
        <Link
          href="/patient/results"
          className={cn(buttonVariants({ variant: "outline" }), "border-[#1E3A8A] text-[#1E3A8A] flex-1 h-11 flex items-center justify-center")}
        >
          Download Reports
        </Link>
      </div>
    </div>
  );
}
