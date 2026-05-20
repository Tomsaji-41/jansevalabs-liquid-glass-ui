import { requirePatient } from "@/lib/auth/server";
import Link from "next/link";
import { LayoutDashboard, FileText, CalendarDays, User, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/patient/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/patient/results", icon: FileText, label: "My Results" },
  { href: "/patient/appointments", icon: CalendarDays, label: "Appointments" },
  { href: "/patient/profile", icon: User, label: "Profile" },
];

export default async function PatientLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePatient();

  return (
    <div className="min-h-screen relative z-10 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white/5 backdrop-blur-md border-r border-white/20">
        <div className="p-4 border-b border-white/20">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/logo.png"
              alt="Janseva Labs"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-teal-50 hover:text-[#0D9488] transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2">
            <div className="w-8 h-8 rounded-full bg-teal-gradient flex items-center justify-center text-white text-sm font-semibold">
              {session.user?.name?.charAt(0) ?? "P"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/90 truncate">{session.user?.name}</p>
              <p className="text-xs text-white/60 truncate">{session.user?.email}</p>
            </div>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/60 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
