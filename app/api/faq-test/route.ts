// app/api/faq-test/route.ts
import { NextRequest, NextResponse } from "next/server";
import { answerFaqQuestion } from "@/lib/faqSearch";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const clientId = body.clientId as string | undefined;
    const question = body.question as string | undefined;

    if (!clientId) {
      return NextResponse.json(
        { error: "Missing 'clientId' in body" },
        { status: 400 }
      );
    }

    if (!question) {
      return NextResponse.json(
        { error: "Missing 'question' in body" },
        { status: 400 }
      );
    }

    const { answer, matches } = await answerFaqQuestion(clientId, question);

    return NextResponse.json({
      clientId,
      question,
      answer,
      matches,
    });
  } catch (err: any) {
    console.error("FAQ test route error:", err);
    return NextResponse.json(
      {
        error: "Internal error",
        details: String(err?.message || err),
      },
      { status: 500 }
    );
  }
}
