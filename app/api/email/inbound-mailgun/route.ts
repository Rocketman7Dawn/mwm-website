// app/api/email/inbound-mailgun/route.ts
import { NextResponse } from "next/server";
import { ingestInboundEmail } from "@/lib/emailIngest";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const recipient = (formData.get("recipient") as string) ?? null;
    const sender = (formData.get("sender") as string) ?? null;
    const subject = (formData.get("subject") as string) ?? null;

    const bodyPlain =
      ((formData.get("stripped-text") ||
        formData.get("body-plain")) as string) ?? null;

    const timestamp = (formData.get("timestamp") as string) ?? null;

    // Where do we get the client? Options:
    // - custom Mailgun variable "client_slug"
    // - tag "tag-client-slug"
    // - encoded in recipient like "mwp+inbound@yourdomain.com"
    const clientSlugFromVar =
      (formData.get("client_slug") as string) ||
      (formData.get("tag-client-slug") as string) ||
      null;

    const clientSlugFromRecipient =
      recipient?.split("@")[0].split("+")[0] ?? null;

    const clientSlug = clientSlugFromVar ?? clientSlugFromRecipient ?? "mwp"; // default

    const receivedAt =
      timestamp != null ? new Date(Number(timestamp) * 1000) : new Date();

    const saved = await ingestInboundEmail({
      clientSlug,
      subject,
      bodyText: bodyPlain,
      fromEmail: sender,
      toEmail: recipient,
      receivedAt,
      source: "mailgun",
    });

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err: any) {
    console.error("[/api/email/inbound-mailgun] Error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
