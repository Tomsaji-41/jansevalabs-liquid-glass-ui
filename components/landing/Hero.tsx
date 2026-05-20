"use client";

import Link from "next/link";
import { ArrowRight, Home, Building2, Star, Shield, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import PincodeInput from "@/components/shared/PincodeInput";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 0,
    label: "Home Collection",
    tag: "🏠 We come to you",
    tagClass: "text-[#5dcaa5] border-[#5dcaa5]/30",
    highlight: "text-[#5dcaa5]",
  },
  {
    id: 1,
    label: "Fast Results",
    tag: "⚡ Reports in 24 hrs",
    tagClass: "text-[#1D9E75] border-[#1D9E75]/30",
    highlight: "text-[#1D9E75]",
  },
  {
    id: 2,
    label: "Affordable Care",
    tag: "💰 Save up to 50%",
    tagClass: "text-[#38BDF8] border-[#38BDF8]/30",
    highlight: "text-[#38BDF8]",
  },
];

const STATS = [
  { icon: Star,   value: "4.9★", label: "Patient Rating" },
  { icon: Zap,    value: "24hrs", label: "Turnaround" },
  { icon: Shield, value: "500+",  label: "Tests" },
  { icon: Home,   value: "50+",   label: "Pincodes" },
];

export default function Hero() {
  const router = useRouter();
  const [, setCoverage] = useState<{ pincode: string; homeCollection: boolean } | null>(null);
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  // Auto-rotate every 4.5s
  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  const handlePincodeAvailable = (pincode: string, homeCollection: boolean) => {
    setCoverage({ pincode, homeCollection });
    setTimeout(() => {
      router.push(`/book?pincode=${pincode}&mode=${homeCollection ? "home" : "walkin"}`);
    }, 800);
  };
  return (
    <section className="relative overflow-hidden border-b border-border/20">
      {/* Generated abstract background image */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: "url('/images/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />

      {/* ── Content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">

          {/* Left */}
          <div className="flex-1 min-w-0">
            {/* Trust + slide tag */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div 
                className="inline-flex items-center gap-2 rounded-full px-3 py-1"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(20px) saturate(180%) brightness(1.1)",
                  WebkitBackdropFilter: "blur(20px) saturate(180%) brightness(1.1)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  borderTop: "1px solid rgba(255, 255, 255, 0.45)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.12)",
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#5dcaa5] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.90)" }}>
                  NABL Accredited · ICMR Certified
                </span>
              </div>
              <span
                className={cn(
                  "inline-flex items-center text-[11px] font-semibold border rounded-full px-3 py-1 transition-all duration-500",
                  slide.tagClass
                )}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                {slide.tag}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-3" style={{ color: "rgba(255,255,255,0.95)" }}>
              Lab Tests,{" "}
              <span className={cn("font-display italic font-normal transition-colors duration-500", slide.highlight)}>
                at your doorstep
              </span>
            </h1>
            <p className="text-base leading-relaxed mb-5 max-w-md" style={{ color: "rgba(255,255,255,0.55)" }}>
              Book 500+ diagnostic tests online. Certified phlebotomists collect
              your sample at home — results in 24–48 hours.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tests"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "font-semibold flex items-center gap-2"
                )}
                style={{
                  background: "rgba(29,158,117,0.55)",
                  border: "1px solid rgba(255,255,255,0.30)",
                  borderTop: "1px solid rgba(255,255,255,0.50)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.2)",
                  borderRadius: "14px",
                  color: "rgba(255,255,255,0.95)"
                }}
              >
                Browse All Tests
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/packages"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" })
                )}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "14px",
                  color: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                Health Packages
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-6">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm"
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "rgba(255,255,255,0.9)" }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none" style={{ color: "rgba(255,255,255,0.9)" }}>{value}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel controls */}
            <div className="mt-7 flex items-center gap-3">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
              <div className="flex gap-1.5">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}: ${s.label}`}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      i === current
                        ? "w-5 h-2 bg-[#2DB549]"
                        : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
              <span className="text-xs text-slate-400 ml-1">{slide.label}</span>
            </div>
          </div>

          {/* Right — pincode card */}
          <div className="w-full md:w-80 lg:w-96 shrink-0 relative z-10">
            <div 
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
                WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderTop: "1px solid rgba(255, 255, 255, 0.45)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
                borderRadius: "20px"
              }}
            >
              <p className="text-base font-semibold mb-1" style={{ color: "rgba(255,255,255,0.95)" }}>Check coverage</p>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Enter your pincode to see if we serve your area</p>
              <PincodeInput onAvailable={handlePincodeAvailable} size="lg" />

              <div className="flex gap-2 mt-4">
                <div 
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium flex-1 justify-center"
                  style={{
                    background: "rgba(29,158,117,0.12)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.9)"
                  }}
                >
                  <Home className="w-3.5 h-3.5" />
                  Home Collection
                </div>
                <div 
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium flex-1 justify-center"
                  style={{
                    background: "rgba(24,95,165,0.12)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.9)"
                  }}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Walk-in
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
