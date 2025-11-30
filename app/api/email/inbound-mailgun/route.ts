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
 * 3) Recipient address Mailgun saw
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
  // Example: "Cid Isbell <mwm-intake+mwp@mindfulnesswithmind.com>"
  const toHeaderRaw =
    ((formData.get("To") || formData.get("to")) as string) || "";
  const toHeader = toHeaderRaw.trim();

  const match = toHeader.match(/mwm-intake\+([a-z0-9_]+)@/i);
  if (match && match[1]) {
    return match[1].toLowerCase(); // e.g. "mwp"
  }

  // 3) Fallback: derive from the actual recipient Mailgun saw
  const recipient = ((formData.get("recipient") as string) || "").trim();
  if (recipient) {
    const localPart = recipient.split("@")[0]; // "intake" or "mwp+something"
    const slugCandidate = localPart.split("+").pop() || localPart;
    if (slugCandidate) {
      return slugCandidate.toLowerCase();
    }
  }

  // 4) Final fallback
  return "mwp";
}

/**
 * Extract bare email from something like:
 * "Cid Isbell <cidisbell@gmail.com>" or just "cidisbell@gmail.com"
 */
function extractEmail(addr: string): string {
  const trimmed = addr.trim();
  if (!trimmed) return "";

  const angleMatch = trimmed.match(/<([^>]+)>/);
  if (angleMatch && angleMatch[1]) {
    return angleMatch[1].trim();
  }

  // Fallback: return last "word" if it's email-ish, else the whole string
  const parts = trimmed.split(/\s+/);
  return parts[parts.length - 1].trim();
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Mailgun envelope recipient (where Mailgun delivered)
    const recipient = ((formData.get("recipient") as string) || "").trim();

    // Mailgun envelope sender (forwarder, often SRS address)
    const envelopeSender =
      ((formData.get("sender") as string) || "").trim();

    const subject = ((formData.get("subject") as string) || "").trim();

    // Original From header (the human sender)
    const fromHeaderRaw =
      ((formData.get("from") || formData.get("From")) as string) || "";
    const originalFromEmail =
      extractEmail(fromHeaderRaw) || envelopeSender || "";

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
      fromEmail: originalFromEmail || null, // store the real human sender
      toEmail: recipient || null, // intake address (Mailgun recipient)
      receivedAt,
      source: "mailgun_inbound",
    });

    // 2) Build full context for this client
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
New incoming email (from ${originalFromEmail || "unknown"} to ${
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

    // 4) Send the reply via Mailgun to the ORIGINAL sender
    const replySubject = subject ? `Re: ${subject}` : "Re: your message";

    await sendMailgunEmail({
      to: originalFromEmail,             // <-- real Gmail, not SRS
      subject: replySubject,
      text: replyText,
      replyTo: recipient || undefined,   // replies can flow back through intake
    });

    // 5) Log the outgoing reply into Supabase as well
    await ingestInboundEmail({
      clientSlug,
      subject: replySubject,
      bodyText: replyText,
      fromEmail: recipient || null,      // from intake/client to subscriber
      toEmail: originalFromEmail || null,
      receivedAt: new Date(),
      source: "assistant_reply",
    });

    return NextResponse.json({
      ok: true,
      inboundId: savedInbound.id,
      autoReplied: true,
      clientSlug,
      originalFromEmail,
      envelopeSender,
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
