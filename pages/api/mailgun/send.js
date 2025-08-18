// pages/api/mailgun/send.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const base = process.env.MAILGUN_BASE_URL || "https://api.mailgun.net";
    const domain = process.env.MAILGUN_DOMAIN;
    const apiKey = process.env.MAILGUN_API_KEY;
    const from = process.env.EMAIL_FROM || `no-reply@${domain}`;

    if (!domain || !apiKey) {
      return res.status(500).json({ ok: false, error: "Missing MAILGUN_DOMAIN or MAILGUN_API_KEY" });
    }

    const { to, subject = "Mailgun test", text = "Hello from MWM!", html } = req.body || {};
    if (!to) return res.status(400).json({ ok: false, error: "Missing 'to'" });

    const form = new URLSearchParams({ from, to, subject, text });
    if (html) form.set("html", html);

    const r = await fetch(`${base}/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${apiKey}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    const out = await r.text();
    return res.status(r.status).send(out);
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
