"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  discountedPrice: "",
  isPopular: false,
  isActive: true,
};

export default function NewPackagePage() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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

    if (!form.name.trim()) { toast.error("Package name is required."); return; }
    if (isNaN(priceVal) || priceVal <= 0) { toast.error("Enter a valid MRP (in ₹)."); return; }
    if (discVal !== null && (isNaN(discVal) || discVal >= priceVal)) {
      toast.error("Discounted price must be less than MRP."); return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          price: priceVal * 100,         // ₹ → paise
          discountedPrice: discVal !== null ? discVal * 100 : null,
          isPopular: form.isPopular,
          isActive: form.isActive,
          testIds: [],
        }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
        toast.error(error ?? "Failed to create package.");
        return;
      }

      toast.success(`Package "${form.name}" created.`);
      router.push("/admin/packages");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/packages"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-slate-500")}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4E]">Add New Package</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create a bundled health package.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Package Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Package Name <span className="text-red-400">*</span></Label>
              <Input
                placeholder="e.g. Full Body Checkup"
                value={form.name}
                onChange={set("name")}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="What does this package cover? Who should take it?"
                rows={3}
                value={form.description}
                onChange={set("description")}
                className="resize-none"
              />
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
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 1999"
                  value={form.price}
                  onChange={set("price")}
                  required
                />
                <p className="text-xs text-slate-400">Stored as paise internally (×100)</p>
              </div>
              <div className="space-y-1.5">
                <Label>Discounted Price (₹)</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 1299"
                  value={form.discountedPrice}
                  onChange={set("discountedPrice")}
                />
                <p className="text-xs text-slate-400">Leave blank if no discount</p>
              </div>
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
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white min-w-[140px]"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Package
              </>
            )}
          </Button>
          <Link href="/admin/packages" className={cn(buttonVariants({ variant: "outline" }), "text-slate-600")}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
