// app/api/email/draft/route.ts
import { NextRequest, NextResponse } from "next/server";
import { draftEmailReply, DraftEmailInput } from "@/lib/emailResponder";
import { logEmailDraft } from "@/lib/emailLogs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const clientId = body.clientId as string | undefined;
    const originalSubject = body.originalSubject as string | undefined;
    const originalBody = body.originalBody as string | undefined;
    const fromName = body.fromName as string | undefined;
    const fromEmail = body.fromEmail as string | undefined;

    if (!clientId) {
      return NextResponse.json(
        { error: "Missing 'clientId' in body" },
        { status: 400 }
      );
    }

    if (!originalSubject && !originalBody) {
      return NextResponse.json(
        { error: "Provide at least 'originalSubject' or 'originalBody'." },
        { status: 400 }
      );
    }

    const input: DraftEmailInput = {
      clientId,
      fromName: fromName ?? null,
      fromEmail: fromEmail ?? null,
      originalSubject: originalSubject ?? "",
      originalBody: originalBody ?? "",
    };

    const result = await draftEmailReply(input);

    // Fire-and-forget logging (don't break the API if logging fails)
    logEmailDraft({
      input,
      result,
      channel: "email",
      metadata: {
        apiSource: "api/email/draft",
      },
    }).catch((err) => {
      console.error("logEmailDraft error:", err);
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("/api/email/draft error:", err);
    return NextResponse.json(
      { error: "Internal error", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}
