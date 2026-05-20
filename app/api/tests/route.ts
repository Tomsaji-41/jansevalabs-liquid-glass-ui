import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tests } from "@/lib/db/schema";
import { eq, ilike, and, SQL } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const categoryId = searchParams.get("categoryId");
    const popularOnly = searchParams.get("popular") === "true";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

    const conditions: SQL[] = [eq(tests.isActive, true)];

    if (search) {
      conditions.push(ilike(tests.name, `%${search}%`));
    }
    if (categoryId) {
      conditions.push(eq(tests.categoryId, parseInt(categoryId)));
    }
    if (popularOnly) {
      conditions.push(eq(tests.isPopular, true));
    }

    const results = await db.query.tests.findMany({
      where: and(...conditions),
      orderBy: (t, { desc, asc }) => [desc(t.isPopular), asc(t.name)],
      limit,
    });

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const [test] = await db.insert(tests).values(body).returning();
    return NextResponse.json(test, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized or error" }, { status: 403 });
  }
}
