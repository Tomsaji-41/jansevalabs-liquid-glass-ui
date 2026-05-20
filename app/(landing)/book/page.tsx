import BookingWizard from "@/components/booking/BookingWizard";
import { CartProvider } from "@/lib/cart/cart-context";

export default function BookPage() {
  return (
    <CartProvider>
      <div className="min-h-screen relative z-10 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white/95">
              Book Your Tests
            </h1>
            <p className="text-white/60 mt-2">
              Complete the steps below to schedule your test
            </p>
          </div>
          <BookingWizard />
        </div>
      </div>
    </CartProvider>
  );
}
