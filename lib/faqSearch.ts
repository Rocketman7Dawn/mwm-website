// lib/faqSearch.ts
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// SERVER-ONLY: don't import this from client components
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function searchClientFaq(
  clientId: string,
  question: string,
  matchCount = 5
) {
  // 1) Embed the user question
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const embedding = emb.data[0].embedding;

  // 2) Call the Postgres function
  const { data, error } = await supabase.rpc("match_knowledge_chunks", {
    query_embedding: embedding,
    match_count: matchCount,
    match_client_id: clientId,
  });

  if (error) {
    console.error("FAQ search error:", error);
    throw error;
  }

  // data is an array of { id, content, metadata, similarity }
  return data as {
    id: string;
    content: string;
    metadata: any;
    similarity: number;
  }[];
}

export async function answerFaqQuestion(
  clientId: string,
  question: string,
  matchCount = 5
) {
  // 1) Get relevant FAQ chunks
  const matches = await searchClientFaq(clientId, question, matchCount);

  const contextText = matches
    .map((m, i) => `[#${i + 1}]\n${m.content}`)
    .join("\n\n---\n\n");

  // 2) Ask the model to answer using that context
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini", // or another model you like
    messages: [
      {
        role: "system",
        content:
          "You are Cora, a warm, clear support assistant for a mindfulness/spiritual education business. " +
          "Answer ONLY using the information in the provided FAQ context. " +
          "If the answer is not present, say you are not sure and suggest contacting support.",
      },
      {
        role: "user",
        content:
          `User question:\n${question}\n\n` +
          `Relevant FAQ entries:\n${contextText}`,
      },
    ],
  });

  const answer = completion.choices[0].message.content ?? "";

  return {
    answer,
    matches,
  };
}
