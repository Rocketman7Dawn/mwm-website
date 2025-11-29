// app/api/email/ingest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ingestEmail } from '@/lib/emailIngest';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Shape this to match your provider.
    // Example if you're simulating manually:
    // {
    //   "to": "mwm-intake+iva@mindfulnesswithmind.com",
    //   "from": "iva@example.com",
    //   "subject": "New retreat idea",
    //   "bodyText": "Hey Cid, I was thinking about..."
    // }

    const { to, from, subject, bodyText, bodyHtml, receivedAt } = payload;

    if (!to || !from) {
      return NextResponse.json(
        { error: 'Missing "to" or "from" fields' },
        { status: 400 }
      );
    }

    const emailRow = await ingestEmail({
      to,
      from,
      subject,
      bodyText,
      bodyHtml,
      receivedAt,
    });

    return NextResponse.json({ success: true, emailId: emailRow.id });
  } catch (err: any) {
    console.error('Error ingesting email:', err);
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
