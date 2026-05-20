import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pincodes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { pincode } = await req.json();
    if (!pincode || String(pincode).length !== 6) {
      return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
    }

    const result = await db.query.pincodes.findFirst({
      where: eq(pincodes.pincode, String(pincode)),
    });

    if (!result || !result.isActive) {
      return NextResponse.json({ available: false, homeCollection: false });
    }

    return NextResponse.json({
      available: true,
      homeCollection: result.homeCollectionAvailable,
      areaName: result.areaName,
      city: result.city,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
