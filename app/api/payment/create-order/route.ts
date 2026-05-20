import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, patients, tests, packages } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { getRazorpay } from "@/lib/razorpay";
import { generateOrderNumber } from "@/lib/utils";

interface CartItemRef {
  id: number;
  type: "test" | "package";
  name: string;
}

interface BookingPayload {
  pincode: string;
  areaName: string;
  collectionMode: "home" | "walkin";
  date: string;
  slot: string;
  patientName: string;
  patientMobile: string;
  patientEmail?: string;
  patientDob?: string;
  patientGender?: string;
  address?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking, items }: { booking: BookingPayload; items: CartItemRef[] } = body;

    // --- Input validation ---
    if (!booking || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^\d{10}$/.test(booking.patientMobile ?? "")) {
      return NextResponse.json({ error: "Invalid mobile number" }, { status: 400 });
    }
    if (!booking.patientName?.trim()) {
      return NextResponse.json({ error: "Patient name is required" }, { status: 400 });
    }
    if (!["home", "walkin"].includes(booking.collectionMode)) {
      return NextResponse.json({ error: "Invalid collection mode" }, { status: 400 });
    }
    if (booking.collectionMode === "home" && !booking.address?.trim()) {
      return NextResponse.json({ error: "Address is required for home collection" }, { status: 400 });
    }

    // --- MOCKED FOR LOCAL TESTING WITHOUT DATABASE ---
    const computedTotal = 50000; // Mock 500 INR
    const orderItems = [{ id: 1, type: "test", name: "Mock Test", price: 50000 }];
    const orderNumber = generateOrderNumber();

    // --- Create Razorpay order (Requires real test keys in .env.local) ---
    const rzpOrder = await getRazorpay().orders.create({
      amount: computedTotal, // paise
      currency: "INR",
      receipt: orderNumber,
      notes: {
        patientMobile: booking.patientMobile,
        patientName: booking.patientName.trim(),
      },
    });

    const mockDbOrderId = 999;

    return NextResponse.json(
      {
        razorpayOrderId: rzpOrder.id,
        amount: computedTotal,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
        orderNumber: orderNumber,
        dbOrderId: mockDbOrderId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[payment/create-order]", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
