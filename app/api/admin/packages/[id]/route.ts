import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
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

    const allowed = ["name", "description", "price", "discountedPrice", "isPopular", "isActive", "testIds"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const [updated] = await db
      .update(packages)
      .set(updates)
      .where(eq(packages.id, parseInt(id)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized or error" }, { status: 403 });
  }
}
