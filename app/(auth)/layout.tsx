import Link from "next/link";
import { FlaskConical } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-green-glow" style={{ background: "rgba(29,158,117,0.55)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)" }}>
          <FlaskConical className="w-5 h-5 text-white" />
        </div>
        <span className="font-display italic text-2xl" style={{ color: "rgba(255,255,255,0.95)" }}>Janseva</span>
      </Link>
      {children}
    </div>
  );
}
