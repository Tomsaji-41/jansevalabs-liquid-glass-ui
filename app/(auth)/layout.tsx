import Link from "next/link";
import { FlaskConical } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-teal-gradient flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-white" />
        </div>
        <span className="font-display italic text-2xl text-[#0B1F4E]">Janseva</span>
      </Link>
      {children}
    </div>
  );
}
