"use client";

import { MapPin } from "lucide-react";
import PincodeInput from "@/components/shared/PincodeInput";

export default function CoverageChecker() {
  return (
    <section className="py-16 md:py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-green-glow"
            style={{
              background: "rgba(29,158,117,0.55)",
              border: "1px solid rgba(255,255,255,0.30)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "rgba(255,255,255,0.95)" }}>
            Do we serve{" "}
            <span className="font-display italic font-normal" style={{ color: "#5dcaa5" }}>
              your area?
            </span>
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
            Enter your pincode to check if home sample collection is available
            in your location.
          </p>

          <div 
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255, 255, 255, 0.10)",
              backdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
              WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderTop: "1px solid rgba(255, 255, 255, 0.45)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <PincodeInput size="lg" />
          </div>

          <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            Don&apos;t see your area? We&apos;re expanding rapidly.{" "}
            <a
              href="mailto:support@janseva.in"
              className="hover:underline"
              style={{ color: "#5dcaa5" }}
            >
              Request your pincode
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
