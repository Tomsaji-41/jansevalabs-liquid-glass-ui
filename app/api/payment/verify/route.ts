import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, dbOrderId } = body;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !dbOrderId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Razorpay signature: HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(razorpaySignature, "hex"))) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Cross-check: razorpayOrderId must match what we stored when creating the order
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, Number(dbOrderId)),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.razorpayOrderId !== razorpayOrderId) {
      return NextResponse.json({ error: "Order ID mismatch" }, { status: 400 });
    }

    // Idempotent — return success if already paid
    if (order.paymentStatus === "paid") {
      return NextResponse.json({ success: true, orderNumber: order.orderNumber });
    }

    await db
      .update(orders)
      .set({
        paymentStatus: "paid",
        razorpayPaymentId,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (err) {
    console.error("[payment/verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
