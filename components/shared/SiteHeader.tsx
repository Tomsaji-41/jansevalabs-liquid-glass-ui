"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart/cart-context";
import CartDrawer from "@/components/booking/CartDrawer";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/tests", label: "All Tests" },
  { href: "/packages", label: "Health Packages" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header 
      className="sticky top-0 z-50 transition-colors"
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
        WebkitBackdropFilter: "blur(40px) saturate(180%) brightness(1.1)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        borderTop: "1px solid rgba(255, 255, 255, 0.45)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/logo.png"
              alt="Janseva Labs"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-base font-medium rounded-lg transition-colors"
                style={{ color: "rgba(255,255,255,0.90)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="tel:+911800000000"
              className="hidden sm:flex items-center gap-1.5 text-base font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: "rgba(255,255,255,0.90)" }}
            >
              <Phone className="w-4 h-4" />
              <span>1800-000-0000</span>
            </a>

            {/* Cart */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                style={{ color: "rgba(255,255,255,0.90)" }}
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center bg-[#0D9488] text-white">
                    {count}
                  </Badge>
                )}
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-md p-0">
                <CartDrawer onClose={() => setCartOpen(false)} />
              </SheetContent>
            </Sheet>

            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden sm:inline-flex"
              )}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "12px",
                color: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              Sign In
            </Link>

            <Link
              href="/book"
              className={cn(
                buttonVariants({ size: "sm" }),
                "hidden sm:inline-flex font-medium"
              )}
              style={{
                background: "rgba(29,158,117,0.55)",
                border: "1px solid rgba(255,255,255,0.30)",
                borderTop: "1px solid rgba(255,255,255,0.50)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(0,0,0,0.2)",
                borderRadius: "14px",
                color: "rgba(255,255,255,0.90)"
              }}
            >
              Book a Test
            </Link>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ color: "rgba(255,255,255,0.90)" }}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-[#0D9488] hover:bg-teal-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 px-4 pt-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "flex-1 border-[#0D9488] text-[#0D9488]")}
              >
                Sign In
              </Link>
              <Link
                href="/book"
                onClick={() => setMobileOpen(false)}
                className={cn(buttonVariants(), "flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white")}
              >
                Book a Test
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
