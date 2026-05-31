"use client";

import { useState } from "react";
import { MapPin, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BookingData } from "../BookingWizard";

interface Props {
  data: Partial<BookingData>;
  onNext: (data: Partial<BookingData>) => void;
}

export default function PincodeStep({ data, onNext }: Props) {
  const [pincode, setPincode] = useState(data.pincode ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ available: boolean; homeCollection: boolean; areaName?: string } | null>(null);

  const check = async () => {
    if (pincode.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch("/api/pincodes/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode }),
      });
      const d = await res.json();
      setResult(d);
    } catch {
      setResult({ available: false, homeCollection: false });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (result?.available) {
      onNext({ pincode, areaName: result.areaName ?? "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-1">Check Coverage</h2>
        <p className="text-sm text-blue-600">Enter your pincode to confirm we serve your area.</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
          <Input
            type="text"
            inputMode="numeric"
            placeholder="6-digit pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="pl-9 h-11 text-lg tracking-widest font-medium"
          />
        </div>
        <Button
          onClick={check}
          disabled={pincode.length !== 6 || loading}
          className="bg-[#0D9488] hover:bg-[#0F766E] text-white h-11 px-6"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
        </Button>
      </div>

      {result && (
        <div className={`rounded-xl p-4 flex items-start gap-3 ${result.available ? "bg-teal-50 border border-teal-100" : "bg-red-50 border border-red-100"}`}>
          {result.available ? (
            <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`font-semibold text-sm ${result.available ? "text-teal-800" : "text-red-700"}`}>
              {result.available ? "Great news! We serve your area." : "Sorry, we don't cover this pincode yet."}
            </p>
            {result.available && result.areaName && (
              <p className="text-sm text-teal-700 mt-0.5">
                {result.areaName} · {result.homeCollection ? "Home collection available" : "Walk-in only"}
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={handleNext}
        disabled={!result?.available}
        className="w-full bg-[#0B1F4E] hover:bg-navy-900 text-white h-11 font-semibold flex items-center gap-2"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
