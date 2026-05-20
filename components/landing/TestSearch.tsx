"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, Droplets, Plus, CheckCircle2, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice, cn } from "@/lib/utils";
import type { Test } from "@/lib/db/schema";

export default function TestSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem, isInCart } = useCart();

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setOpen(true);

    fetch(`/api/tests?search=${encodeURIComponent(trimmed)}&limit=8`)
      .then((r) => r.json())
      .then((data: Test[]) => {
        if (!cancelled) {
          setResults(Array.isArray(data) ? data : []);
          setActiveIndex(-1);
        }
      })
      .catch(() => { if (!cancelled) setResults([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <section className="bg-white/5 backdrop-blur-md border-b border-white/20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white/95">Find your test</h2>
          <p className="text-white/60 mt-1 text-sm">Search from 500+ tests by name, code, or condition</p>
        </div>

        <div className="max-w-2xl mx-auto" ref={wrapperRef}>
          <div className="relative">
            {/* Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (!e.target.value.trim()) { setOpen(false); setResults([]); } }}
                onFocus={() => { if (results.length > 0) setOpen(true); }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. CBC, diabetes, thyroid, vitamin D…"
                className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-white/20 focus:border-[#2DB549] focus:outline-none text-base bg-white/5 backdrop-blur-md shadow-xl transition-colors"
                aria-label="Search diagnostic tests"
                aria-autocomplete="list"
                aria-expanded={open}
                role="combobox"
              />
              {query && (
                <button
                  onClick={clear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {open && (
              <div
                className="absolute z-50 top-full left-0 right-0 mt-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden"
                role="listbox"
              >
                {loading && (
                  <div className="flex items-center gap-2 px-5 py-4 text-sm text-white/60">
                    <Loader2 className="w-4 h-4 animate-spin text-[#2DB549]" />
                    Searching…
                  </div>
                )}

                {!loading && results.length === 0 && debouncedQuery.trim() && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-white/60 text-sm mb-2">
                      No tests found for &ldquo;<span className="font-semibold text-white/80">{debouncedQuery}</span>&rdquo;
                    </p>
                    <Link href="/tests" className="text-sm text-[#2DB549] hover:underline font-medium" onClick={() => setOpen(false)}>
                      Browse all tests →
                    </Link>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <>
                    <ul>
                      {results.map((test, idx) => {
                        const inCart = isInCart(test.id, "test");
                        const discount = test.discountedPrice
                          ? Math.round((1 - test.discountedPrice / test.price) * 100)
                          : 0;

                        return (
                          <li
                            key={test.id}
                            role="option"
                            aria-selected={idx === activeIndex}
                            className={cn(
                              "flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/20 last:border-0 transition-colors",
                              idx === activeIndex ? "bg-[#2DB549]/10" : "hover:bg-white/5"
                            )}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-[#2DB549]/10 border border-[#2DB549]/15 flex items-center justify-center shrink-0 mt-0.5">
                                <Droplets className="w-4 h-4 text-[#2DB549]" />
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={`/tests/${test.slug}`}
                                  className="font-semibold text-white/90 text-sm hover:text-[#2DB549] transition-colors line-clamp-1"
                                  onClick={() => setOpen(false)}
                                >
                                  {test.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  {test.code && (
                                    <span className="text-xs font-mono text-white/50">{test.code}</span>
                                  )}
                                  <span className="flex items-center gap-1 text-xs text-white/50">
                                    <Clock className="w-3 h-3" />
                                    {test.turnaroundHours}h
                                  </span>
                                  {discount > 0 && (
                                    <span className="text-xs text-orange-500 font-semibold">{discount}% off</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <p className="font-bold text-sm text-white/95">
                                  {formatPrice(test.discountedPrice ?? test.price)}
                                </p>
                                {test.discountedPrice && test.discountedPrice < test.price && (
                                  <p className="text-xs text-white/50 line-through">{formatPrice(test.price)}</p>
                                )}
                              </div>
                              <button
                                onClick={() => !inCart && addItem({
                                  id: test.id,
                                  type: "test",
                                  name: test.name,
                                  code: test.code ?? undefined,
                                  price: test.price,
                                  discountedPrice: test.discountedPrice ?? undefined,
                                })}
                                disabled={inCart}
                                className={cn(
                                  "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shrink-0",
                                  inCart
                                    ? "bg-[#2DB549]/10 text-[#2DB549] border border-[#2DB549]/30 cursor-default"
                                    : "bg-[#2DB549] hover:bg-[#25A03F] text-white shadow-green-glow"
                                )}
                                aria-label={inCart ? "Already added" : `Add ${test.name}`}
                              >
                                {inCart ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5" />
                                )}
                                {inCart ? "Added" : "Add"}
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="px-5 py-3 bg-white/5 border-t border-white/20 flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{debouncedQuery}&rdquo;
                      </span>
                      <Link
                        href={`/tests?search=${encodeURIComponent(debouncedQuery)}`}
                        className="text-xs text-[#2DB549] hover:underline font-medium"
                        onClick={() => setOpen(false)}
                      >
                        View all results →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Popular searches */}
          {!query && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <span className="text-xs text-white/50">Popular:</span>
              {["CBC", "HbA1c", "Thyroid", "Vitamin D", "Lipid Profile", "Kidney Function"].map((term) => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/70 hover:bg-[#2DB549]/10 hover:text-[#2DB549] transition-colors border border-transparent hover:border-[#2DB549]/20"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
