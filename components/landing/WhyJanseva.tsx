import {
  ShieldCheck,
  Clock,
  BadgeIndianRupee,
  Microscope,
  HeartPulse,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "NABL & ICMR Certified",
    description:
      "Our lab meets the highest quality standards. Every test is performed with calibrated equipment under expert supervision.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "Most routine reports are ready within 12–24 hours. Urgent tests available with same-day results.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Transparent Pricing",
    description:
      "No hidden charges. The price you see is the price you pay — often 30–50% lower than clinic rates.",
  },
  {
    icon: Microscope,
    title: "500+ Tests Available",
    description:
      "From basic blood counts to advanced genomic tests — we offer a comprehensive range for every health need.",
  },
  {
    icon: HeartPulse,
    title: "Trained Phlebotomists",
    description:
      "Our home-visit technicians are certified, background-verified, and equipped with sterile collection kits.",
  },
  {
    icon: Headphones,
    title: "7-Day Support",
    description:
      "Questions about your report? Our medical helpline is available every day to help you understand your results.",
  },
];

export default function WhyJanseva() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#F0FFF5] text-[#1D7D31] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4E]">
            Healthcare you can{" "}
            <span className="font-display italic font-normal text-[#2DB549]">
              trust
            </span>
          </h2>
          <p className="text-slate-600 mt-3 max-w-lg mx-auto">
            Thousands of families in your city rely on Janseva Labs for
            accurate diagnostics and compassionate care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border hover:border-[#2DB549]/30 hover:bg-[#F0FFF5]/60 transition-all duration-200 cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F0FFF5] group-hover:bg-white flex items-center justify-center mb-4 transition-colors border border-[#2DB549]/20 group-hover:shadow-sm">
                  <Icon className="w-5 h-5 text-[#2DB549]" />
                </div>
                <h3 className="font-semibold text-[#0B1F4E] mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
