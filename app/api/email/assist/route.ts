// app/api/email/assist/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getClientEmailContext } from "@/lib/emailAssist";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientSlug,
      incomingEmailText,
      fromEmail,
    }: {
      clientSlug: string;
      incomingEmailText: string;
      fromEmail?: string;
    } = body;

    if (!clientSlug || !incomingEmailText) {
      return NextResponse.json(
        { ok: false, error: "clientSlug and incomingEmailText are required" },
        { status: 400 }
      );
    }

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
- Match the language and tone of the incoming email (formal/informal).
- Keep the reply reasonably concise and scannable.
- Do NOT include "Draft:" or meta commentary. Just write the email body.
`;

    const userPrompt = `
Recent emails and context for client "${clientSlug}":
${context.contextText}

---
New incoming email:
${incomingEmailText}

If helpful, the sender is: ${fromEmail ?? "unknown"}
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const replyText =
      response.output[0].content[0].text ??
      "I'm sorry, I couldn't generate a reply.";

    return NextResponse.json({
      ok: true,
      reply: replyText,
      debug: {
        usedContextEmails: context.emails.length,
      },
    });
  } catch (err: any) {
    console.error("[/api/email/assist] Error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
