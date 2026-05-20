"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight, Clock, Droplets, Home,
  ShieldCheck, Plus, CheckCircle2, Search, X, Loader2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import { useDebounce } from "@/hooks/useDebounce";

interface TestItem {
  id: number;
  name: string;
  code: string;
  price: number;
  discountedPrice?: number | null;
  turnaroundHours: number;
  sampleType: string;
  slug: string;
  isPopular: boolean;
  description: string;
  parameters: string[];
  preparation: string;
  homeCollection: boolean;
}

const POPULAR_TESTS: TestItem[] = [
  {
    id: 1, name: "Complete Blood Count (CBC)", code: "CBC", price: 29900, discountedPrice: 19900,
    turnaroundHours: 12, sampleType: "blood", slug: "cbc", isPopular: true,
    description: "A fundamental health screening that measures all types of blood cells to detect infections, anaemia, and immune disorders.",
    parameters: ["Haemoglobin", "RBC Count", "WBC & Differential", "Platelets", "Haematocrit"],
    preparation: "No fasting required", homeCollection: true,
  },
  {
    id: 2, name: "HbA1c (Diabetes)", code: "HBA1C", price: 59900, discountedPrice: 44900,
    turnaroundHours: 24, sampleType: "blood", slug: "hba1c", isPopular: true,
    description: "Measures your average blood sugar levels over the past 2–3 months. Essential for diabetes diagnosis and monitoring.",
    parameters: ["Glycated Haemoglobin", "Estimated Average Glucose", "Risk Assessment"],
    preparation: "No fasting required", homeCollection: true,
  },
  {
    id: 3, name: "Thyroid Profile (T3, T4, TSH)", code: "THYROID", price: 79900, discountedPrice: 59900,
    turnaroundHours: 24, sampleType: "blood", slug: "thyroid-profile", isPopular: true,
    description: "Evaluates thyroid gland function to detect hypothyroidism, hyperthyroidism, and other thyroid disorders.",
    parameters: ["T3 (Triiodothyronine)", "T4 (Thyroxine)", "TSH (Thyroid Stimulating)"],
    preparation: "No fasting required", homeCollection: true,
  },
  {
    id: 4, name: "Lipid Profile", code: "LIPID", price: 69900, discountedPrice: 49900,
    turnaroundHours: 24, sampleType: "blood", slug: "lipid-profile", isPopular: false,
    description: "Measures cholesterol and triglyceride levels to assess your cardiovascular risk and heart health status.",
    parameters: ["Total Cholesterol", "LDL & HDL", "Triglycerides", "VLDL", "Cholesterol Ratio"],
    preparation: "10–12 hrs fasting", homeCollection: true,
  },
  {
    id: 5, name: "Liver Function Test (LFT)", code: "LFT", price: 89900, discountedPrice: 69900,
    turnaroundHours: 24, sampleType: "blood", slug: "lft", isPopular: false,
    description: "Assesses liver health by measuring enzymes, proteins, and bilirubin. Useful in liver disease monitoring.",
    parameters: ["SGOT / SGPT", "Bilirubin (Total & Direct)", "Alkaline Phosphatase", "Albumin", "GGT"],
    preparation: "No fasting required", homeCollection: true,
  },
  {
    id: 6, name: "Vitamin D (25-OH)", code: "VITD", price: 129900, discountedPrice: 89900,
    turnaroundHours: 48, sampleType: "blood", slug: "vitamin-d", isPopular: true,
    description: "Checks Vitamin D levels in the blood. Deficiency is linked to bone loss, fatigue, and weakened immunity.",
    parameters: ["25-Hydroxyvitamin D", "Deficiency Classification", "Clinical Interpretation"],
    preparation: "No fasting required", homeCollection: true,
  },
];

