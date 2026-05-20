"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SAMPLE_TYPES = ["blood", "urine", "stool", "saliva", "swab", "serum", "plasma", "other"];

interface FormState {
  name: string;
  code: string;
  description: string;
  shortDescription: string;
  price: string;
  discountedPrice: string;
  sampleType: string;
  turnaroundHours: string;
  preparationInstructions: string;
  isPopular: boolean;
  isActive: boolean;
}

// Fallback mock so the edit form works even before DB is connected
const MOCK: Record<string, Partial<FormState>> = {
  "1": { name: "Complete Blood Count (CBC)", code: "CBC", price: "299", discountedPrice: "199", sampleType: "blood", turnaroundHours: "12", isPopular: true, isActive: true },
  "2": { name: "HbA1c (Diabetes)", code: "HBA1C", price: "599", discountedPrice: "449", sampleType: "blood", turnaroundHours: "24", isPopular: true, isActive: true },
  "3": { name: "Thyroid Profile (T3, T4, TSH)", code: "THYROID", price: "799", discountedPrice: "599", sampleType: "blood", turnaroundHours: "24", isPopular: true, isActive: true },
  "4": { name: "Lipid Profile", code: "LIPID", price: "699", discountedPrice: "499", sampleType: "blood", turnaroundHours: "24", isPopular: false, isActive: true },
};

const EMPTY: FormState = {
  name: "", code: "", description: "", shortDescription: "",
  price: "", discountedPrice: "", sampleType: "blood",
  turnaroundHours: "24", preparationInstructions: "",
  isPopular: false, isActive: true,
};

export default function EditTestPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Try real API first — falls back to mock for non-connected DB
        const res = await fetch(`/api/tests?id=${id}&limit=1`);
        if (res.ok) {
          const data = await res.json();
          const t = Array.isArray(data) ? data[0] : null;
          if (t) {
            setForm({
              name: t.name ?? "",
              code: t.code ?? "",
              description: t.description ?? "",
              shortDescription: t.shortDescription ?? "",
              price: t.price ? String(Math.round(t.price / 100)) : "",
              discountedPrice: t.discountedPrice ? String(Math.round(t.discountedPrice / 100)) : "",
              sampleType: t.sampleType ?? "blood",
              turnaroundHours: String(t.turnaroundHours ?? 24),
              preparationInstructions: t.preparationInstructions ?? "",
              isPopular: t.isPopular ?? false,
              isActive: t.isActive ?? true,
            });
            setLoading(false);
            return;
          }
        }
      } catch { /* ignore, fall through to mock */ }

      // Use mock data while DB is not connected
      const mock = MOCK[id];
      if (mock) {
        setForm({ ...EMPTY, ...mock });
      } else {
        toast.error("Test not found.");
        router.push("/admin/tests");
      }
      setLoading(false);
    }
    load();
  }, [id, router]);

  const set = (k: keyof FormState) =>
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

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/tests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          code: form.code.trim() || null,
          description: form.description.trim() || null,
          shortDescription: form.shortDescription.trim() || null,
          price: priceVal * 100,
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
        toast.error(error ?? "Failed to update test.");
        return;
      }

      toast.success("Test updated successfully.");
      router.push("/admin/tests");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-[#0B1F4E]">Edit Test</h1>
          <p className="text-slate-500 text-sm mt-0.5">Update the test details below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Test Name <span className="text-red-400">*</span></Label>
                <Input value={form.name} onChange={set("name")} required />
              </div>
              <div className="space-y-1.5">
                <Label>Test Code</Label>
                <Input value={form.code} onChange={set("code")} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Short Description</Label>
              <Input value={form.shortDescription} onChange={set("shortDescription")} maxLength={300} />
            </div>
            <div className="space-y-1.5">
              <Label>Full Description</Label>
              <Textarea rows={3} value={form.description} onChange={set("description")} className="resize-none" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Pricing (enter in ₹)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>MRP (₹) <span className="text-red-400">*</span></Label>
                <Input type="number" min="1" value={form.price} onChange={set("price")} required />
                <p className="text-xs text-slate-400">Stored as paise internally (×100)</p>
              </div>
              <div className="space-y-1.5">
                <Label>Discounted Price (₹)</Label>
                <Input type="number" min="1" value={form.discountedPrice} onChange={set("discountedPrice")} />
              </div>
            </div>
          </CardContent>
        </Card>

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
              <Input value={form.preparationInstructions} onChange={set("preparationInstructions")} />
            </div>
          </CardContent>
        </Card>

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

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white min-w-[130px]">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
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
