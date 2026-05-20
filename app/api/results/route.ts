import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { results, patients } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mobile = searchParams.get("mobile");

    if (mobile) {
      const patient = await db.query.patients.findFirst({
        where: eq(patients.mobile, mobile),
      });
      if (!patient) return NextResponse.json([]);

      const patientResults = await db.query.results.findMany({
        where: eq(results.patientId, patient.id),
      });
      return NextResponse.json(patientResults);
    }

    const allResults = await db.query.results.findMany({
      orderBy: (r, { desc }) => [desc(r.releasedAt)],
    });
    return NextResponse.json(allResults);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