export default function FeaturedTests() {
  const { addItem, isInCart } = useCart();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TestItem[] | null>(null);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) { setSearchResults(null); return; }

    let cancelled = false;
    setSearching(true);

    fetch(`/api/tests?search=${encodeURIComponent(trimmed)}&limit=6`)
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => {
        if (!cancelled) {
          setSearchResults(
            Array.isArray(data)
              ? data.map((t) => ({
                  id: t.id,
                  name: t.name,
                  code: t.code ?? "",
                  price: t.price,
                  discountedPrice: t.discountedPrice,
                  turnaroundHours: t.turnaroundHours ?? 24,
                  sampleType: t.sampleType ?? "blood",
                  slug: t.slug,
                  isPopular: t.isPopular ?? false,
                  description: t.shortDescription ?? t.description ?? "",
                  parameters: [],
                  preparation: t.preparationInstructions ?? "",
                  homeCollection: true,
                }))
              : []
          );
        }
      })
      .catch(() => { if (!cancelled) setSearchResults([]); })
      .finally(() => { if (!cancelled) setSearching(false); });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const clear = useCallback(() => {
    setQuery("");
    setSearchResults(null);
    inputRef.current?.focus();
  }, []);

  const displayTests = searchResults ?? POPULAR_TESTS;
  const isSearching = query.trim().length > 0;

  return (
    <section className="bg-white/5 backdrop-blur-md py-16 md:py-20">
      {/* Heading row — left: title, right: search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

          {/* Left */}
          <div>
            <Badge className="bg-[#2DB549]/10 text-[#1D7D31] border-[#2DB549]/20 mb-3">
              Most Booked
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white/95 leading-tight">
              Popular Tests
            </h2>
            <p className="text-white/70 mt-2 max-w-sm text-base">
              High-accuracy tests trusted by thousands of patients every month
            </p>
            <Link
              href="/tests"
              className={cn(buttonVariants({ variant: "ghost" }), "text-[#2DB549] hover:text-[#25A03F] hover:bg-[#2DB549]/10 mt-2 -ml-3 inline-flex items-center gap-1.5")}
            >
              View all tests <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — search */}
          <div className="w-full md:w-96 lg:w-[440px] shrink-0">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
              Search 500+ tests
            </p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. CBC, thyroid, vitamin D…"
                className="w-full h-12 pl-11 pr-10 rounded-xl border-2 border-white/20 focus:border-[#2DB549] focus:outline-none bg-white/5 backdrop-blur-md text-sm shadow-sm transition-colors"
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#2DB549]" />
              )}
              {!searching && query && (
                <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* Popular chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {["CBC", "HbA1c", "Thyroid", "Vitamin D", "KFT"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 hover:bg-[#2DB549]/10 hover:border-[#2DB549]/30 hover:text-[#2DB549] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search status */}
        {isSearching && !searching && (
          <p className="text-sm text-white/60 mb-6">
            {displayTests.length > 0
              ? <><span className="font-semibold text-white/80">{displayTests.length}</span> result{displayTests.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;</>
              : <>No tests found for &ldquo;<span className="font-semibold text-white/80">{query}</span>&rdquo; — <Link href={`/tests?search=${encodeURIComponent(query)}`} className="text-[#2DB549] hover:underline">browse all tests</Link></>
            }
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {displayTests.map((test) => {
            const discount = test.discountedPrice
              ? Math.round((1 - test.discountedPrice / test.price) * 100)
              : 0;
            const inCart = isInCart(test.id, "test");

            return (
              <div
                key={test.id}
                className="group bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Accent bar */}
                <div className="h-1 bg-green-gradient" />

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + badges */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#2DB549]/10 border border-[#2DB549]/15 flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-[#2DB549]" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {test.isPopular && (
                        <Badge className="bg-[#2DB549] hover:bg-[#2DB549] text-white text-[10px] px-2 py-0.5">
                          Popular
                        </Badge>
                      )}
                      {discount > 0 && (
                        <Badge variant="secondary" className="bg-white/5 backdrop-blur-md text-orange-600 border-orange-100 text-[10px] px-2 py-0.5">
                          {discount}% off
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Name + code */}
                  <h3 className="font-bold text-white/90 text-sm leading-snug mb-0.5 group-hover:text-[#2DB549] transition-colors">
                    {test.name}
                  </h3>
                  <p className="text-[10px] font-mono text-white/50 mb-2">{test.code}</p>

                  {/* Description */}
                  <p className="text-xs text-white/70 leading-relaxed mb-4 line-clamp-3">
                    {test.description}
                  </p>

                  {/* Parameters */}
                  {test.parameters.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-1.5">
                        Includes
                      </p>
                      <ul className="space-y-1">
                        {test.parameters.slice(0, 3).map((param) => (
                          <li key={param} className="flex items-center gap-1.5 text-xs text-white/70">
                            <CheckCircle2 className="w-3 h-3 text-[#2DB549] shrink-0" />
                            {param}
                          </li>
                        ))}
                        {test.parameters.length > 3 && (
                          <li className="text-[10px] text-white/50 pl-4.5">+{test.parameters.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 mt-auto">
                    <span className="flex items-center gap-1 text-[10px] text-white/60 bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-2 py-1">
                      <Clock className="w-3 h-3" />
                      {test.turnaroundHours}h
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-white/60 bg-white/5 backdrop-blur-md border border-white/20 rounded-full px-2 py-1 capitalize">
                      <Droplets className="w-3 h-3" />
                      {test.sampleType}
                    </span>
                    {test.homeCollection && (
                      <span className="flex items-center gap-1 text-[10px] text-[#2DB549] bg-[#2DB549]/10 border border-[#2DB549]/20 rounded-full px-2 py-1">
                        <Home className="w-3 h-3" />
                        Home
                      </span>
                    )}
                  </div>

                  {/* Preparation */}
                  {test.preparation && (
                    <div className="flex items-center gap-1.5 text-[10px] text-white/60 mb-4">
                      <ShieldCheck className="w-3 h-3 text-[#F47920] shrink-0" />
                      <span className="font-medium text-white/80">{test.preparation}</span>
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="border-t border-white/20 pt-4 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-white/95">
                          {formatPrice(test.discountedPrice ?? test.price)}
                        </span>
                        {test.discountedPrice && test.discountedPrice < test.price && (
                          <span className="text-xs text-white/50 line-through">
                            {formatPrice(test.price)}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/tests/${test.slug}`}
                        className="text-[10px] text-[#2DB549] hover:underline mt-0.5 inline-block"
                      >
                        View details →
                      </Link>
                    </div>

                    <button
                      onClick={() => !inCart && addItem({
                        id: test.id,
                        type: "test",
                        name: test.name,
                        code: test.code,
                        price: test.price,
                        discountedPrice: test.discountedPrice ?? undefined,
                      })}
                      disabled={inCart}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 shrink-0",
                        inCart
                          ? "bg-[#2DB549]/10 text-[#2DB549] border border-[#2DB549]/30 cursor-default"
                          : "bg-[#2DB549] hover:bg-[#25A03F] text-white shadow-green-glow hover:shadow-md"
                      )}
                      aria-label={inCart ? "Already in cart" : `Add ${test.name} to cart`}
                    >
                      {inCart ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" /> Added</>
                      ) : (
                        <><Plus className="w-3.5 h-3.5" /> Add</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
