import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Janseva Labs — Diagnostic Tests at Home",
  description:
    "Book blood tests, health packages & more. Home sample collection across your city. NABL-accredited lab with fast turnaround.",
  keywords: "diagnostic lab, blood test, home sample collection, health checkup",
  icons: {
    icon: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${instrument.variable} h-full antialiased`}
    >
      <body 
        className="min-h-full flex flex-col relative overflow-x-hidden"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(29,158,117,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 80%, rgba(24,95,165,0.30) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(93,202,165,0.15) 0%, transparent 50%),
            linear-gradient(135deg, #0d1a2d 0%, #0a1f35 50%, #0a2a1a 100%)
          `,
          color: "rgba(255,255,255,0.90)"
        }}
      >
        {/* Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          {/* Abstract Image Background Overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: "url('/images/healthcare_bg_1.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
          <div 
            className="absolute inset-0 z-0 opacity-20 mix-blend-screen"
            style={{
              backgroundImage: "url('/images/healthcare_bg_2.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              animation: "pulse 10s infinite"
            }}
          />
          <div className="orb" style={{ top: "10%", left: "20%", width: "40vw", height: "40vw", backgroundColor: "#1D9E75" }} />
          <div className="orb" style={{ bottom: "20%", right: "10%", width: "35vw", height: "35vw", backgroundColor: "#185fa5", animationDelay: "-2s" }} />
          <div className="orb" style={{ top: "40%", left: "50%", width: "25vw", height: "25vw", backgroundColor: "#5dcaa5", animationDelay: "-4s" }} />
        </div>

        <TooltipProvider>
          <div className="relative z-10 flex-1 flex flex-col w-full h-full">
            {children}
          </div>
          <Toaster richColors position="top-right" theme="dark" />
        </TooltipProvider>
      </body>
    </html>
  );
}
