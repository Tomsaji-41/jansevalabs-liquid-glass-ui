"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Call / WhatsApp",
    value: "1800-000-0000",
    sub: "Toll-free · Mon–Sat 7 am–9 pm",
    href: "tel:+911800000000",
    color: "text-[#2DB549]",
    bg: "bg-[#F0FFF5]",
    border: "border-[#2DB549]/20",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@janseva.in",
    sub: "Reply within 4 business hours",
    href: "mailto:support@janseva.in",
    color: "text-[#1E3A8A]",
    bg: "bg-navy-50",
    border: "border-navy-100",
  },
  {
    icon: MapPin,
    label: "Head Office",
    value: "Mumbai, Maharashtra",
    sub: "Plot 12, MIDC Andheri East, 400093",
    href: null,
    color: "text-[#F47920]",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Sat",
    sub: "7:00 AM to 9:00 PM IST",
    href: null,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-border",
  },
];

const SUBJECTS = [
  "General Enquiry",
  "Booking Support",
  "Report Issue",
  "Partnership / B2B",
  "Franchise Enquiry",
  "Feedback",
  "Other",
];

interface FormState {
  name: string;
  contact: string;
  subject: string;
  message: string;
}

const EMPTY: FormState = { name: "", contact: "", subject: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent! We'll get back to you within 4 hours.");
      setForm(EMPTY);
    } catch {
      toast.error("Failed to send. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FFF5] border border-[#2DB549]/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#2DB549]" />
            </div>
            <span className="text-xs font-semibold text-[#1D7D31] uppercase tracking-widest">Contact Us</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F4E] mb-2">How can we help?</h1>
          <p className="text-slate-500 max-w-xl">
            Reach out about bookings, reports, partnerships, or anything else. We typically respond within 4 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left — contact info */}
          <div className="lg:col-span-2 space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub, href, color, bg, border }) => (
              <div key={label} className={cn("flex gap-4 p-5 rounded-2xl border bg-white shadow-card", border)}>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className={cn("font-semibold text-sm hover:underline", color)}>
                      {value}
                    </a>
                  ) : (
                    <p className={cn("font-semibold text-sm", color)}>{value}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-border shadow-card p-8">
              <h2 className="text-xl font-bold text-[#0B1F4E] mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name <span className="text-red-400">*</span></Label>
                    <Input id="name" placeholder="Priya Sharma" value={form.name} onChange={set("name")} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contact">Email / Mobile <span className="text-red-400">*</span></Label>
                    <Input id="contact" placeholder="you@example.com or 9XXXXXXXXX" value={form.contact} onChange={set("contact")} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={set("subject")}
                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a subject…</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message <span className="text-red-400">*</span></Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us what's on your mind…"
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                    required
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#2DB549] hover:bg-[#25A03F] text-white font-semibold shadow-green-glow"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
