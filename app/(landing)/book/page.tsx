import BookingWizard from "@/components/booking/BookingWizard";
import { CartProvider } from "@/lib/cart/cart-context";

export default function BookPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F4E]">
              Book Your Tests
            </h1>
            <p className="text-slate-500 mt-2">
              Complete the steps below to schedule your test
            </p>
          </div>
          <BookingWizard />
        </div>
      </div>
    </CartProvider>
  );
}
