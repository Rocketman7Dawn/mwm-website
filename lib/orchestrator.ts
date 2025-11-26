// lib/orchestrator.ts
import OpenAI from "openai";
import { answerFaqQuestion } from "@/lib/faqSearch";
import { answerZoomQuestion } from "@/lib/zoomEvents";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Simple intent type
export type ChatIntent = "zoom" | "faq" | "other";

async function classifyIntent(message: string): Promise<ChatIntent> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini", // small + cheap is fine here
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You are a classifier for a support chatbot.\n" +
          "Decide if the user message is about a ZOOM EVENT (links, times, how to join), " +
          "about GENERAL FAQ (policies, products, program info, shipping, refunds, etc.), " +
          "or OTHER.\n\n" +
          "Return exactly one word: 'zoom', 'faq', or 'other'.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const raw = completion.choices[0].message.content?.trim().toLowerCase();

  if (raw === "zoom" || raw === "faq" || raw === "other") {
    return raw;
  }

  // Fallback if model misbehaves
  return "faq";
}

export async function handleClientMessage(options: {
  clientId: string;
  message: string;
  channel?: string; // "web_chat", "email", etc. (for later)
}) {
  const { clientId, message, channel } = options;

  const intent = await classifyIntent(message);

  if (intent === "zoom") {
    const { answer, event } = await answerZoomQuestion(clientId, message);
    return {
      intent,
      channel: channel ?? "unknown",
      answer,
      zoomEvent: event,
      source: "zoom",
    };
  }

  if (intent === "faq") {
    const { answer, matches } = await answerFaqQuestion(clientId, message);
    return {
      intent,
      channel: channel ?? "unknown",
      answer,
      faqMatches: matches,
      source: "faq",
    };
  }

  // intent === "other" (for now we just try FAQ anyway)
  const { answer, matches } = await answerFaqQuestion(clientId, message);
  return {
    intent,
    channel: channel ?? "unknown",
    answer,
    faqMatches: matches,
    source: "faq",
  };
}
