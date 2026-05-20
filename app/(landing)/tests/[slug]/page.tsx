import { Clock, Droplets, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, cn } from "@/lib/utils";

const MOCK_TEST = {
  name: "Complete Blood Count (CBC)",
  code: "CBC",
  price: 29900,
  discountedPrice: 19900,
  turnaroundHours: 12,
  sampleType: "blood",
  isPopular: true,
  description:
    "A Complete Blood Count (CBC) is one of the most common blood tests. It measures many components and features of your blood including red blood cells, white blood cells, hemoglobin, hematocrit, and platelets.",
  preparationInstructions:
    "No special preparation needed. You may eat and drink normally before this test.",
  parameters: [
    "Hemoglobin (Hb)", "Red Blood Cell (RBC) Count", "White Blood Cell (WBC) Count",
    "Platelet Count", "Hematocrit (HCT)", "Mean Corpuscular Volume (MCV)",
    "Mean Corpuscular Hemoglobin (MCH)", "Differential Count (DC)",
  ],
};

export default function TestDetailPage({ params }: { params: { slug: string } }) {
  const discount = MOCK_TEST.discountedPrice
    ? Math.round((1 - MOCK_TEST.discountedPrice / MOCK_TEST.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/tests"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0D9488] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tests
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                  <Droplets className="w-7 h-7 text-[#0D9488]" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {MOCK_TEST.isPopular && (
                      <Badge className="bg-[#0D9488] text-white">Popular</Badge>
                    )}
                    {discount > 0 && (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100">
                        {discount}% off
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-[#0B1F4E]">{MOCK_TEST.name}</h1>
                  <p className="text-sm font-mono text-slate-400 mt-1">Code: {MOCK_TEST.code}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-5">
                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-surface px-3 py-1.5 rounded-lg border border-border">
                  <Clock className="w-4 h-4 text-[#0D9488]" />
                  Report in {MOCK_TEST.turnaroundHours} hours
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-surface px-3 py-1.5 rounded-lg border border-border">
                  <Droplets className="w-4 h-4 text-[#0D9488]" />
                  {MOCK_TEST.sampleType} sample
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-surface px-3 py-1.5 rounded-lg border border-border">
                  <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                  NABL Accredited
                </div>
              </div>

              <Separator className="mb-5" />

              <h2 className="font-semibold text-slate-800 mb-2">About this test</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{MOCK_TEST.description}</p>
            </div>

            {/* Parameters */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-card">
              <h2 className="font-semibold text-slate-800 mb-4">
                Parameters Included ({MOCK_TEST.parameters.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MOCK_TEST.parameters.map((param) => (
                  <div key={param} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                    {param}
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation */}
            <div className="bg-teal-50 rounded-2xl border border-teal-100 p-6">
              <h2 className="font-semibold text-teal-800 mb-2">Preparation Instructions</h2>
              <p className="text-sm text-teal-700 leading-relaxed">
                {MOCK_TEST.preparationInstructions}
              </p>
            </div>
          </div>

          {/* Sidebar — booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-border p-6 shadow-card">
              <div className="mb-5">
                <p className="text-3xl font-bold text-[#0B1F4E]">
                  {formatPrice(MOCK_TEST.discountedPrice ?? MOCK_TEST.price)}
                </p>
                {discount > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-slate-400 line-through">
                      {formatPrice(MOCK_TEST.price)}
                    </p>
                    <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-xs">
                      Save {formatPrice(MOCK_TEST.price - (MOCK_TEST.discountedPrice ?? MOCK_TEST.price))}
                    </Badge>
                  </div>
                )}
              </div>

              <Link
                href={`/book?test=${params.slug}`}
                className={cn(
                  buttonVariants(),
                  "w-full bg-[#0D9488] hover:bg-[#0F766E] text-white h-11 font-semibold mb-3 flex items-center justify-center"
                )}
              >
                Book This Test
              </Link>
              <Link
                href="/tests"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full border-[#0D9488] text-[#0D9488] hover:bg-teal-50 h-11 flex items-center justify-center"
                )}
              >
                Add More Tests
              </Link>

              <div className="mt-5 space-y-2.5 text-sm text-slate-500">
                {[
                  "Home collection available",
                  "Certified phlebotomist",
                  "Report via email & app",
                  "No hidden charges",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
