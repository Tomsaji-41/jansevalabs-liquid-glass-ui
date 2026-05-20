import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  contact: string;
  subject?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ContactPayload = await req.json();
    const { name, contact, message } = body;

    if (!name?.trim() || !contact?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "name, contact, and message are required" }, { status: 400 });
    }

    // Log to server output until a contact_messages table is added
    console.log("[contact]", {
      name: body.name,
      contact: body.contact,
      subject: body.subject,
      message: body.message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
