import { CalendarDays, Clock, MapPin, Home, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const MOCK_APPOINTMENTS = [
  {
    id: 1, orderNumber: "JL34DEF", tests: ["Thyroid Profile (T3, T4, TSH)"],
    date: "2024-01-20", slot: "8:00 AM – 10:00 AM",
    collectionMode: "home", address: "123, MG Road, Ernakulam",
    status: "upcoming",
  },
];

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white/95">Appointments</h1>
        <p className="text-white/60 mt-1">Your upcoming and past sample collection appointments.</p>
      </div>

      {MOCK_APPOINTMENTS.length === 0 ? (
        <div className="text-center py-16 text-white/50">No appointments found.</div>
      ) : (
        <div className="space-y-4">
          {MOCK_APPOINTMENTS.map((apt) => (
            <div key={apt.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-semibold text-white/90">#{apt.orderNumber}</p>
                  <p className="text-sm text-white/60 mt-0.5">{apt.tests.join(", ")}</p>
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-blue-100 border">Upcoming</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <CalendarDays className="w-4 h-4 text-[#0D9488] shrink-0" />
                  {formatDate(apt.date)}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock className="w-4 h-4 text-[#0D9488] shrink-0" />
                  {apt.slot}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  {apt.collectionMode === "home" ? (
                    <Home className="w-4 h-4 text-[#0D9488] shrink-0" />
                  ) : (
                    <Building2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                  )}
                  {apt.collectionMode === "home" ? "Home Collection" : "Walk-in"}
                </div>
              </div>

              {apt.address && (
                <div className="flex items-start gap-2 text-sm text-white/60 mt-3 relative z-10 px-3 py-2 rounded-lg border border-white/20">
                  <MapPin className="w-4 h-4 text-[#0D9488] shrink-0 mt-0.5" />
                  {apt.address}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
