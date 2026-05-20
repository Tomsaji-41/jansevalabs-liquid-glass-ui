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

    // Mocking response so you can test UI without database setup
    if (String(pincode).startsWith("1")) {
      return NextResponse.json({
        available: true,
        homeCollection: true,
        areaName: "Central",
        city: "Delhi",
      });
    }

    return NextResponse.json({ available: false, homeCollection: false });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
