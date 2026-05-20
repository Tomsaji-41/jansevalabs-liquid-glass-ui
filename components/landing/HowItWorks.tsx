import { Search, CalendarCheck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search & Add Tests",
    description:
      "Browse 500+ tests and health packages. Check if we cover your pincode and add tests to your cart in seconds.",
    color: "green",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book a Slot",
    description:
      "Choose a convenient time for home collection or book a walk-in appointment at your nearest Janseva centre.",
    color: "orange",
  },
  {
    icon: FileText,
    step: "03",
    title: "Get Your Report",
    description:
      "Our certified lab processes your sample with precision. Download your detailed report in 24–48 hours.",
    color: "navy",
  },
];

const colorMap = {
  green: {
    badge: "bg-[#2DB549]/20 text-[#6EE37A]",
    icon: "bg-green-gradient text-white",
    stepColor: "text-[#6EE37A]",
  },
  orange: {
    badge: "bg-[#F47920]/20 text-[#F97316]",
    icon: "bg-orange-gradient text-white",
    stepColor: "text-[#F97316]",
  },
  navy: {
    badge: "bg-white/5 backdrop-blur-md/10 text-white/70",
    icon: "bg-white/5 backdrop-blur-md/10 text-white",
    stepColor: "text-white/50",
  },
};

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-[#0B1F4E] relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#2DB549]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#2DB549]/15 text-[#6EE37A] border border-[#2DB549]/20 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            How it{" "}
            <span className={cn("font-display italic font-normal text-[#F47920]")}>
              works
            </span>
          </h2>
          <p className="text-white/50 mt-3 max-w-md mx-auto text-base">
            Getting your diagnostic tests done has never been this easy.
            Three simple steps to accurate results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-11 left-1/3 right-1/3 h-px bg-gradient-to-r from-[#2DB549]/40 via-[#F47920]/40 to-white/20" />

          {steps.map((step, idx) => {
            const colors = colorMap[step.color as keyof typeof colorMap];
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                <div className="bg-white/5 backdrop-blur-md/5 border border-white/10 rounded-2xl p-7 h-full flex flex-col backdrop-blur-sm hover:bg-white/5 backdrop-blur-md/8 hover:border-white/20 transition-all duration-200">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors.icon}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`font-display italic text-4xl font-normal leading-none mt-1 ${colors.stepColor}`}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile step connector */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-2">
                    <div className="w-px h-6 bg-white/5 backdrop-blur-md/20" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
