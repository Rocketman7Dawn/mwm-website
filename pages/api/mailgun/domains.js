// pages/api/mailgun/domains.js
export default async function handler(req, res) {
  try {
    const base = process.env.MAILGUN_BASE_URL || "https://api.mailgun.net";
    const auth = "Basic " + Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString("base64");
    const r = await fetch(`${base}/v3/domains?limit=50`, { headers: { Authorization: auth } });
    const txt = await r.text();
    res.status(r.status).send(txt);
  } catch (e) {
    res.status(500).json({ ok:false, error:e.message });
  }
}
