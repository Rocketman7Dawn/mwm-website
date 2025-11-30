// app/api/email/inbound-mailgun/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ingestInboundEmail } from "@/lib/emailIngest";
import { getClientEmailContext } from "@/lib/emailAssist";
import { sendMailgunEmail } from "@/lib/mailgunSend";

export const runtime = "nodejs"; // we use Node APIs

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
  const explicitSlug =
    (formData.get("client_slug") as string) ||
    (formData.get("tag-client-slug") as string) ||
    null;
  if (explicitSlug) return explicitSlug.toLowerCase();

  const toHeaderRaw =
    ((formData.get("To") || formData.get("to")) as string) || "";
  const toHeader = toHeaderRaw.trim();

  const match = toHeader.match(/mwm-intake\+([a-z0-9_]+)@/i);
  if (match && match[1]) {
    return match[1].toLowerCase(); // e.g. "mwp"
  }

  const recipient = ((formData.get("recipient") as string) || "").trim();
  if (recipient) {
    const localPart = recipient.split("@")[0];
    const slugCandidate = localPart.split("+").pop() || localPart;
    if (slugCandidate) {
      return slugCandidate.toLowerCase();
    }
  }

  return "mwp";
}

/**
 * Extract bare email from something like:
 * "Name <user@example.com>" or just "user@example.com"
 */
function extractEmail(addr: string): string {
  const trimmed = addr.trim();
  if (!trimmed) return "";

  const angleMatch = trimmed.match(/<([^>]+)>/);
  if (angleMatch && angleMatch[1]) {
    return angleMatch[1].trim();
  }

  const parts = trimmed.split(/\s+/);
  return parts[parts.length - 1].trim();
}

/**
 * Get the original human sender from Mailgun POST.
 * Priority:
 * 1) "From" header inside message-headers JSON
 * 2) "from" / "From" field if present
 * 3) Fallback to envelope sender (SRS) if nothing else
 */
function getOriginalFromEmail(formData: FormData): {
  email: string;
  headerValue: string;
  envelopeSender: string;
} {
  const envelopeSender =
    ((formData.get("sender") as string) || "").trim() || "";

  let fromHeaderValue = "";

  const messageHeadersRaw = formData.get("message-headers") as string | null;
  if (messageHeadersRaw) {
    try {
      const headers = JSON.parse(messageHeadersRaw) as [string, string][];
      const fromPair = headers.find(
        ([name]) => name.toLowerCase() === "from"
      );
      if (fromPair && fromPair[1]) {
        fromHeaderValue = fromPair[1];
      }
    } catch (e) {
      console.error(
        "[inbound-mailgun] Failed to parse message-headers JSON:",
        e
      );
    }
  }

  if (!fromHeaderValue) {
    const fromField =
      ((formData.get("from") || formData.get("From")) as string) || "";
    fromHeaderValue = fromField;
  }

  const originalEmail =
    extractEmail(fromHeaderValue) || extractEmail(envelopeSender) || "";

  return {
    email: originalEmail,
    headerValue: fromHeaderValue,
    envelopeSender,
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const recipient = ((formData.get("recipient") as string) || "").trim();
    const subject = ((formData.get("subject") as string) || "").trim();

    const { email: originalFromEmail, headerValue: fromHeaderValue, envelopeSender } =
      getOriginalFromEmail(formData);

    const bodyPlain =
      ((formData.get("stripped-text") ||
        formData.get("body-plain")) as string) || "";

    const timestamp = (formData.get("timestamp") as string) || null;

    const clientSlug = getClientSlugFromMailgun(formData);

    const receivedAt =
      timestamp != null ? new Date(Number(timestamp) * 1000) : new Date();

    // 1) Ingest inbound email into Supabase (store REAL sender)
    const savedInbound = await ingestInboundEmail({
      clientSlug,
      subject: subject || null,
      bodyText: bodyPlain || null,
      fromEmail: originalFromEmail || null,
      toEmail: recipient || null,
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

    // 4) Send the reply via Mailgun to the ORIGINAL human sender
    const replySubject = subject ? `Re: ${subject}` : "Re: your message";

    await sendMailgunEmail({
      to: originalFromEmail, // <-- Gmail, not SRS
      subject: replySubject,
      text: replyText,
      replyTo: recipient || undefined, // replies can go back through intake
    });

    // 5) Log the outgoing reply into Supabase as well
    await ingestInboundEmail({
      clientSlug,
      subject: replySubject,
      bodyText: replyText,
      fromEmail: recipient || null, // from intake/client to subscriber
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
      fromHeaderValue,
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
