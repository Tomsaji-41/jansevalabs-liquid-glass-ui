import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { db } from "@/lib/db";
import { patients, orders } from "@/lib/db/schema";
import { eq, desc, sql, count } from "drizzle-orm";

export default async function AdminPatientsPage() {
  const allPatients = await db
    .select({
      id: patients.id,
      name: patients.name,
      mobile: patients.mobile,
      email: patients.email,
      pincode: patients.pincode,
      createdAt: patients.createdAt,
      orderCount: sql<number>`count(${orders.id})::int`,
    })
    .from(patients)
    .leftJoin(orders, eq(orders.patientId, patients.id))
    .groupBy(patients.id)
    .orderBy(desc(patients.createdAt));

  const totalPatients = allPatients.length;
  const repeatPatients = allPatients.filter((p) => p.orderCount > 1).length;
  const newThisMonth = allPatients.filter((p) => {
    if (!p.createdAt) return false;
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return new Date(p.createdAt) >= start;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white/95">Patients</h1>
        <p className="text-white/60 mt-1 text-sm">View and manage registered patients.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Patients", value: totalPatients.toLocaleString("en-IN") },
          { label: "New This Month", value: newThisMonth.toLocaleString("en-IN") },
          { label: "Repeat Patients", value: repeatPatients.toLocaleString("en-IN") },
        ].map(({ label, value }) => (
          <Card key={label} className="border-white/20 shadow-xl">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-white/95">{value}</p>
              <p className="text-xs text-white/60 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white/95 flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allPatients.length === 0 ? (
            <p className="text-sm text-white/50 py-4">No patients yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20 text-left">
                    {["Patient", "Mobile", "Pincode", "Orders", "Registered"].map((h) => (
                      <th key={h} className="pb-3 font-semibold text-white/60 text-xs uppercase tracking-wide pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allPatients.map((p) => (
                    <tr key={p.id} className="hover:relative z-10 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-navy-50 border border-navy-100 flex items-center justify-center text-[#1E3A8A] text-xs font-bold shrink-0">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-white/90">{p.name}</p>
                            <p className="text-xs text-white/50">{p.email ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-white/70">{p.mobile}</td>
                      <td className="py-3 pr-4 text-white/60 text-xs font-mono">{p.pincode ?? "—"}</td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-navy-50 text-[#1E3A8A] text-xs font-bold">
                          {p.orderCount}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-white/60 text-xs">
                        {p.createdAt ? formatDate(p.createdAt) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-xs text-white/50">
            Showing {allPatients.length} patient{allPatients.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
