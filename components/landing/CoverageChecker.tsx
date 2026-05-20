"use client";

import { MapPin } from "lucide-react";
import PincodeInput from "@/components/shared/PincodeInput";

export default function CoverageChecker() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F0FFF5] border border-[#2DB549]/20 flex items-center justify-center mx-auto mb-5">
            <MapPin className="w-7 h-7 text-[#2DB549]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4E] mb-3">
            Do we serve{" "}
            <span className="font-display italic font-normal text-[#2DB549]">
              your area?
            </span>
          </h2>
          <p className="text-slate-600 mb-8">
            Enter your pincode to check if home sample collection is available
            in your location.
          </p>

          <div className="bg-surface rounded-2xl border border-border p-6">
            <PincodeInput size="lg" />
          </div>

          <p className="text-sm text-slate-400 mt-4">
            Don&apos;t see your area? We&apos;re expanding rapidly.{" "}
            <a
              href="mailto:support@janseva.in"
              className="text-[#2DB549] hover:underline"
            >
              Request your pincode
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
