// lib/zoomEvents.ts
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getNextZoomEventForClient(clientId: string) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("zoom_events")
    .select("*")
    .eq("client_id", clientId)
    .gte("start_time", now)
    .order("start_time", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching next Zoom event:", error);
    throw error;
  }

  return data; // null if no upcoming events
}

export async function answerZoomQuestion(
  clientId: string,
  question: string
) {
  const event = await getNextZoomEventForClient(clientId);

  if (!event) {
    // No upcoming events found
    return {
      answer:
        "I’m not seeing any upcoming online events scheduled right now. Please contact the team directly so they can confirm dates and send you the correct Zoom link.",
      event: null,
    };
  }

  // Ask the model to answer using this specific event
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini", // or another you prefer
    messages: [
      {
        role: "system",
        content:
          "You are Cora, a warm, clear support assistant for an online spiritual education community. " +
          "You are helping someone with questions about an upcoming Zoom event. " +
          "Use ONLY the event data provided. Be concise and kind. Include the Zoom link and passcode if present.",
      },
      {
        role: "user",
        content:
          `User question:\n${question}\n\n` +
          `Event data (JSON):\n` +
          JSON.stringify(event, null, 2),
      },
    ],
  });

  const answer = completion.choices[0].message.content ?? "";

  return {
    answer,
    event,
  };
}
