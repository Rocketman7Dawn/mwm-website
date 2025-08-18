import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const rawBody = await req.text();
  const msgSignature = req.headers.get("x-zm-signature");
  const msgTimestamp = req.headers.get("x-zm-request-timestamp");
  const secret = process.env.ZOOM_WEBHOOK_SECRET;

  // v0 signature: base64(HMAC_SHA256(secret, timestamp + rawBody))
  const hmac = crypto.createHmac("sha256", secret).update(`${msgTimestamp}${rawBody}`).digest("base64");
  const expected = `v0=${hmac}`;
  if (!msgSignature || msgSignature !== expected) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // URL validation challenge
  if (event.event === "endpoint.url_validation") {
    const plainToken = event.payload?.plainToken;
    const encryptedToken = crypto.createHmac("sha256", secret).update(plainToken).digest("hex");
    return NextResponse.json({ plainToken, encryptedToken });
  }

  // TODO: persist event in Supabase, trigger actions, etc.
  return NextResponse.json({ ok: true });
}
