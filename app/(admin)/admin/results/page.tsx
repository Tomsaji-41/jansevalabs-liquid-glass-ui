import { FileBarChart, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { db } from "@/lib/db";
import { results, orders, patients, tests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-amber-50 text-amber-700 border-amber-100" },
  processing: { label: "Processing", class: "bg-purple-50 text-purple-700 border-purple-100" },
  released: { label: "Released", class: "bg-[#F0FFF5] text-[#1D7D31] border-[#2DB549]/20" },
};

export default async function AdminResultsPage() {
  const allResults = await db
    .select({
      id: results.id,
      status: results.status,
      reportUrl: results.reportUrl,
      collectedAt: results.collectedAt,
      orderId: results.orderId,
      orderNumber: orders.orderNumber,
      patientName: patients.name,
      patientMobile: patients.mobile,
      testName: tests.name,
    })
    .from(results)
    .leftJoin(orders, eq(results.orderId, orders.id))
    .leftJoin(patients, eq(results.patientId, patients.id))
    .leftJoin(tests, eq(results.testId, tests.id))
    .orderBy(desc(results.collectedAt));

  const pending = allResults.filter((r) => r.status === "pending").length;
  const processing = allResults.filter((r) => r.status === "processing").length;
  const released = allResults.filter((r) => r.status === "released").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F4E]">Results</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage sample collection and report release.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Results", value: allResults.length, color: "text-[#0B1F4E]" },
          { label: "Pending", value: pending, color: "text-amber-600" },
          { label: "Processing", value: processing, color: "text-purple-600" },
          { label: "Released", value: released, color: "text-[#2DB549]" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="border-border shadow-card">
            <CardContent className="p-5">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#0B1F4E] flex items-center gap-2">
            <FileBarChart className="w-4 h-4" />
            All Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allResults.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">No results yet. They will appear here once orders are collected.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    {["Order", "Patient", "Test", "Collected", "Status", "Actions"].map((h) => (
                      <th key={h} className="pb-3 font-semibold text-slate-500 text-xs uppercase tracking-wide pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allResults.map((r) => {
                    const st = STATUS_MAP[r.status ?? "pending"] ?? STATUS_MAP.pending;
                    return (
                      <tr key={r.id} className="hover:bg-surface transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs font-semibold text-[#0B1F4E]">
                          #{r.orderNumber ?? "—"}
                        </td>
                        <td className="py-3 pr-4">
                          <p className="font-medium text-slate-800">{r.patientName ?? "—"}</p>
                          <p className="text-xs text-slate-400 font-mono">{r.patientMobile ?? ""}</p>
                        </td>
                        <td className="py-3 pr-4 text-slate-600 text-xs max-w-[150px] truncate">
                          {r.testName ?? "—"}
                        </td>
                        <td className="py-3 pr-4 text-slate-500 text-xs">
                          {r.collectedAt ? formatDate(r.collectedAt) : "—"}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge className={`border text-xs ${st.class}`}>{st.label}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {r.reportUrl ? (
                              <a
                                href={r.reportUrl}
                                className="text-xs text-[#2DB549] hover:underline font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Report
                              </a>
                            ) : (
                              <button className="inline-flex items-center gap-1 text-xs text-[#1E3A8A] hover:underline font-medium">
                                <Upload className="w-3 h-3" />
                                Upload
                              </button>
                            )}
                            {r.status !== "released" && (
                              <button className="text-xs text-slate-400 hover:text-[#2DB549] font-medium">
                                Mark Released
                              </button>
                            )}
                          </div>
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
