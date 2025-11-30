// app/api/email/inbound-mailgun/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ingestInboundEmail } from "@/lib/emailIngest";
import { getClientEmailContext } from "@/lib/emailAssist";
import { sendMailgunEmail } from "@/lib/mailgunSend";

export const runtime = "nodejs"; // we use Buffer + Node fetch

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Derive clientSlug from Mailgun form data.
 *
 * Priority:
 * 1) Explicit Mailgun variables (client_slug, tag-client-slug)
 * 2) Original "To" header like: "Name <mwm-intake+mwp@mindfulnesswithmind.com>"
 * 3) Recipient address Mailgun saw (e.g. "intake@sandbox....")
 * 4) Fallback to "mwp"
 */
function getClientSlugFromMailgun(formData: FormData): string {
  // 1) Explicit slug from Mailgun user variables / tags
  const explicitSlug =
    (formData.get("client_slug") as string) ||
    (formData.get("tag-client-slug") as string) ||
    null;
  if (explicitSlug) return explicitSlug.toLowerCase();

  // 2) Try to parse from original "To" header
  // Example header: "Cid Isbell <mwm-intake+mwp@mindfulnesswithmind.com>"
  const toHeaderRaw =
    ((formData.get("To") || formData.get("to")) as string) || "";
  const toHeader = toHeaderRaw.trim();

  // Look for mwm-intake+slug@...
  const match = toHeader.match(/mwm-intake\+([a-z0-9_]+)@/i);
  if (match && match[1]) {
    return match[1].toLowerCase(); // e.g. "mwp"
  }

  // 3) Fallback: derive from the actual recipient Mailgun saw
  // e.g. "intake@sandbox...." or "mwp@mindfulnesswithmind.com"
  const recipient = ((formData.get("recipient") as string) || "").trim();
  if (recipient) {
    const localPart = recipient.split("@")[0]; // "intake" or "mwp+something"
    // If there's a +, use the last segment as slug, else the whole localPart
    const slugCandidate = localPart.split("+").pop() || localPart;
    if (slugCandidate) {
      return slugCandidate.toLowerCase();
    }
  }

  // 4) Final fallback
  return "mwp";
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const recipient = ((formData.get("recipient") as string) || "").trim();
    const sender = ((formData.get("sender") as string) || "").trim();
    const subject = ((formData.get("subject") as string) || "").trim();

    // Mailgun gives us either "stripped-text" or "body-plain"
    const bodyPlain =
      ((formData.get("stripped-text") ||
        formData.get("body-plain")) as string) || "";

    const timestamp = (formData.get("timestamp") as string) || null;

    const clientSlug = getClientSlugFromMailgun(formData);

    const receivedAt =
      timestamp != null ? new Date(Number(timestamp) * 1000) : new Date();

    // 1) Ingest inbound email into Supabase
    const savedInbound = await ingestInboundEmail({
      clientSlug,
      subject: subject || null,
      bodyText: bodyPlain || null,
      fromEmail: sender || null,
      toEmail: recipient || null,
      receivedAt,
      source: "mailgun_inbound",
    });

    // 2) Build full context for this client (recent emails, etc.)
    const context = await getClientEmailContext(clientSlug, 20);

    const systemPrompt = `
You are Cora, a calm, friendly email assistant for a mindfulness or retreat business.
You will be given:
- recent email history with this audience
- a new incoming email

Your job is to draft a helpful reply.

Guidelines:
- Be warm, clear, and grounded. No hype.
- If details like dates, prices, or private links are uncertain, say you'll confirm rather than inventing.
- Match the language and tone of the incoming email (formal or informal).
- Keep the reply reasonably concise and scannable.
- Do NOT include "Draft:" or meta commentary. Just write the email body.
`.trim();

    const incomingEmailText = [
      subject ? `Subject: ${subject}` : "",
      "",
      bodyPlain,
    ].join("\n");

    const userPrompt = `
Recent emails and context for client "${clientSlug}":
${context.contextText}

---
New incoming email (from ${sender || "unknown"} to ${
      recipient || "unknown"
    }):
${incomingEmailText}
`.trim();

    // 3) Ask OpenAI to draft the reply
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const replyText =
      completion.choices[0]?.message?.content ??
      "I'm sorry, I couldn't generate a reply.";

    // 4) Send the reply via Mailgun, fully automated
    const replySubject = subject ? `Re: ${subject}` : "Re: your message";

    await sendMailgunEmail({
      to: sender,
      subject: replySubject,
      text: replyText,
      // we set Reply-To so they can reply back into the same pipeline if needed
      replyTo: recipient || undefined,
    });

    // 5) Log the outgoing reply into Supabase as well
    await ingestInboundEmail({
      clientSlug,
      subject: replySubject,
      bodyText: replyText,
      fromEmail: recipient || null, // from the client to the subscriber
      toEmail: sender || null,
      receivedAt: new Date(),
      source: "assistant_reply",
    });

    return NextResponse.json({
      ok: true,
      inboundId: savedInbound.id,
      autoReplied: true,
      clientSlug,
    });
  } catch (err: any) {
    console.error("[/api/email/inbound-mailgun] Error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
