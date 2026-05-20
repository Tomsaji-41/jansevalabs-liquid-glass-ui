"use client";

import Link from "next/link";
import { Clock, ShoppingCart, Check, Droplets, Beaker } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TestCardProps {
  id: number;
  name: string;
  slug: string;
  code?: string | null;
  price: number;
  discountedPrice?: number | null;
  turnaroundHours?: number | null;
  sampleType?: string | null;
  isPopular?: boolean | null;
  shortDescription?: string | null;
}

export default function TestCard({
  id,
  name,
  slug,
  code,
  price,
  discountedPrice,
  turnaroundHours,
  sampleType,
  isPopular,
  shortDescription,
}: TestCardProps) {
  const { addItem, isInCart, removeItem } = useCart();
  const inCart = isInCart(id, "test");
  const effectivePrice = discountedPrice ?? price;
  const discount = discountedPrice ? Math.round((1 - discountedPrice / price) * 100) : 0;

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCart) {
      removeItem(id, "test");
    } else {
      addItem({
        id,
        type: "test",
        name,
        price,
        discountedPrice: discountedPrice ?? undefined,
        code: code ?? undefined,
      });
    }
  };

  const SampleIcon = sampleType === "urine" ? Beaker : Droplets;

  return (
    <div className="group bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Top */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100">
          <SampleIcon className="w-5 h-5 text-[#0D9488]" />
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {isPopular && (
            <Badge className="bg-[#0D9488] hover:bg-[#0D9488] text-white text-[10px] px-2 py-0.5">
              Popular
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-100 text-[10px] px-2 py-0.5">
              {discount}% off
            </Badge>
          )}
        </div>
      </div>

      {/* Name */}
      <Link href={`/tests/${slug}`} className="flex-1">
        <h3 className="font-semibold text-white/90 text-sm leading-tight mb-1 group-hover:text-[#0D9488] transition-colors">
          {name}
        </h3>
        {code && (
          <p className="text-[11px] font-mono text-white/50 mb-2">{code}</p>
        )}
        {shortDescription && (
          <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-3">
            {shortDescription}
          </p>
        )}
      </Link>

      {/* Meta */}
      {(turnaroundHours || sampleType) && (
        <div className="flex items-center gap-3 mb-4">
          {turnaroundHours && (
            <span className="flex items-center gap-1 text-[11px] text-white/60">
              <Clock className="w-3 h-3" />
              {turnaroundHours}h report
            </span>
          )}
          {sampleType && (
            <span className="text-[11px] text-white/50 capitalize">{sampleType}</span>
          )}
        </div>
      )}

      {/* Price + CTA */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <p className="text-lg font-bold text-white/95">
            {formatPrice(effectivePrice)}
          </p>
          {discount > 0 && (
            <p className="text-xs text-white/50 line-through">
              {formatPrice(price)}
            </p>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleCart}
          className={cn(
            "transition-all",
            inCart
              ? "bg-teal-50 text-[#0D9488] border border-[#0D9488] hover:bg-red-50 hover:text-red-600 hover:border-red-300"
              : "bg-[#0D9488] hover:bg-[#0F766E] text-white"
          )}
        >
          {inCart ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
