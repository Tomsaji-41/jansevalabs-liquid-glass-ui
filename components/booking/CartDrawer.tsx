"use client";

import Link from "next/link";
import { Trash2, ShoppingCart, ArrowRight, Plus, Sparkles, Clock, Droplets } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart, CartItem } from "@/lib/cart/cart-context";
import { formatPrice, cn } from "@/lib/utils";

interface CartDrawerProps {
  onClose: () => void;
}

// Curated suggestion pool — filtered at runtime to exclude what's already in cart
const SUGGESTION_POOL: CartItem[] = [
  { id: 1, type: "test", name: "Complete Blood Count (CBC)", code: "CBC", price: 29900, discountedPrice: 19900 },
  { id: 2, type: "test", name: "HbA1c (Diabetes)", code: "HBA1C", price: 59900, discountedPrice: 44900 },
  { id: 3, type: "test", name: "Thyroid Profile (T3, T4, TSH)", code: "THYROID", price: 79900, discountedPrice: 59900 },
  { id: 4, type: "test", name: "Lipid Profile", code: "LIPID", price: 69900, discountedPrice: 49900 },
  { id: 5, type: "test", name: "Liver Function Test (LFT)", code: "LFT", price: 89900, discountedPrice: 69900 },
  { id: 6, type: "test", name: "Vitamin D", code: "VITD", price: 129900, discountedPrice: 89900 },
  { id: 7, type: "test", name: "Urine Routine (RE/ME)", code: "URINE", price: 19900, discountedPrice: 14900 },
  { id: 8, type: "test", name: "Blood Glucose Fasting", code: "BSF", price: 14900, discountedPrice: 9900 },
  { id: 9, type: "test", name: "Vitamin B12", code: "B12", price: 79900, discountedPrice: 59900 },
  { id: 10, type: "test", name: "Iron Studies", code: "IRON", price: 69900, discountedPrice: 49900 },
];

// Turnaround map for display
const TURNAROUND: Record<string, string> = {
  CBC: "12h", HBA1C: "24h", THYROID: "24h", LIPID: "24h",
  LFT: "24h", VITD: "48h", URINE: "6h", BSF: "6h", B12: "24h", IRON: "24h",
};

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const { items, addItem, removeItem, isInCart, total, count } = useCart();

  // Suggestions: pool minus already-in-cart, cap at 4
  const suggestions = SUGGESTION_POOL.filter(
    (s) => !isInCart(s.id, s.type)
  ).slice(0, 4);

  if (count === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center px-6 gap-4">
        <div className="w-20 h-20 rounded-full bg-[#F0FFF5] flex items-center justify-center">
          <ShoppingCart className="w-9 h-9 text-[#2DB549]" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">Your cart is empty</h3>
          <p className="text-sm text-slate-500 mt-1">Add tests to get started</p>
        </div>

        {/* Popular picks when empty */}
        <div className="w-full mt-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Popular picks</p>
          <div className="space-y-2">
            {SUGGESTION_POOL.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F0FFF5] border border-[#2DB549]/15"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                  <p className="text-xs text-[#2DB549] font-semibold mt-0.5">{formatPrice(s.discountedPrice!)}</p>
                </div>
                <button
                  onClick={() => addItem(s)}
                  className="ml-2 w-8 h-8 rounded-lg bg-[#2DB549] hover:bg-[#25A03F] flex items-center justify-center transition-colors shrink-0"
                  aria-label={`Add ${s.name}`}
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/tests"
          onClick={onClose}
          className={cn(buttonVariants(), "bg-[#2DB549] hover:bg-[#25A03F] text-white w-full")}
        >
          Browse All Tests
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
        <h2 className="font-semibold text-slate-800 text-lg">Your Cart</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          {count} {count === 1 ? "item" : "items"} added
        </p>
      </div>

      {/* Scrollable body — items + suggestions */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 space-y-3">
          {/* Cart items */}
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-surface border border-border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 bg-[#F0FFF5] text-[#1D7D31] border-[#2DB549]/20 capitalize"
                  >
                    {item.type}
                  </Badge>
                  {item.code && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.code}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-800 leading-tight">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {item.discountedPrice && item.discountedPrice < item.price ? (
                    <>
                      <span className="text-sm font-semibold text-[#2DB549]">
                        {formatPrice(item.discountedPrice)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(item.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-[#2DB549]">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id, item.type)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 mt-0.5"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Suggested tests */}
          {suggestions.length > 0 && (
            <div className="mt-5">
              {/* Divider heading */}
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#F47920]" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  You might also need
                </span>
              </div>

              <div className="space-y-2">
                {suggestions.map((s) => {
                  const discount = s.discountedPrice
                    ? Math.round((1 - s.discountedPrice / s.price) * 100)
                    : 0;
                  const ta = s.code ? TURNAROUND[s.code] : null;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-[#2DB549]/30 hover:bg-[#F0FFF5]/50 transition-all duration-150"
                    >
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-lg bg-[#F0FFF5] border border-[#2DB549]/15 flex items-center justify-center shrink-0">
                        <Droplets className="w-4 h-4 text-[#2DB549]" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 leading-tight truncate">
                          {s.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold text-[#2DB549]">
                            {formatPrice(s.discountedPrice ?? s.price)}
                          </span>
                          {discount > 0 && (
                            <Badge className="text-[9px] px-1.5 py-0 bg-orange-50 text-orange-600 border-orange-100 h-4">
                              {discount}% off
                            </Badge>
                          )}
                          {ta && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {ta}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add button */}
                      <button
                        onClick={() => addItem(s)}
                        className="w-8 h-8 rounded-lg bg-[#2DB549] hover:bg-[#25A03F] flex items-center justify-center transition-colors shrink-0 shadow-sm"
                        aria-label={`Add ${s.name} to cart`}
                      >
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* View all tests link */}
              <Link
                href="/tests"
                onClick={onClose}
                className="flex items-center justify-center gap-1 mt-3 text-xs font-medium text-[#2DB549] hover:text-[#1D7D31] transition-colors"
              >
                View all tests <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-border space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-xl font-bold text-[#0B1F4E]">
            {formatPrice(total)}
          </span>
        </div>
        <Link
          href="/book"
          onClick={onClose}
          className={cn(
            buttonVariants(),
            "w-full bg-[#EA580C] hover:bg-[#C2410C] text-white h-12 text-base font-semibold flex items-center justify-center gap-2 shadow-orange-glow"
          )}
        >
          Proceed to Book
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="text-center text-xs text-slate-400">
          Home collection available · No hidden charges
        </p>
      </div>
    </div>
  );
}
