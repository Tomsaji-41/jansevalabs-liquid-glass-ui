import Link from "next/link";
import { Package, Plus, CheckCircle, XCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { desc, asc } from "drizzle-orm";

export default async function AdminPackagesPage() {
  let allPackages: typeof packages.$inferSelect[] = [];
  try {
    allPackages = await db.query.packages.findMany({
      orderBy: [desc(packages.isPopular), asc(packages.name)],
    });
  } catch {
    // DB not connected yet
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/95">Packages</h1>
          <p className="text-white/60 mt-1 text-sm">Manage health packages and bundled test pricing.</p>
        </div>
        <Link
          href="/admin/packages/new"
          className={cn(buttonVariants(), "bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white flex items-center gap-2")}
        >
          <Plus className="w-4 h-4" />
          Add Package
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Packages", value: allPackages.length },
          { label: "Active", value: allPackages.filter((p) => p.isActive).length },
          { label: "Inactive", value: allPackages.filter((p) => !p.isActive).length },
          { label: "Featured", value: allPackages.filter((p) => p.isPopular).length },
        ].map(({ label, value }) => (
          <Card key={label} className="border-white/20 shadow-xl">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-white/95">{value}</p>
              <p className="text-xs text-white/60 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {allPackages.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-700">
          No packages found.{" "}
          <Link href="/admin/packages/new" className="font-semibold underline">Create your first package</Link>.
        </div>
      )}

      {/* Table */}
      <Card className="border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-white/95 flex items-center gap-2">
            <Package className="w-4 h-4" />
            All Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20 text-left">
                  {["Name", "MRP", "Selling Price", "Discount", "Status", "Actions"].map((h) => (
                    <th key={h} className="pb-3 font-semibold text-white/60 text-xs uppercase tracking-wide pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allPackages.map((pkg) => {
                  const disc = pkg.discountedPrice
                    ? Math.round((1 - pkg.discountedPrice / pkg.price) * 100)
                    : 0;
                  return (
                    <tr key={pkg.id} className="hover:relative z-10 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white/90">{pkg.name}</span>
                          {pkg.isPopular && (
                            <Star className="w-3.5 h-3.5 text-[#F47920] fill-[#F47920]" />
                          )}
                        </div>
                        <p className="text-xs text-white/50 font-mono">{pkg.slug}</p>
                      </td>
                      <td className="py-3 pr-4 text-white/50 line-through text-xs">{formatPrice(pkg.price)}</td>
                      <td className="py-3 pr-4 font-semibold text-white/95">
                        {formatPrice(pkg.discountedPrice ?? pkg.price)}
                      </td>
                      <td className="py-3 pr-4">
                        {disc > 0 ? (
                          <Badge className="bg-orange-50 text-orange-600 border-orange-100 border text-xs">{disc}%</Badge>
                        ) : (
                          <span className="text-xs text-white/50">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {pkg.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#2DB549] font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-white/50 font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/packages/${pkg.id}/edit`}
                            className="text-xs text-[#1E3A8A] hover:underline font-medium"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
