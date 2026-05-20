"use client";

import { useState } from "react";
import { MapPin, ArrowRight, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePincodeCheck } from "@/hooks/usePincodeCheck";
import { cn } from "@/lib/utils";

interface PincodeInputProps {
  onAvailable?: (pincode: string, homeCollection: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function PincodeInput({
  onAvailable,
  className,
  size = "md",
}: PincodeInputProps) {
  const [pincode, setPincode] = useState("");
  const { result, loading, error, check } = usePincodeCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      await check(pincode);
      if (result?.available && onAvailable) {
        onAvailable(pincode, result.homeCollection);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(val);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Enter pincode"
            value={pincode}
            onChange={handleChange}
            className={cn(
              "pl-9 font-medium tracking-widest",
              size === "lg" && "h-12 text-base",
              size === "sm" && "h-8 text-sm"
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={pincode.length !== 6 || loading}
          className={cn(
            "bg-[#0D9488] hover:bg-[#0F766E] text-white shrink-0",
            size === "lg" && "h-12 px-6"
          )}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </Button>
      </form>

      {result && (
        <div
          className={cn(
            "flex items-start gap-2 text-sm px-3 py-2.5 rounded-lg",
            result.available
              ? "bg-teal-50 text-teal-800"
              : "bg-red-50 text-red-700"
          )}
        >
          {result.available ? (
            <CheckCircle className="w-4 h-4 mt-0.5 text-teal-600 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
          )}
          <div>
            {result.available ? (
              <span>
                <strong>Great!</strong> We serve{" "}
                {result.areaName ? `${result.areaName}, ` : ""}
                {result.city}.
                {result.homeCollection
                  ? " Home collection available."
                  : " Walk-in only at our centre."}
              </span>
            ) : (
              <span>
                Sorry, we don&apos;t serve this pincode yet. We&apos;re expanding
                soon!
              </span>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 px-1">{error}</p>
      )}
    </div>
  );
}
