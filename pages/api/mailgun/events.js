// pages/api/mailgun/events.js

export default async function handler(req, res) {
  try {
    const base = process.env.MAILGUN_BASE_URL || "https://api.mailgun.net";
    const domain = process.env.MAILGUN_DOMAIN;
    const apiKey = process.env.MAILGUN_API_KEY;

    if (!domain || !apiKey) {
      return res
        .status(500)
        .json({ ok: false, error: "Missing MAILGUN_DOMAIN or MAILGUN_API_KEY" });
    }

    const auth =
      "Basic " + Buffer.from(`api:${apiKey}`).toString("base64");

    const { limit = 25, recipient, event, next, previous, begin, end } = req.query;

    let url;

    // Support Mailgun's paging URLs (next/previous) safely
    if (typeof next === "string" || typeof previous === "string") {
      const raw = (next || previous);
      try {
        const parsed = new URL(raw);
        // allow only Mailgun API hosts and an /events path
        const allowedHost = /^(api(\.eu)?\.mailgun\.net)$/i.test(parsed.host);
        const looksLikeEvents = /\/events/i.test(parsed.pathname);
        if (!allowedHost || !looksLikeEvents) {
          return res.status(400).json({ ok: false, error: "Invalid paging URL" });
        }
        url = parsed;
      } catch {
        return res.status(400).json({ ok: false, error: "Invalid paging URL" });
      }
    } else {
      // Fresh query
      url = new URL(`${base}/v3/${domain}/events`);
      url.searchParams.set("limit", String(limit));
      if (recipient) url.searchParams.set("recipient", String(recipient));
      if (event) url.searchParams.set("event", String(event));
      if (begin) url.searchParams.set("begin", String(begin)); // epoch or RFC2822
      if (end) url.searchParams.set("end", String(end));
    }

    const r = await fetch(url.toString(), {
      headers: { Authorization: auth },
      cache: "no-store",
    });

    const text = await r.text();
    res
      .status(r.status)
      .setHeader("Content-Type", r.headers.get("content-type") || "application/json")
      .send(text);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
