"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ORDER_STEPS = ["booked", "sample_collected", "processing", "report_ready"] as const;
const STATUS_LABELS: Record<string, string> = {
  booked: "Booked",
  sample_collected: "Sample Collected",
  processing: "Processing",
  report_ready: "Report Ready",
  cancelled: "Cancelled",
};

interface Props {
  orderId: number;
  currentStatus: string;
}

export default function OrderStatusActions({ orderId, currentStatus }: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const router = useRouter();

  const update = async (status: string) => {
    setPending(status);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update status.");
        return;
      }
      toast.success(`Order marked as ${STATUS_LABELS[status]}.`);
      router.refresh();
    } catch {
      toast.error("Network error.");
    } finally {
      setPending(null);
    }
  };

  const stepIndex = ORDER_STEPS.indexOf(currentStatus as typeof ORDER_STEPS[number]);
  const nextSteps = ORDER_STEPS.filter((_, i) => i > stepIndex);

  return (
    <div className="flex flex-wrap gap-3">
      {nextSteps.map((step) => (
        <button
          key={step}
          onClick={() => update(step)}
          disabled={pending !== null}
          className="px-4 py-2 rounded-xl border border-[#1E3A8A]/30 text-sm font-semibold text-[#1E3A8A] bg-white hover:bg-navy-50 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {pending === step && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Mark as {STATUS_LABELS[step]}
        </button>
      ))}
      {currentStatus !== "cancelled" && (
        <button
          onClick={() => update("cancelled")}
          disabled={pending !== null}
          className="px-4 py-2 rounded-xl border border-red-200 text-sm font-semibold text-red-600 bg-white hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {pending === "cancelled" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Cancel Order
        </button>
      )}
    </div>
  );
}
