// lib/mailgunSend.ts
// Helper to send emails via Mailgun's API.

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
  throw new Error(
    "Missing MAILGUN_API_KEY or MAILGUN_DOMAIN env vars for Mailgun."
  );
}

export type MailgunSendParams = {
  to: string;
  subject: string;
  text: string;
  from?: string;
  replyTo?: string;
};

export async function sendMailgunEmail({
  to,
  subject,
  text,
  from,
  replyTo,
}: MailgunSendParams) {
  const baseUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

  const authString = Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64");

  const formData = new URLSearchParams();
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("text", text);

  // If not provided, we send from a generic address at your domain
  formData.append(
    "from",
    from || `Cora Assistant <cora@${MAILGUN_DOMAIN}>`
  );

  if (replyTo) {
    formData.append("h:Reply-To", replyTo);
  }

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const textBody = await res.text();
    console.error("[sendMailgunEmail] Mailgun error:", res.status, textBody);
    throw new Error(
      `Mailgun send failed with status ${res.status}: ${textBody}`
    );
  }

  return res.json();
}
