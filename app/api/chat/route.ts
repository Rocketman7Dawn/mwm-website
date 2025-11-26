// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { handleClientMessage } from "@/lib/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const clientId = body.clientId as string | undefined;
    const message = body.message as string | undefined;
    const channel = (body.channel as string | undefined) ?? "web_chat";

    if (!clientId) {
      return NextResponse.json(
        { error: "Missing 'clientId' in body" },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message' in body" },
        { status: 400 }
      );
    }

    const result = await handleClientMessage({
      clientId,
      message,
      channel,
    });

    return NextResponse.json({
      clientId,
      message,
      ...result,
    });
  } catch (err: any) {
    console.error("/api/chat error:", err);
    return NextResponse.json(
      { error: "Internal error", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}
