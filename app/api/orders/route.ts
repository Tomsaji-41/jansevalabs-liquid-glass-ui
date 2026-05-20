import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, patients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      pincode, collectionMode, date, slot,
      patientName, patientMobile, patientEmail, patientDob, patientGender, address,
      items, total,
    } = body;

    // Upsert patient by mobile
    let patient = await db.query.patients.findFirst({
      where: eq(patients.mobile, patientMobile),
    });

    if (!patient) {
      const [created] = await db
        .insert(patients)
        .values({
          name: patientName,
          mobile: patientMobile,
          email: patientEmail || null,
          dob: patientDob || null,
          gender: patientGender || null,
          addressLine: address || null,
          pincode,
        })
        .returning();
      patient = created;
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        patientId: patient.id,
        items,
        subtotal: total,
        discount: 0,
        total,
        paymentStatus: "pending",
        collectionMode,
        collectionAddress: address || null,
        collectionPincode: pincode,
        status: "booked",
      })
      .returning();

    return NextResponse.json({ orderNumber: order.orderNumber, orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const allOrders = await db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });
    return NextResponse.json(allOrders);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
