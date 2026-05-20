import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CtaBanner() {
  return (
    <section className="py-16 bg-navy-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to take charge of{" "}
          <span className="font-display italic font-normal text-[#F97316]">
            your health?
          </span>
        </h2>
        <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
          Book your diagnostic test today. Home collection or walk-in — your
          choice. Results delivered fast.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/book"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-[#EA580C] hover:bg-[#C2410C] text-white h-12 px-8 text-base font-semibold shadow-orange-glow flex items-center gap-2"
            )}
          >
            Book a Test Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="tel:+911800000000"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/30 text-white hover:bg-white/5 backdrop-blur-md/10 h-12 px-8 text-base bg-transparent flex items-center gap-2"
            )}
          >
            <Phone className="w-4 h-4" />
            Call 1800-000-0000
          </a>
        </div>
      </div>
    </section>
  );
}
