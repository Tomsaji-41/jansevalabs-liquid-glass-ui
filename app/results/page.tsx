"use client";

import { useState } from "react";
import Link from "next/link";
import { FlaskConical, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function QuickResultPage() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.replace(/\D/g, "").length !== 10) return;
    setLoading(true);
    setTimeout(() => {
      router.push(`/results/${mobile.replace(/\D/g, "")}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-teal-gradient flex items-center justify-center shadow-teal-glow">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-display italic text-2xl text-[#0B1F4E]">Janseva</span>
              <span className="block text-[10px] font-semibold tracking-widest text-[#0D9488] uppercase -mt-0.5">
                Diagnostics
              </span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-card-hover p-7">
          <h1 className="text-2xl font-bold text-[#0B1F4E] mb-1">View Your Results</h1>
          <p className="text-slate-500 text-sm mb-6">
            Enter your registered mobile number to access your diagnostic reports.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="mobile"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="pl-9 h-11 text-lg tracking-widest font-medium"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={mobile.replace(/\D/g, "").length !== 10 || loading}
              className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white h-11 font-semibold flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>View Reports <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center">
            <p className="text-sm text-slate-500">
              Want a full patient account?{" "}
              <Link href="/sign-in" className="text-[#0D9488] hover:underline font-medium">
                Sign in
              </Link>{" "}
              or{" "}
              <Link href="/sign-up" className="text-[#0D9488] hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Having trouble? Call{" "}
          <a href="tel:+911800000000" className="text-[#0D9488]">
            1800-000-0000
          </a>
        </p>
      </div>
    </div>
  );
}
