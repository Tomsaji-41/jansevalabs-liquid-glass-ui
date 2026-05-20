import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Razorpay sends raw body for webhook signature verification.
// Must NOT parse with req.json() before reading the raw bytes.
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[webhook] RAZORPAY_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Verify webhook signature
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event: string;
      payload: { payment: { entity: { id: string; order_id: string } } };
    };

    const paymentEntity = event?.payload?.payment?.entity;
    if (!paymentEntity?.order_id) {
      // Acknowledge unknown or non-payment events without processing
      return NextResponse.json({ ok: true });
    }

    const rzpOrderId = paymentEntity.order_id;
    const rzpPaymentId = paymentEntity.id;

    const order = await db.query.orders.findFirst({
      where: eq(orders.razorpayOrderId, rzpOrderId),
    });

    if (!order) {
      // Could be a test-mode event or a different environment — acknowledge and move on
      return NextResponse.json({ ok: true });
    }

    if (event.event === "payment.captured" && order.paymentStatus !== "paid") {
      await db
        .update(orders)
        .set({ paymentStatus: "paid", razorpayPaymentId: rzpPaymentId, updatedAt: new Date() })
        .where(eq(orders.id, order.id));
    } else if (event.event === "payment.failed" && order.paymentStatus === "pending") {
      await db
        .update(orders)
        .set({ paymentStatus: "failed", updatedAt: new Date() })
        .where(eq(orders.id, order.id));
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[payment/webhook]", err);
    // Always return 200 to Razorpay so it doesn't keep retrying on our parse errors
    return NextResponse.json({ ok: true });
  }
}
