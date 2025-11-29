import { NextResponse } from 'next/server';
import { ingestEmail } from '@/lib/emailIngest';

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const recipient = form.get('recipient') as string | null;
    const toHeader = form.get('To') as string | null;
    const from =
      (form.get('sender') as string | null) ||
      (form.get('from') as string | null) ||
      '';
    const subject = (form.get('subject') as string | null) || '';
    const bodyText =
      (form.get('stripped-text') as string | null) ||
      (form.get('body-plain') as string | null) ||
      (form.get('text') as string | null) ||
      '';

    const to = toHeader || recipient || '';

    const emailRow = await ingestEmail({
      to,
      from,
      subject,
      bodyText,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, emailId: emailRow.id });
  } catch (err: any) {
    console.error('Error in /api/email/inbound-mailgun:', err);
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
