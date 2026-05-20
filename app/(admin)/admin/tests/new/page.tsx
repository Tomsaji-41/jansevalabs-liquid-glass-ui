"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAMPLE_TYPES = ["blood", "urine", "stool", "saliva", "swab", "serum", "plasma", "other"];

const EMPTY = {
  name: "",
  code: "",
  description: "",
  shortDescription: "",
  price: "",
  discountedPrice: "",
  sampleType: "blood",
  turnaroundHours: "24",
  preparationInstructions: "",
  isPopular: false,
  isActive: true,
};

export default function NewTestPage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({
        ...prev,
        [k]: e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value,
      }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceVal = parseInt(form.price);
    const discVal = form.discountedPrice ? parseInt(form.discountedPrice) : null;

    if (!form.name.trim()) { toast.error("Test name is required."); return; }
    if (isNaN(priceVal) || priceVal <= 0) { toast.error("Enter a valid price (in ₹)."); return; }
    if (discVal !== null && (isNaN(discVal) || discVal >= priceVal)) {
      toast.error("Discounted price must be less than MRP."); return;
    }

    const slug = form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    setSaving(true);
    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug,
          code: form.code.trim() || null,
          description: form.description.trim() || null,
          shortDescription: form.shortDescription.trim() || null,
          price: priceVal * 100,           // ₹ → paise
          discountedPrice: discVal !== null ? discVal * 100 : null,
          sampleType: form.sampleType,
          turnaroundHours: parseInt(form.turnaroundHours) || 24,
          preparationInstructions: form.preparationInstructions.trim() || null,
          isPopular: form.isPopular,
          isActive: form.isActive,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
        toast.error(error ?? "Failed to create test.");
        return;
      }

      toast.success(`Test "${form.name}" created.`);
      router.push("/admin/tests");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/tests"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-slate-500")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4E]">Add New Test</h1>
          <p className="text-slate-500 text-sm mt-0.5">Fill in the test details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Test Name <span className="text-red-400">*</span></Label>
                <Input placeholder="e.g. Complete Blood Count (CBC)" value={form.name} onChange={set("name")} required />
              </div>
              <div className="space-y-1.5">
                <Label>Test Code</Label>
                <Input placeholder="e.g. CBC" value={form.code} onChange={set("code")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Short Description</Label>
              <Input placeholder="One-line summary shown on cards (max 300 chars)" value={form.shortDescription} onChange={set("shortDescription")} maxLength={300} />
            </div>

            <div className="space-y-1.5">
              <Label>Full Description</Label>
              <Textarea placeholder="Detailed description of what this test measures, who should take it, etc." rows={3} value={form.description} onChange={set("description")} className="resize-none" />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Pricing (enter in ₹)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>MRP (₹) <span className="text-red-400">*</span></Label>
                <Input type="number" min="1" placeholder="e.g. 599" value={form.price} onChange={set("price")} required />
                <p className="text-xs text-slate-400">Stored as paise internally (×100)</p>
              </div>
              <div className="space-y-1.5">
                <Label>Discounted Price (₹)</Label>
                <Input type="number" min="1" placeholder="e.g. 399" value={form.discountedPrice} onChange={set("discountedPrice")} />
                <p className="text-xs text-slate-400">Leave blank if no discount</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collection Details */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Collection Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Sample Type</Label>
                <select
                  value={form.sampleType}
                  onChange={set("sampleType")}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring capitalize"
                >
                  {SAMPLE_TYPES.map((s) => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Turnaround Time (hours)</Label>
                <Input type="number" min="1" value={form.turnaroundHours} onChange={set("turnaroundHours")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Preparation Instructions</Label>
              <Input placeholder="e.g. 10–12 hours fasting required" value={form.preparationInstructions} onChange={set("preparationInstructions")} />
            </div>
          </CardContent>
        </Card>

        {/* Flags */}
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Visibility</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded"
              />
              Active (visible to patients)
            </label>
            <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) => setForm((p) => ({ ...p, isPopular: e.target.checked }))}
                className="rounded"
              />
              Mark as Popular
            </label>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white min-w-[130px]"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Test
              </>
            )}
          </Button>
          <Link href="/admin/tests" className={cn(buttonVariants({ variant: "outline" }), "text-slate-600")}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
