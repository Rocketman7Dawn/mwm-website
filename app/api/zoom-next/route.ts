// app/api/zoom-next/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getNextZoomEventForClient } from "@/lib/zoomEvents";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientId = body.clientId as string | undefined;

    if (!clientId) {
      return NextResponse.json(
        { error: "Missing 'clientId' in body" },
        { status: 400 }
      );
    }

    const event = await getNextZoomEventForClient(clientId);

    return NextResponse.json({ clientId, event });
  } catch (err: any) {
    console.error("zoom-next error:", err);
    return NextResponse.json(
      { error: "Internal error", details: String(err?.message || err) },
      { status: 500 }
    );
  }
}
