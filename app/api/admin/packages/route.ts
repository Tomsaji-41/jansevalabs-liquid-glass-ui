import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/server";
import { desc, asc } from "drizzle-orm";

export async function GET() {
  try {
    await requireAdmin();
    const rows = await db.query.packages.findMany({
      orderBy: [desc(packages.isPopular), asc(packages.name)],
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
    const { name, description, price, discountedPrice, isPopular, isActive, testIds } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!price || isNaN(parseInt(price))) {
      return NextResponse.json({ error: "price is required" }, { status: 400 });
    }

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const [pkg] = await db
      .insert(packages)
      .values({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        price: parseInt(price),
        discountedPrice: discountedPrice ? parseInt(discountedPrice) : null,
        isPopular: isPopular ?? false,
        isActive: isActive ?? true,
        testIds: testIds ?? [],
      })
      .returning();

    return NextResponse.json(pkg, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) {
      return NextResponse.json({ error: "A package with this name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
