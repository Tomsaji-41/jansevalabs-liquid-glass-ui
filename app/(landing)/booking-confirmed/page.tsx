import { CheckCircle2, CalendarDays, FlaskConical, Mail } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ order?: string; name?: string }>;
}

export default async function BookingConfirmedPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderNumber = params.order ?? "—";
  const patientName = params.name ?? "Patient";

  return (
    <div className="min-h-screen relative z-10 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-brand-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-brand-green-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-navy-900">Payment Successful!</h1>
          <p className="text-white/60">
            Thank you, <span className="font-semibold text-white/80">{patientName}</span>. Your
            booking is confirmed.
          </p>
        </div>

        {/* Order number */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4">
          <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Order Number</p>
          <p className="text-xl font-bold text-navy-900 font-mono">{orderNumber}</p>
          <p className="text-xs text-white/50 mt-1">Save this for your records</p>
        </div>

        {/* What happens next */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-5 text-left space-y-4">
          <p className="text-sm font-semibold text-white/80">What happens next</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-navy-50 flex items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4 text-navy-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Slot confirmed</p>
                <p className="text-xs text-white/50">Our team will call you 30 min before collection.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-green-50 flex items-center justify-center shrink-0">
                <FlaskConical className="w-4 h-4 text-brand-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Sample collection</p>
                <p className="text-xs text-white/50">A certified phlebotomist will collect your sample.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">Report delivery</p>
                <p className="text-xs text-white/50">Reports will be delivered within the promised turnaround time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/results"
            className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
          >
            View Results
          </Link>
          <Link
            href="/"
            className={cn(
              buttonVariants(),
              "flex-1 bg-brand-green-500 hover:bg-brand-green-600 text-white"
            )}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
