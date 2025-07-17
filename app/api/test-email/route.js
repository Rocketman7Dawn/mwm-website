import { NextResponse } from 'next/server';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

export async function GET() {
  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAILGUN_FROM,
      to: 'cidisbell@gmail.com', // Replace with any test inbox
      subject: '🎉 Test Email from MWM',
      text: 'This is a test email sent from your deployed MWM site via Mailgun.',
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error('Mailgun error:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
