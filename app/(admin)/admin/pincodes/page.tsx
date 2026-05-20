"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Check, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Pincode {
  id: number;
  pincode: string;
  areaName: string;
  city: string;
  state: string;
  isActive: boolean;
  homeCollectionAvailable: boolean;
}

const EMPTY_FORM = { pincode: "", areaName: "", city: "", state: "", homeCollectionAvailable: true };

export default function AdminPincodesPage() {
  const [rows, setRows] = useState<Pincode[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/pincodes")
      .then((r) => r.json())
      .then((data: Pincode[]) => setRows(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load pincodes."))
      .finally(() => setLoadingRows(false));
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.pincode.length !== 6 || !/^\d{6}$/.test(form.pincode)) {
      toast.error("Pincode must be exactly 6 digits.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pincodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error } = await res.json();
        toast.error(error ?? "Failed to add pincode.");
        return;
      }
      const newRow: Pincode = await res.json();
      setRows((prev) => [...prev, newRow]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      toast.success(`Pincode ${newRow.pincode} added.`);
    } catch {
      toast.error("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const toggleField = async (id: number, field: "isActive" | "homeCollectionAvailable") => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setToggling(id);
    try {
      const res = await fetch(`/api/admin/pincodes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !row[field] }),
      });
      if (!res.ok) { toast.error("Update failed."); return; }
      const updated: Pincode = await res.json();
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch {
      toast.error("Network error.");
    } finally {
      setToggling(null);
    }
  };

  const active = rows.filter((r) => r.isActive).length;
  const homeEnabled = rows.filter((r) => r.homeCollectionAvailable).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F4E]">Pincodes</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage service coverage and home collection availability.</p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Pincode
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Pincodes", value: rows.length },
          { label: "Active", value: active },
          { label: "Inactive", value: rows.length - active },
          { label: "Home Collection", value: homeEnabled },
        ].map(({ label, value }) => (
          <Card key={label} className="border-border shadow-card">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-[#0B1F4E]">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="border-[#1E3A8A]/30 shadow-card bg-navy-50">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#0B1F4E]">Add New Pincode</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
              <div className="space-y-1.5">
                <Label className="text-xs">Pincode <span className="text-red-400">*</span></Label>
                <Input placeholder="400001" maxLength={6} value={form.pincode} onChange={set("pincode")} className="h-9 text-sm" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Area Name <span className="text-red-400">*</span></Label>
                <Input placeholder="Bandra West" value={form.areaName} onChange={set("areaName")} className="h-9 text-sm" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">City <span className="text-red-400">*</span></Label>
                <Input placeholder="Mumbai" value={form.city} onChange={set("city")} className="h-9 text-sm" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">State <span className="text-red-400">*</span></Label>
                <Input placeholder="Maharashtra" value={form.state} onChange={set("state")} className="h-9 text-sm" required />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.homeCollectionAvailable}
                    onChange={(e) => setForm((prev) => ({ ...prev, homeCollectionAvailable: e.target.checked }))}
                    className="rounded"
                  />
                  Home
                </label>
                <Button type="submit" disabled={saving} size="sm" className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white h-9">
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                </Button>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#0B1F4E] flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Service Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRows && (
            <div className="flex items-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-[#1E3A8A]" />
              Loading pincodes…
            </div>
          )}
          {!loadingRows && rows.length === 0 && (
            <p className="text-sm text-slate-400 py-6">No pincodes yet. Add your first one above.</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Pincode", "Area", "City", "State", "Active", "Home Collection", ""].map((h) => (
                    <th key={h} className="pb-3 font-semibold text-slate-500 text-xs uppercase tracking-wide pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-surface transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs font-bold text-[#0B1F4E]">{r.pincode}</td>
                    <td className="py-3 pr-4 text-slate-700 text-xs">{r.areaName}</td>
                    <td className="py-3 pr-4 text-slate-600 text-xs">{r.city}</td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">{r.state}</td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => toggleField(r.id, "isActive")}
                        disabled={toggling === r.id}
                        className="focus:outline-none"
                        title={r.isActive ? "Click to deactivate" : "Click to activate"}
                      >
                        {toggling === r.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        ) : r.isActive ? (
                          <Badge className="bg-[#F0FFF5] text-[#1D7D31] border-[#2DB549]/20 border text-xs cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                            <Check className="w-3 h-3 mr-1" /> Active
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-50 text-slate-400 border-border border text-xs cursor-pointer hover:bg-[#F0FFF5] hover:text-[#1D7D31] hover:border-[#2DB549]/20 transition-colors">
                            <X className="w-3 h-3 mr-1" /> Off
                          </Badge>
                        )}
                      </button>
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => toggleField(r.id, "homeCollectionAvailable")}
                        disabled={toggling === r.id}
                        className="focus:outline-none"
                        title={r.homeCollectionAvailable ? "Click to disable" : "Click to enable"}
                      >
                        {r.homeCollectionAvailable ? (
                          <span className="inline-flex items-center gap-1 text-xs text-[#2DB549] font-medium cursor-pointer hover:text-red-500 transition-colors">
                            <Check className="w-3.5 h-3.5" /> Yes
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium cursor-pointer hover:text-[#2DB549] transition-colors">
                            <X className="w-3.5 h-3.5" /> No
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3">
                      <button className="text-xs text-red-400 hover:text-red-600 font-medium">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
