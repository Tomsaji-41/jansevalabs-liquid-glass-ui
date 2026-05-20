"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, FlaskConical, Heart, Activity,
  Brain, Baby, Stethoscope, ArrowRight
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";

const CATEGORIES = [
  { id: "all", label: "All Packages" },
  { id: "preventive", label: "Preventive" },
  { id: "diabetes", label: "Diabetes" },
  { id: "cardiac", label: "Cardiac" },
  { id: "women", label: "Women" },
  { id: "senior", label: "Senior" },
];

const PACKAGES = [
  {
    id: 101,
    name: "Essential Health Check",
    slug: "essential-health-check",
    category: "preventive",
    description: "Perfect annual checkup covering all core health markers.",
    price: 299900,
    discountedPrice: 199900,
    testsCount: 28,
    isPopular: false,
    color: "green" as const,
    icon: Activity,
    tests: ["Complete Blood Count", "Blood Sugar (F&PP)", "Lipid Profile", "Kidney Function", "Liver Function", "Urine Routine", "Thyroid (TSH)", "Serum Creatinine"],
  },
  {
    id: 102,
    name: "Full Body Checkup",
    slug: "full-body-checkup",
    category: "preventive",
    description: "Comprehensive 60+ parameter assessment for complete peace of mind.",
    price: 699900,
    discountedPrice: 449900,
    testsCount: 62,
    isPopular: true,
    color: "orange" as const,
    icon: Stethoscope,
    tests: ["60+ Parameters", "Thyroid Profile", "Vitamin D & B12", "Cardiac Markers", "Hormone Panel", "Iron Studies", "HbA1c", "Cancer Screening (basic)"],
  },
  {
    id: 103,
    name: "Diabetes Care Package",
    slug: "diabetes-care",
    category: "diabetes",
    description: "Monitor and manage diabetes with a targeted diagnostic panel.",
    price: 399900,
    discountedPrice: 279900,
    testsCount: 18,
    isPopular: false,
    color: "green" as const,
    icon: Activity,
    tests: ["HbA1c", "Fasting & PP Sugar", "Kidney Function", "Lipid Profile", "Urine Microalbumin", "Thyroid (TSH)", "Vitamin B12", "Urine Routine"],
  },
  {
    id: 104,
    name: "Heart Health Package",
    slug: "heart-health",
    category: "cardiac",
    description: "Evaluate cardiac risk with a complete heart function assessment.",
    price: 499900,
    discountedPrice: 349900,
    testsCount: 22,
    isPopular: false,
    color: "green" as const,
    icon: Heart,
    tests: ["Lipid Profile", "ECG (at lab)", "Troponin I", "CRP (hs)", "Homocysteine", "BNP", "Fasting Sugar", "CBC"],
  },
  {
    id: 105,
    name: "Women's Wellness",
    slug: "womens-wellness",
    category: "women",
    description: "Hormonal and nutritional screening tailored for women's health.",
    price: 599900,
    discountedPrice: 399900,
    testsCount: 34,
    isPopular: false,
    color: "orange" as const,
    icon: Baby,
    tests: ["Thyroid Profile", "Hormone Panel (FSH, LH)", "Vitamin D & B12", "Iron Studies", "CBC", "HbA1c", "Prolactin", "PAP Smear (at lab)"],
  },
  {
    id: 106,
    name: "Senior Citizen Panel",
    slug: "senior-citizen",
    category: "senior",
    description: "Comprehensive screening designed for adults above 60.",
    price: 799900,
    discountedPrice: 549900,
    testsCount: 48,
    isPopular: false,
    color: "green" as const,
    icon: Brain,
    tests: ["Full Body Parameters", "Bone Health (Vit D, Calcium)", "Kidney & Liver", "Cardiac Markers", "Thyroid", "Blood Sugar", "Eye Pressure (at lab)", "Urine & Stool"],
  },
];

const colorMap = {
  green: {
    gradient: "from-brand-green-400 to-brand-green-600",
    iconBg: "bg-[#F0FFF5] border-[#2DB549]/20",
    iconColor: "text-[#2DB549]",
    check: "text-[#2DB549]",
    btn: "bg-[#2DB549] hover:bg-[#25A03F] text-white shadow-green-glow",
    badge: "border-[#2DB549] text-[#2DB549]",
  },
  orange: {
    gradient: "from-orange-400 to-orange-600",
    iconBg: "bg-orange-50 border-orange-200",
    iconColor: "text-[#F47920]",
    check: "text-[#F47920]",
    btn: "bg-[#F47920] hover:bg-[#C2410C] text-white shadow-orange-glow",
    badge: "border-[#F47920] text-[#F47920]",
  },
};

