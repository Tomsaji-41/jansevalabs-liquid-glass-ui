import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TestCard from "@/components/tests/TestCard";

const MOCK_TESTS = [
  { id: 1, name: "Complete Blood Count (CBC)", slug: "cbc", code: "CBC", price: 29900, discountedPrice: 19900, turnaroundHours: 12, sampleType: "blood", isPopular: true, shortDescription: "Evaluates overall health and detects disorders like anemia, infection, and blood diseases." },
  { id: 2, name: "HbA1c (Diabetes)", slug: "hba1c", code: "HBA1C", price: 59900, discountedPrice: 44900, turnaroundHours: 24, sampleType: "blood", isPopular: true, shortDescription: "Measures average blood sugar levels over 2–3 months. Key test for diabetes monitoring." },
  { id: 3, name: "Thyroid Profile (T3, T4, TSH)", slug: "thyroid-profile", code: "THYROID", price: 79900, discountedPrice: 59900, turnaroundHours: 24, sampleType: "blood", isPopular: true, shortDescription: "Comprehensive thyroid function assessment including all key hormones." },
  { id: 4, name: "Lipid Profile", slug: "lipid-profile", code: "LIPID", price: 69900, discountedPrice: 49900, turnaroundHours: 24, sampleType: "blood", isPopular: false, shortDescription: "Measures cholesterol and triglycerides to assess cardiovascular risk." },
  { id: 5, name: "Liver Function Test (LFT)", slug: "lft", code: "LFT", price: 89900, discountedPrice: 69900, turnaroundHours: 24, sampleType: "blood", isPopular: false, shortDescription: "Evaluates liver health including bilirubin, enzymes, and proteins." },
  { id: 6, name: "Vitamin D (25-OH)", slug: "vitamin-d", code: "VITD", price: 129900, discountedPrice: 89900, turnaroundHours: 48, sampleType: "blood", isPopular: true, shortDescription: "Measures Vitamin D levels — essential for bone health and immunity." },
  { id: 7, name: "Urine Routine (RE/ME)", slug: "urine-routine", code: "URINE", price: 19900, discountedPrice: 14900, turnaroundHours: 6, sampleType: "urine", isPopular: false, shortDescription: "Comprehensive urine analysis for kidney health, infections, and metabolic conditions." },
  { id: 8, name: "Blood Glucose Fasting", slug: "blood-glucose-fasting", code: "BSF", price: 14900, discountedPrice: 9900, turnaroundHours: 6, sampleType: "blood", isPopular: false, shortDescription: "Measures fasting blood sugar — primary test for diabetes diagnosis." },
  { id: 9, name: "Kidney Function Test (KFT)", slug: "kft", code: "KFT", price: 79900, discountedPrice: 59900, turnaroundHours: 24, sampleType: "blood", isPopular: false, shortDescription: "Assesses kidney function through creatinine, urea, and electrolyte levels." },
  { id: 10, name: "Vitamin B12", slug: "vitamin-b12", code: "VITB12", price: 99900, discountedPrice: 69900, turnaroundHours: 48, sampleType: "blood", isPopular: false, shortDescription: "Measures B12 levels — important for nerve function and red blood cell production." },
  { id: 11, name: "C-Reactive Protein (CRP)", slug: "crp", code: "CRP", price: 49900, discountedPrice: 39900, turnaroundHours: 24, sampleType: "blood", isPopular: false, shortDescription: "Detects inflammation and infection in the body." },
  { id: 12, name: "Iron Studies", slug: "iron-studies", code: "IRON", price: 89900, discountedPrice: 69900, turnaroundHours: 24, sampleType: "blood", isPopular: false, shortDescription: "Serum iron, TIBC, and ferritin to assess iron deficiency or overload." },
];

const CATEGORIES = ["All", "Blood Tests", "Hormone Tests", "Urine Tests", "Vitamin Tests", "Cardiac Tests"];

export default function TestsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Page header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F4E] mb-2">
            Diagnostic Tests
          </h1>
          <p className="text-slate-500">
            500+ tests available · Home collection · Fast reports
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tests by name or code..."
              className="pl-9 h-11"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2 h-11 shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={cat === "All" ? "default" : "secondary"}
              className={
                cat === "All"
                  ? "bg-[#0D9488] hover:bg-[#0F766E] text-white cursor-pointer px-4 py-1.5"
                  : "bg-white border-border text-slate-600 hover:bg-teal-50 hover:text-[#0D9488] hover:border-teal-200 cursor-pointer px-4 py-1.5"
              }
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-5">
          Showing <span className="font-semibold text-slate-700">{MOCK_TESTS.length}</span> tests
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_TESTS.map((test) => (
            <TestCard key={test.id} {...test} />
          ))}
        </div>
      </div>
    </div>
  );
}
