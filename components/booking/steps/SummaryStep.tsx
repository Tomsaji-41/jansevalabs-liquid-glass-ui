"use client";

import { useState } from "react";
import { ArrowLeft, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice, formatDate } from "@/lib/utils";
import type { BookingData } from "../BookingWizard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  data: BookingData;
  onBack: () => void;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

export default function SummaryStep({ data, onBack }: Props) {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePay = async () => {
    setLoading(true);

    try {
      // Step 1: Create order on server (server computes price from DB — no client price trusted)
      const createRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking: data,
          items: items.map(({ id, type, name }) => ({ id, type, name })),
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        toast.error(err.error ?? "Failed to initiate payment. Please try again.");
        setLoading(false);
        return;
      }

      const { razorpayOrderId, amount, currency, keyId, orderNumber, dbOrderId } =
        await createRes.json();

      // Step 2: Load Razorpay checkout script
      await loadRazorpayScript();

      // Step 3: Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Janseva Labs",
        description: `Booking ${orderNumber}`,
        prefill: {
          name: data.patientName,
          contact: data.patientMobile,
          email: data.patientEmail,
        },
        theme: { color: "#2DB549" },

        handler: async (response) => {
          // Step 4: Verify payment signature server-side
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                dbOrderId,
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              router.push(
                `/booking-confirmed?order=${orderNumber}&name=${encodeURIComponent(data.patientName)}`
              );
            } else {
              toast.error(
                "Payment received but verification failed. Please contact support with order " +
                  orderNumber
              );
              setLoading(false);
            }
          } catch {
            toast.error("Network error during verification. Contact support with order " + orderNumber);
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled. Your order is saved — you can retry from this page.");
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error("[SummaryStep]", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0B1F4E] mb-1">Order Summary</h2>
        <p className="text-sm text-slate-500">Please review your details before paying.</p>
      </div>

      {/* Booking details */}
      <div className="bg-surface rounded-xl border border-border p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Pincode</span>
          <span className="font-medium text-slate-800">
            {data.pincode} — {data.areaName}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-slate-500">Collection</span>
          <span className="font-medium text-slate-800 capitalize">
            {data.collectionMode === "home" ? "Home Collection" : "Walk-in"}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-slate-500">Date & Time</span>
          <span className="font-medium text-slate-800">
            {formatDate(data.date)} · {data.slot}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span className="text-slate-500">Patient</span>
          <span className="font-medium text-slate-800">{data.patientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Mobile</span>
          <span className="font-medium text-slate-800">{data.patientMobile}</span>
        </div>
        {data.address && (
          <div className="flex justify-between">
            <span className="text-slate-500">Address</span>
            <span className="font-medium text-slate-800 text-right max-w-xs">{data.address}</span>
          </div>
        )}
      </div>

      {/* Cart items */}
      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">Tests ({items.length})</p>
          {items.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
              <span className="text-slate-600">{item.name}</span>
              <span className="font-medium text-slate-800">
                {formatPrice(item.discountedPrice ?? item.price)}
              </span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-base">
            <span className="text-[#0B1F4E]">Total</span>
            <span className="text-[#0B1F4E]">{formatPrice(total)}</span>
          </div>
        </div>
      )}

      {/* Trust badge */}
      <div className="bg-brand-green-50 border border-brand-green-100 rounded-xl p-4 text-sm text-brand-green-700 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-brand-green-500" />
        <span>Secured by Razorpay · 256-bit SSL encryption · Payment verified server-side</span>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handlePay}
          disabled={loading || items.length === 0}
          className="flex-1 bg-[#2DB549] hover:bg-[#25A03F] text-white h-11 font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing…
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" /> Pay {formatPrice(total)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
