import Link from "next/link";
import { ArrowRight, CheckCircle2, FlaskConical } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";

const PACKAGES = [
  {
    name: "Essential Health Check",
    slug: "essential-health-check",
    description: "Perfect for annual checkups. Covers all major health markers.",
    price: 299900,
    discountedPrice: 199900,
    tests: ["CBC", "Blood Sugar", "Lipid Profile", "Kidney Function", "Liver Function", "Urine Routine"],
    isPopular: false,
    color: "green",
  },
  {
    name: "Full Body Checkup",
    slug: "full-body-checkup",
    description: "Comprehensive 60+ parameter health assessment for complete peace of mind.",
    price: 699900,
    discountedPrice: 449900,
    tests: ["60+ Tests", "Thyroid Profile", "Vitamin D & B12", "Cardiac Markers", "Hormone Panel", "Cancer Screening (basic)"],
    isPopular: true,
    color: "orange",
  },
  {
    name: "Diabetes Care Package",
    slug: "diabetes-care",
    description: "Monitor and manage diabetes with our targeted diagnostic panel.",
    price: 399900,
    discountedPrice: 279900,
    tests: ["HbA1c", "Fasting & PP Sugar", "Kidney Function", "Lipid Profile", "Urine Microalbumin", "Thyroid (TSH)"],
    isPopular: false,
    color: "green",
  },
];

const colorMap = {
  green: {
    accent: "text-[#2DB549]",
    iconBg: "bg-[#2DB549]/15 border-[#2DB549]/20",
    checkColor: "text-[#2DB549]",
    popularRing: "ring-[#2DB549]/50",
  },
  orange: {
    accent: "text-[#F47920]",
    iconBg: "bg-[#F47920]/15 border-[#F47920]/20",
    checkColor: "text-[#F47920]",
    popularRing: "ring-[#F47920]/50",
  },
};

export default function HealthPackages() {
  return (
    <section className="py-16 md:py-24 bg-slate-900 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#F47920]/8 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-[#2DB549]/8 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block bg-[#F47920]/15 text-[#F97316] border border-[#F47920]/20 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
              Save More Together
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Health Packages
            </h2>
            <p className="text-white/50 mt-2 max-w-md text-base">
              Bundled tests at significantly lower prices. Ideal for annual checkups and preventive health monitoring.
            </p>
          </div>
          <Link
            href="/packages"
            className={cn(buttonVariants({ variant: "ghost" }), "text-[#2DB549] hover:text-[#3ECB57] hover:bg-[#2DB549]/10 hidden sm:inline-flex items-center gap-1.5")}
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => {
            const colors = colorMap[pkg.color as keyof typeof colorMap];
            const discount = Math.round((1 - pkg.discountedPrice / pkg.price) * 100);
            return (
              <div
                key={pkg.slug}
                className={cn(
                  "relative bg-white/5 backdrop-blur-md rounded-2xl p-6 flex flex-col shadow-xl",
                  pkg.isPopular ? "ring-2 ring-[#F47920] shadow-orange-glow scale-[1.02]" : ""
                )}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#F47920] hover:bg-[#F47920] text-white px-4 py-1 shadow-sm text-xs font-semibold">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl ${colors.iconBg} border flex items-center justify-center`}>
                    <FlaskConical className={`w-5 h-5 ${colors.accent}`} />
                  </div>
                  <Badge variant="outline" className={`${colors.accent} border-current bg-transparent text-xs font-semibold`}>
                    {discount}% off
                  </Badge>
                </div>

                <h3 className="font-bold text-white/95 text-lg mb-1.5">{pkg.name}</h3>
                <p className="text-sm text-white/60 mb-5 leading-relaxed">{pkg.description}</p>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {pkg.tests.map((test) => (
                    <li key={test} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${colors.checkColor}`} />
                      {test}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-white/95">
                      {formatPrice(pkg.discountedPrice)}
                    </span>
                    <span className="text-sm text-white/50 line-through">
                      {formatPrice(pkg.price)}
                    </span>
                  </div>
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className={cn(
                      buttonVariants(),
                      "w-full flex items-center justify-center font-semibold",
                      pkg.isPopular
                        ? "bg-[#F47920] hover:bg-[#C2410C] text-white shadow-orange-glow"
                        : "bg-[#2DB549] hover:bg-[#25A03F] text-white shadow-green-glow"
                    )}
                  >
                    Book This Package
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/packages"
            className={cn(buttonVariants({ variant: "outline" }), "border-[#2DB549]/40 text-[#2DB549] hover:bg-[#2DB549]/10")}
          >
            View All Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
