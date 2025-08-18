export default function EmailTestPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Inbound Email Test (No Mailgun required)</h1>
      <form method="POST" action="/api/email/inbound" encType="multipart/form-data" style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
        <label>Sender (from): <input name="sender" defaultValue="test.sender@example.com" required /></label>
        <label>Recipient (to): <input name="recipient" defaultValue="support@mindfulnesswithmind.com" required /></label>
        <label>Subject: <input name="subject" defaultValue="Schedule a Zoom session" /></label>
        <label>Body (stripped-text): <textarea name="stripped-text" rows={6} defaultValue="Hola, ¿cómo reservo una sesión esta semana?" /></label>
        <button type="submit">Send test to /api/email/inbound</button>
      </form>
    </main>
  );
}
