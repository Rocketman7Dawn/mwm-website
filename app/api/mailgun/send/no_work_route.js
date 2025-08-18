import { NextResponse } from "next/server";

const authHeader = () =>
  "Basic " + Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64");

export async function POST(req) {
  try {
    const { to, subject, text, html } = await req.json();
    const base = process.env.MAILGUN_BASE_URL || "https://api.mailgun.net";
    const domain = process.env.MAILGUN_DOMAIN;
    const from = process.env.MAILGUN_SENDER || `mailgun@${domain}`;

    const body = new URLSearchParams({
      from, to,
      subject: subject || "Mailgun test",
      text: text || "",
      ...(html ? { html } : {}),
    });

    const r = await fetch(`${base}/v3/${domain}/messages`, {
      method: "POST",
      headers: { Authorization: authHeader(), "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    const txt = await r.text();
    return r.ok
      ? NextResponse.json({ ok: true, body: txt })
      : new NextResponse(JSON.stringify({ ok: false, status: r.status, body: txt }), { status: 502 });
  } catch (e) {
    return new NextResponse(JSON.stringify({ ok: false, error: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
