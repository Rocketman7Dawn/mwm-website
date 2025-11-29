import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getClientEmailContext } from "@/lib/emailAssist"; // or whatever helper you’re using

// Plain JS – no "!"
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { clientSlug, userQuestion } = await req.json();

    if (!clientSlug || !userQuestion) {
      return NextResponse.json(
        { error: "clientSlug and userQuestion are required" },
        { status: 400 }
      );
    }

    // Pull context from Supabase (you may already have a helper for this)
    const context = await getClientEmailContext(clientSlug);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Cora, a helpful assistant summarizing email history and recommending how Cid can best support the client.",
        },
        {
          role: "user",
          content: `
Client slug: ${clientSlug}
User question: ${userQuestion}

Here is the email context for this client:

${context}
          `,
        },
      ],
    });

    const answer = chatCompletion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ success: true, answer });
  } catch (err) {
    console.error("Error in /api/email/assist:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
