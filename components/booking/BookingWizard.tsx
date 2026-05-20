"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import PincodeStep from "./steps/PincodeStep";
import CollectionModeStep from "./steps/CollectionModeStep";
import SlotPickerStep from "./steps/SlotPickerStep";
import PatientDetailsStep from "./steps/PatientDetailsStep";
import SummaryStep from "./steps/SummaryStep";

const STEPS = [
  { label: "Pincode", shortLabel: "Pincode" },
  { label: "Collection", shortLabel: "Mode" },
  { label: "Schedule", shortLabel: "Slot" },
  { label: "Details", shortLabel: "You" },
  { label: "Confirm", shortLabel: "Done" },
];

export interface BookingData {
  pincode: string;
  areaName: string;
  collectionMode: "home" | "walkin";
  date: string;
  slot: string;
  patientName: string;
  patientMobile: string;
  patientEmail: string;
  patientDob: string;
  patientGender: string;
  address: string;
}

export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<BookingData>>({});

  const update = (partial: Partial<BookingData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  i < step
                    ? "bg-[#0D9488] text-white"
                    : i === step
                    ? "bg-[#0B1F4E] text-white ring-4 ring-navy-100"
                    : "bg-white border-2 border-border text-slate-400"
                )}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[11px] mt-1.5 font-medium hidden sm:block",
                  i === step ? "text-[#0B1F4E]" : "text-slate-400"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors",
                  i < step ? "bg-[#0D9488]" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8">
        {step === 0 && (
          <PincodeStep data={data} onNext={(d) => { update(d); next(); }} />
        )}
        {step === 1 && (
          <CollectionModeStep data={data} onNext={(d) => { update(d); next(); }} onBack={back} />
        )}
        {step === 2 && (
          <SlotPickerStep data={data} onNext={(d) => { update(d); next(); }} onBack={back} />
        )}
        {step === 3 && (
          <PatientDetailsStep data={data} onNext={(d) => { update(d); next(); }} onBack={back} />
        )}
        {step === 4 && (
          <SummaryStep data={data as BookingData} onBack={back} />
        )}
      </div>
    </div>
  );
}
