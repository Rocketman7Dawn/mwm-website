import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.MAILGUN_BASE_URL || "https://api.mailgun.net";
  const domain = process.env.MAILGUN_DOMAIN;
  const auth = "Basic " + Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64");

  const url = new URL(`${base}/v3/${domain}/events`);
  url.searchParams.set("limit", "25");

  const r = await fetch(url, { headers: { Authorization: auth }, cache: "no-store" });
  const text = await r.text();
  return r.ok ? NextResponse.json(JSON.parse(text)) : new NextResponse(text, { status: 502 });
}
