import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pincodes } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/server";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();

    const allowed = ["isActive", "homeCollectionAvailable", "areaName", "city", "state"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const [updated] = await db
      .update(pincodes)
      .set(updates)
      .where(eq(pincodes.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized or error" }, { status: 403 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await db.delete(pincodes).where(eq(pincodes.id, parseInt(id)));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized or error" }, { status: 403 });
  }
}
