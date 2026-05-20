import Link from "next/link";
import { Plus, Search, Pencil, ToggleLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { desc, asc } from "drizzle-orm";
import { tests } from "@/lib/db/schema";

export default async function AdminTestsPage() {
  let allTests: typeof tests.$inferSelect[] = [];
  try {
    allTests = await db.query.tests.findMany({
      orderBy: [desc(tests.isPopular), asc(tests.name)],
    });
  } catch {
    // DB not connected yet — page renders with empty list and an info banner
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4E]">Tests</h1>
          <p className="text-slate-500 mt-1">Manage diagnostic tests and pricing.</p>
        </div>
        <Link
          href="/admin/tests/new"
          className={cn(buttonVariants(), "bg-[#1E3A8A] hover:bg-navy-700 text-white flex items-center gap-2")}
        >
          <Plus className="w-4 h-4" />
          Add Test
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search tests..." className="pl-9 h-11 bg-white" />
      </div>

      {allTests.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-700">
          No tests found. {" "}
          <Link href="/admin/tests/new" className="font-semibold underline">Add your first test</Link>
          {" "}or connect your NeonDB and run <code className="font-mono bg-amber-100 px-1 rounded">npx drizzle-kit push</code>.
        </div>
      )}

      <Card className="border-border shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Test</th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Sample</th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Price</th>
                  <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-right font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allTests.map((test) => (
                  <tr key={test.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{test.name}</p>
                      <p className="text-xs font-mono text-slate-400">{test.code ?? "—"} · {test.turnaroundHours}h</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs capitalize">{test.sampleType ?? "—"}</td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#0B1F4E]">{formatPrice(test.discountedPrice ?? test.price)}</p>
                      {test.discountedPrice && test.discountedPrice < test.price && (
                        <p className="text-xs text-slate-400 line-through">{formatPrice(test.price)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5">
                        {test.isActive ? (
                          <Badge className="bg-teal-50 text-teal-700 border-teal-100 border text-xs">Active</Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-500 border-slate-200 border text-xs">Inactive</Badge>
                        )}
                        {test.isPopular && (
                          <Badge className="bg-[#0D9488] text-white text-xs">Popular</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/tests/${test.id}/edit`}
                          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-slate-500 hover:text-[#1E3A8A]")}
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-amber-600">
                          <ToggleLeft className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
