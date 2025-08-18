// app/admin/page.jsx
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
  // Wrap this page with SessionProvider so useSession works even if your app/layout doesn't include it.
  return (
    <SessionProvider>
      <AdminInner />
    </SessionProvider>
  );
}

function AdminInner() {
  const { data: session } = useSession();

  // --- Mailgun Send Test ---
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Mailgun test from Admin");
  const [text, setText] = useState("Hello from MWM Admin!");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // --- Mailgun Events ---
  const [recipient, setRecipient] = useState("");
  const [event, setEvent] = useState("delivered"); // '', delivered, failed, accepted, opened, clicked
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsData, setEventsData] = useState(null);

  // Prefill with signed-in email
  useEffect(() => {
    if (session?.user?.email) {
      setTo((v) => v || session.user.email);
      setRecipient((v) => v || session.user.email);
    }
  }, [session?.user?.email]);

  const webhookUrl = useMemo(() => {
    if (typeof window === "undefined") return "/api/zoom/webhook";
    return `${window.location.origin.replace(/\/$/, "")}/api/zoom/webhook`;
  }, []);

  async function sendTestEmail(e) {
    e.preventDefault();
    setSending(true);
    setSendResult(null);
    try {
      const r = await fetch("/api/mailgun/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, text }),
      });
      const out = await r.text();
      setSendResult({ ok: r.ok, status: r.status, body: out });
    } catch (err) {
      setSendResult({ ok: false, status: 0, body: String(err) });
    } finally {
      setSending(false);
    }
  }

  async function loadEvents() {
    setEventsLoading(true);
    setEventsData(null);
    try {
      const qs = new URLSearchParams();
      if (recipient) qs.set("recipient", recipient);
      if (event) qs.set("event", event);
      const r = await fetch(`/api/mailgun/events?${qs.toString()}`, { cache: "no-store" });
      const text = await r.text();
      setEventsData({ ok: r.ok, status: r.status, body: tryParse(text) });
    } catch (err) {
      setEventsData({ ok: false, status: 0, body: String(err) });
    } finally {
      setEventsLoading(false);
    }
  }

  const jsonLink = `/api/mailgun/events?${new URLSearchParams({
    recipient: recipient || "",
    event: event || "",
  }).toString()}`;

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>Admin</h1>

      <section style={card}>
        <h2>Clients</h2>
        <p><a href="/clients">Open MWP</a></p>
      </section>

      <section style={card}>
        <h2>Mailgun</h2>

        <h3>Send test email</h3>
        <form onSubmit={sendTestEmail} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
          <label>
            To
            <input value={to} onChange={(e) => setTo(e.target.value)} type="email" required style={input} />
          </label>
          <label>
            Subject
            <input value={subject} onChange={(e) => setSubject(e.target.value)} style={input} />
          </label>
          <label>
            Text
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} style={input} />
          </label>
          <button disabled={sending} style={button}>
            {sending ? "Sending…" : "Send"}
          </button>
        </form>
        {sendResult && <pre style={pre}>{JSON.stringify(sendResult, null, 2)}</pre>}

        <h3 style={{ marginTop: 24 }}>Recent Events</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input
            placeholder="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={input}
          />
          <select value={event} onChange={(e) => setEvent(e.target.value)} style={input}>
            <option value="">any event</option>
            <option value="delivered">delivered</option>
            <option value="accepted">accepted</option>
            <option value="failed">failed</option>
            <option value="opened">opened</option>
            <option value="clicked">clicked</option>
          </select>
          <button onClick={loadEvents} disabled={eventsLoading} style={button}>
            {eventsLoading ? "Loading…" : "Load"}
          </button>
          <a href={jsonLink}>Open as JSON</a>
        </div>
        {eventsData && <pre style={pre}>{JSON.stringify(eventsData, null, 2)}</pre>}
      </section>

      <section style={card}>
        <h2>Zoom</h2>
        <p>Webhook endpoint: <code>{webhookUrl}</code></p>
      </section>

      <footer style={{ marginTop: 40, opacity: 0.7 }}>
        <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a>
      </footer>
    </main>
  );
}

function tryParse(t) { try { return JSON.parse(t); } catch { return t; } }

const card = { background:"#fff", border:"1px solid #eee", borderRadius:12, padding:16, margin:"16px 0", boxShadow:"0 1px 2px rgba(0,0,0,0.04)" };
const input = { width:"100%", padding:"8px 10px", border:"1px solid #ddd", borderRadius:8, marginTop:4 };
const button = { padding:"8px 12px", borderRadius:8, border:"1px solid #ccc", background:"#f7f7f7", cursor:"pointer" };
const pre = { marginTop:12, background:"#f8f9fb", padding:12, borderRadius:8, overflow:"auto", maxHeight:320 };
