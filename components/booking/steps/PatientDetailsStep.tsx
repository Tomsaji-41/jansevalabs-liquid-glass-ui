"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { BookingData } from "../BookingWizard";

interface Props {
  data: Partial<BookingData>;
  onNext: (data: Partial<BookingData>) => void;
  onBack: () => void;
}

export default function PatientDetailsStep({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState({
    patientName: data.patientName ?? "",
    patientMobile: data.patientMobile ?? "",
    patientEmail: data.patientEmail ?? "",
    patientDob: data.patientDob ?? "",
    patientGender: data.patientGender ?? "",
    address: data.address ?? "",
  });

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const isValid =
    form.patientName.trim() &&
    form.patientMobile.replace(/\D/g, "").length === 10 &&
    (data.collectionMode === "walkin" || form.address.trim());

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white/95 mb-1">Patient Details</h2>
        <p className="text-sm text-white/60">We need these details to send your report.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            placeholder="Patient's full name"
            value={form.patientName}
            onChange={(e) => set("patientName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="mobile">Mobile Number *</Label>
          <Input
            id="mobile"
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={form.patientMobile}
            onChange={(e) => set("patientMobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="For report delivery"
            value={form.patientEmail}
            onChange={(e) => set("patientEmail", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={form.patientDob}
            onChange={(e) => set("patientDob", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Gender</Label>
          <div className="flex gap-2">
            {["Male", "Female", "Other"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => set("patientGender", g)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  form.patientGender === g
                    ? "border-[#0D9488] bg-teal-50 text-[#0D9488]"
                    : "border-white/20 bg-white/5 backdrop-blur-md text-white/70 hover:border-slate-300"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {data.collectionMode === "home" && (
        <div className="space-y-1.5">
          <Label htmlFor="address">Collection Address *</Label>
          <Textarea
            id="address"
            placeholder="Full address with landmark..."
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            rows={3}
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={() => onNext(form)}
          disabled={!isValid}
          className="flex-1 bg-[#0B1F4E] hover:bg-navy-900 text-white h-11 font-semibold flex items-center justify-center gap-2"
        >
          Review Order <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
