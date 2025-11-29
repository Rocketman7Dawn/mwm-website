// app/api/email/ingest/route.ts
import { NextResponse } from "next/server";
import { ingestInboundEmail } from "@/lib/emailIngest";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const saved = await ingestInboundEmail({
      clientSlug: body.clientSlug,
      subject: body.subject ?? null,
      bodyText: body.bodyText ?? null,
      fromEmail: body.fromEmail ?? null,
      toEmail: body.toEmail ?? null,
      receivedAt: body.receivedAt ?? null,
      source: body.source ?? "manual",
    });

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err: any) {
    console.error("[/api/email/ingest] Error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
