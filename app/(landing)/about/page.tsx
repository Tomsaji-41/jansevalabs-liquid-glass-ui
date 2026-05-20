import { Shield, Zap, Home, Users, Award, CheckCircle2, MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATS = [
  { value: "50,000+", label: "Patients Served" },
  { value: "500+", label: "Diagnostic Tests" },
  { value: "50+", label: "Pincodes Covered" },
  { value: "24 hrs", label: "Average Turnaround" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Accuracy First",
    desc: "NABL-accredited processes and ISO 15189 quality systems ensure every result you receive is precise and reliable.",
  },
  {
    icon: Home,
    title: "Your Convenience",
    desc: "Certified phlebotomists come to your door at a time that works for you — no queues, no travel.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    desc: "Most reports are delivered digitally within 12–24 hours. Urgent tests within 6 hours.",
  },
  {
    icon: Users,
    title: "Patient-Centred Care",
    desc: "Every interaction is designed around clarity — easy booking, simple reports, responsive support.",
  },
];

const CERTIFICATIONS = [
  { name: "NABL Accredited", desc: "National Accreditation Board for Testing and Calibration Laboratories" },
  { name: "ICMR Certified", desc: "Indian Council of Medical Research approved testing protocols" },
  { name: "ISO 15189", desc: "International standard for medical laboratory quality and competence" },
  { name: "CAP Compliant", desc: "College of American Pathologists quality program participant" },
];

const MILESTONES = [
  { year: "2019", event: "Founded in Mumbai with 5 pincodes and a single walk-in centre." },
  { year: "2020", event: "Launched home collection service across Greater Mumbai during the pandemic." },
  { year: "2021", event: "NABL accreditation achieved. Expanded to Delhi and Bengaluru." },
  { year: "2022", event: "Crossed 10,000 monthly bookings. Added Hyderabad and Chennai." },
  { year: "2023", event: "Launched digital health packages and WhatsApp report delivery." },
  { year: "2024", event: "50+ pincodes, 50,000+ patients, and counting." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-hero-gradient border-b border-border py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#F0FFF5] text-[#1D7D31] border border-[#2DB549]/20 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
              About Janseva Labs
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0B1F4E] leading-tight mb-4">
              Diagnostics that come{" "}
              <span className="font-display italic font-normal text-[#2DB549]">to you</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              We believe quality healthcare should be accessible to everyone, in every neighbourhood.
              Janseva Labs was built to eliminate the friction between a doctor&apos;s order and a
              trusted test result — delivered to your door, digitally, on time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-bold text-[#0B1F4E]">{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0B1F4E] mb-4">Our mission</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                India has one of the world&apos;s highest burdens of lifestyle disease — yet millions
                delay diagnostic tests because of cost, distance, or inconvenience. We started
                Janseva Labs to change that.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                By combining a NABL-accredited central laboratory with an at-home phlebotomy network,
                we can offer the same quality as a hospital-grade lab at a fraction of the cost —
                without asking the patient to leave their home.
              </p>
              <div className="space-y-3">
                {["Same-day report for urgent tests", "Certified phlebotomists, background-verified", "End-to-end digital — booking, payment, reports"].map((pt) => (
                  <div key={pt} className="flex items-center gap-2.5 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#2DB549] shrink-0" />
                    <span className="text-sm font-medium">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-surface rounded-2xl p-5 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-[#F0FFF5] border border-[#2DB549]/15 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#2DB549]" />
                  </div>
                  <h3 className="font-semibold text-[#0B1F4E] text-sm mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Award className="w-10 h-10 text-[#2DB549] mx-auto mb-3" />
            <h2 className="text-3xl font-bold text-white mb-2">Accreditations & Certifications</h2>
            <p className="text-slate-400">Every test follows the highest quality standards in the industry.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTIFICATIONS.map(({ name, desc }) => (
              <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="w-8 h-8 rounded-lg bg-[#2DB549]/20 flex items-center justify-center mb-3">
                  <Shield className="w-4 h-4 text-[#2DB549]" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0B1F4E] mb-10 text-center">Our journey</h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {MILESTONES.map(({ year, event }) => (
                <div key={year} className="flex items-start gap-6">
                  <span className="w-14 shrink-0 text-right text-sm font-bold text-[#2DB549] pt-0.5">{year}</span>
                  <div className="relative flex-1">
                    <div className="absolute -left-[1.45rem] top-1.5 w-3 h-3 rounded-full bg-[#2DB549] border-2 border-white" />
                    <p className="text-slate-600 text-sm leading-relaxed pl-1">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#0B1F4E] mb-3">Ready to get started?</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Book your first test today and experience diagnostics the way it should be.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/tests" className={cn(buttonVariants(), "bg-[#2DB549] hover:bg-[#25A03F] text-white shadow-green-glow")}>
              Browse Tests
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "border-[#0B1F4E] text-[#0B1F4E]")}>
              <Phone className="w-4 h-4 mr-2" />
              Contact Us
            </Link>
            <Link href="/results" className={cn(buttonVariants({ variant: "outline" }), "border-border text-slate-600")}>
              <MapPin className="w-4 h-4 mr-2" />
              Check Coverage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
