import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pincodes } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/server";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const rows = await db.query.pincodes.findMany({
      orderBy: [asc(pincodes.city), asc(pincodes.pincode)],
    });
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Unauthorized or error" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { pincode: code, areaName, city, state, homeCollectionAvailable } = body;

    if (!code || !areaName || !city || !state) {
      return NextResponse.json({ error: "pincode, areaName, city, state are required" }, { status: 400 });
    }
    if (String(code).length !== 6) {
      return NextResponse.json({ error: "Pincode must be 6 digits" }, { status: 400 });
    }

    const [row] = await db
      .insert(pincodes)
      .values({
        pincode: String(code),
        areaName,
        city,
        state,
        homeCollectionAvailable: homeCollectionAvailable ?? true,
        isActive: true,
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) {
      return NextResponse.json({ error: "Pincode already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
