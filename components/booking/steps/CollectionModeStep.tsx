"use client";

import { useState } from "react";
import { Home, Building2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookingData } from "../BookingWizard";

interface Props {
  data: Partial<BookingData>;
  onNext: (data: Partial<BookingData>) => void;
  onBack: () => void;
}

export default function CollectionModeStep({ data, onNext, onBack }: Props) {
  const [mode, setMode] = useState<"home" | "walkin">(data.collectionMode ?? "home");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-1">Collection Method</h2>
        <p className="text-sm text-blue-600">How would you like to give your sample?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            value: "home" as const,
            icon: Home,
            title: "Home Collection",
            description: "Our certified phlebotomist visits your home at a time you choose.",
            badge: "Most Convenient",
          },
          {
            value: "walkin" as const,
            icon: Building2,
            title: "Walk-in at Lab",
            description: "Visit our nearest centre. Walk-in or book a time slot.",
            badge: null,
          },
        ].map(({ value, icon: Icon, title, description, badge }) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={cn(
              "relative text-left p-5 rounded-2xl border-2 transition-all duration-200",
              mode === value
                ? "border-[#0D9488] bg-teal-50 shadow-teal-glow"
                : "border-white/20 bg-white/5 backdrop-blur-md hover:border-slate-300"
            )}
          >
            {badge && (
              <span className="absolute top-3 right-3 text-[10px] font-semibold bg-[#0D9488] text-white px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            <div
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center mb-3",
                mode === value ? "bg-white/5 backdrop-blur-md border border-teal-100" : "relative z-10 border border-white/20"
              )}
            >
              <Icon className={cn("w-5 h-5", mode === value ? "text-[#0D9488]" : "text-blue-600")} />
            </div>
            <h3 className={cn("font-semibold mb-1", mode === value ? "text-blue-900" : "text-blue-800")}>
              {title}
            </h3>
            <p className="text-xs text-blue-600 leading-relaxed">{description}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 text-black">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={() => onNext({ collectionMode: mode })}
          className="flex-1 bg-[#0B1F4E] hover:bg-navy-900 text-white h-11 font-semibold flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