export default function PackagesPage() {
  const [active, setActive] = useState("all");
  const { addItem, isInCart } = useCart();

  const filtered = active === "all" ? PACKAGES : PACKAGES.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(45,181,73,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(244,121,32,0.10),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="bg-[#F47920]/20 text-[#F97316] border-[#F47920]/30 mb-4">
            Save More Together
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Health Packages</h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Bundled diagnostic tests at significantly lower prices. Ideal for annual checkups and preventive care.
          </p>
          <div className="flex flex-wrap gap-6 mt-8 text-sm">
            {[["6", "Curated packages"], ["500+", "Tests covered"], ["Up to 40%", "Savings vs individual"], ["Home", "Sample collection"]].map(([v, l]) => (
              <div key={l}>
                <span className="font-bold text-white text-lg">{v}</span>
                <span className="text-slate-400 ml-1.5">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold border transition-all",
                active === cat.id
                  ? "bg-[#2DB549] text-white border-[#2DB549] shadow-green-glow"
                  : "bg-white text-slate-600 border-border hover:border-[#2DB549] hover:text-[#2DB549]"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pkg) => {
            const colors = colorMap[pkg.color];
            const discount = Math.round((1 - pkg.discountedPrice / pkg.price) * 100);
            const inCart = isInCart(pkg.id, "package");
            const Icon = pkg.icon;

            return (
              <div
                key={pkg.slug}
                className={cn(
                  "bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden",
                  pkg.isPopular && "ring-2 ring-[#F47920]"
                )}
              >
                {pkg.isPopular && (
                  <div className="bg-[#F47920] text-white text-xs font-semibold text-center py-1.5 tracking-wide">
                    ⭐ Most Popular
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center", colors.iconBg)}>
                      <Icon className={cn("w-6 h-6", colors.iconColor)} />
                    </div>
                    <Badge variant="outline" className={cn("text-xs font-semibold", colors.badge)}>
                      {discount}% off
                    </Badge>
                  </div>

                  <h3 className="font-bold text-[#0B1F4E] text-lg mb-1">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 mb-2">{pkg.testsCount} parameters included</p>
                  <p className="text-sm text-slate-500 mb-5 leading-relaxed">{pkg.description}</p>

                  <ul className="space-y-2 mb-5 flex-1">
                    {pkg.tests.map((t) => (
                      <li key={t} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0", colors.check)} />
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-border pt-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-[#0B1F4E]">{formatPrice(pkg.discountedPrice)}</span>
                        <span className="text-sm text-slate-400 line-through">{formatPrice(pkg.price)}</span>
                      </div>
                      <Link href={`/book?package=${pkg.slug}`} className="text-xs text-[#2DB549] hover:underline mt-0.5 inline-block">
                        View details →
                      </Link>
                    </div>
                    <button
                      onClick={() => !inCart && addItem({ id: pkg.id, type: "package", name: pkg.name, price: pkg.price, discountedPrice: pkg.discountedPrice })}
                      disabled={inCart}
                      className={cn(
                        "shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                        inCart
                          ? "bg-[#F0FFF5] text-[#2DB549] border border-[#2DB549]/30 cursor-default"
                          : colors.btn
                      )}
                    >
                      {inCart ? "Added ✓" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">No packages in this category.</div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-[#F0FFF5] border border-[#2DB549]/20 rounded-2xl p-8 text-center">
          <FlaskConical className="w-10 h-10 text-[#2DB549] mx-auto mb-3" />
          <h3 className="text-xl font-bold text-[#0B1F4E] mb-2">Looking for individual tests?</h3>
          <p className="text-slate-500 mb-5">Browse our catalogue of 500+ diagnostic tests.</p>
          <Link
            href="/tests"
            className={cn(buttonVariants(), "bg-[#2DB549] hover:bg-[#25A03F] text-white inline-flex items-center gap-2")}
          >
            Browse All Tests <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
