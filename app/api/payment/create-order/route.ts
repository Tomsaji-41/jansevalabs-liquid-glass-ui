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

    // --- Re-fetch all prices from DB (never trust client) ---
    const testIds = items.filter((i) => i.type === "test").map((i) => i.id);
    const packageIds = items.filter((i) => i.type === "package").map((i) => i.id);

    const orderItems: Array<{ id: number; type: string; name: string; price: number }> = [];
    let computedTotal = 0;

    if (testIds.length > 0) {
      const dbTests = await db
        .select({
          id: tests.id,
          name: tests.name,
          price: tests.price,
          discountedPrice: tests.discountedPrice,
          isActive: tests.isActive,
        })
        .from(tests)
        .where(inArray(tests.id, testIds));

      if (dbTests.length !== testIds.length) {
        return NextResponse.json({ error: "One or more tests not found" }, { status: 400 });
      }
      for (const t of dbTests) {
        if (!t.isActive) {
          return NextResponse.json({ error: `"${t.name}" is no longer available` }, { status: 400 });
        }
        const price = t.discountedPrice ?? t.price;
        computedTotal += price;
        orderItems.push({ id: t.id, type: "test", name: t.name, price });
      }
    }

    if (packageIds.length > 0) {
      const dbPackages = await db
        .select({
          id: packages.id,
          name: packages.name,
          price: packages.price,
          discountedPrice: packages.discountedPrice,
          isActive: packages.isActive,
        })
        .from(packages)
        .where(inArray(packages.id, packageIds));

      if (dbPackages.length !== packageIds.length) {
        return NextResponse.json({ error: "One or more packages not found" }, { status: 400 });
      }
      for (const p of dbPackages) {
        if (!p.isActive) {
          return NextResponse.json({ error: `"${p.name}" is no longer available` }, { status: 400 });
        }
        const price = p.discountedPrice ?? p.price;
        computedTotal += price;
        orderItems.push({ id: p.id, type: "package", name: p.name, price });
      }
    }

    if (computedTotal === 0) {
      return NextResponse.json({ error: "Cart total is zero" }, { status: 400 });
    }

    // --- Upsert patient by mobile ---
    let patient = await db.query.patients.findFirst({
      where: eq(patients.mobile, booking.patientMobile),
    });

    if (!patient) {
      const [created] = await db
        .insert(patients)
        .values({
          name: booking.patientName.trim(),
          mobile: booking.patientMobile,
          email: booking.patientEmail?.trim() || null,
          dob: booking.patientDob || null,
          gender: booking.patientGender || null,
          addressLine: booking.address?.trim() || null,
          pincode: booking.pincode,
        })
        .returning();
      patient = created;
    }

    // --- Create Razorpay order first (so we can store its ID in the DB row) ---
    const orderNumber = generateOrderNumber();
    const rzpOrder = await getRazorpay().orders.create({
      amount: computedTotal, // paise
      currency: "INR",
      receipt: orderNumber,
      notes: {
        patientMobile: booking.patientMobile,
        patientName: booking.patientName.trim(),
      },
    });

    // --- Insert DB order with razorpayOrderId already set ---
    const [dbOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        patientId: patient.id,
        items: orderItems,
        subtotal: computedTotal,
        discount: 0,
        total: computedTotal,
        paymentStatus: "pending",
        razorpayOrderId: rzpOrder.id,
        collectionMode: booking.collectionMode,
        collectionAddress: booking.address?.trim() || null,
        collectionPincode: booking.pincode,
        status: "booked",
      })
      .returning();

    return NextResponse.json(
      {
        razorpayOrderId: rzpOrder.id,
        amount: computedTotal,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID,
        orderNumber: dbOrder.orderNumber,
        dbOrderId: dbOrder.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[payment/create-order]", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
