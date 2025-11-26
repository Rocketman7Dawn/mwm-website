// lib/emailResponder.ts

import OpenAI from "openai";
import { handleClientMessage } from "@/lib/orchestrator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Per-client email signature + closing config
const EMAIL_SIGNATURES: Record<
  string,
  { fromName: string; closing: string }
> = {
  mwp: {
    fromName: "Mayan Wisdom Project Support",
    closing: "Warm regards",
  },
  // Add more clients here as you onboard them, e.g.:
  // soulcoach: {
  //   fromName: "SoulCoach Support",
  //   closing: "With care",
  // },
};

function getEmailSignature(clientId: string) {
  return (
    EMAIL_SIGNATURES[clientId] || {
      fromName: "Support Team",
      closing: "Warm regards",
    }
  );
}

export type DraftEmailInput = {
  clientId: string;
  fromName?: string | null;
  fromEmail?: string | null;
  originalSubject: string;
  originalBody: string;
};

export type DraftEmailResult = {
  subject: string;
  body: string;
  intent: string;
  source: string;
};

export async function draftEmailReply(
  input: DraftEmailInput
): Promise<DraftEmailResult> {
  const {
    clientId,
    fromName,
    fromEmail,
    originalSubject,
    originalBody,
  } = input;

  const { fromName: defaultFromName, closing } = getEmailSignature(clientId);

  // 1) Ask the main brain (orchestrator) for the core answer
  const chatResult = await handleClientMessage({
    clientId,
    message: originalBody || originalSubject,
    channel: "email",
  });

  const coreAnswer = chatResult.answer ?? "";
  const intent = (chatResult as any).intent ?? "unknown";
  const source = (chatResult as any).source ?? "unknown";
  const zoomEvent = (chatResult as any).zoomEvent ?? null;

  // 2) Ask the model to wrap that answer into a proper email
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are Cora, a warm, clear support assistant writing email replies for a mindful, spiritual education business. " +
          "You are given the original incoming email and an internal 'answer' text that has already been computed. " +
          "Your job is ONLY to wrap that answer into a professional, kind email reply.\n\n" +
          "Return STRICT JSON with keys: 'subject' and 'body'.\n" +
          "- 'subject' should be short and relevant (often reusing or refining the original subject).\n" +
          "- 'body' should be a polite email including a short greeting and a friendly sign-off.\n" +
          "- Do NOT invent new policies, prices, or links beyond what the 'answer' or event data already says.\n",
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            fromName,
            fromEmail,
            originalSubject,
            originalBody,
            coreAnswer,
            intent,
            source,
            zoomEvent,
          },
          null,
          2
        ),
      },
    ],
  });

  const raw = completion.choices[0].message.content ?? "{}";

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  const subject: string =
    parsed.subject || `Re: ${originalSubject || "Your question"}`;

  const body: string =
    parsed.body ||
    [
      fromName ? `Hi ${fromName},` : "Hi there,",
      "",
      coreAnswer || "Thank you for your email.",
      "",
      `${closing},`,
      defaultFromName,
    ].join("\n");

  return {
    subject,
    body,
    intent,
    source,
  };
}
