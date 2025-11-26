// app/admin/page.js
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Only allow logged-in MWM Admins
  if (!session || !session.user?.isMwmAdmin) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">MWM Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Internal console for clients, AI tools, Mailgun, and Zoom integration.
        </p>
      </header>

      {/* Clients Section */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Clients</h2>
        <p className="text-sm text-gray-500">
          Quick links into client admin dashboards.
        </p>
        <div className="space-y-2">
          <div>
            <a
              href="/clients"
              className="text-blue-600 underline hover:no-underline"
            >
              All Clients (future list)
            </a>
          </div>
          <div>
            <a
              href="/clients/mwp"
              className="text-blue-600 underline hover:no-underline"
            >
              Mayan Wisdom Project (/clients/mwp)
            </a>
          </div>
        </div>
      </section>

      {/* MWM AI Tools Hub */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">MWM AI Tools Hub</h2>
        <p className="text-sm text-gray-500">
          Internal dev endpoints for testing chat, email, FAQ, and Zoom tools.
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            <a
              href="/dev/chat-test"
              className="text-blue-600 underline hover:no-underline"
            >
              Chat Test (/dev/chat-test)
            </a>{" "}
            <span className="text-xs text-green-600">existing</span>
          </li>
          <li>
            <span className="text-gray-400">/dev/email-draft-test</span>{" "}
            <span className="text-xs text-yellow-600">placeholder</span>
          </li>
          <li>
            <span className="text-gray-400">/dev/email-logs</span>{" "}
            <span className="text-xs text-yellow-600">placeholder</span>
          </li>
          <li>
            <span className="text-gray-400">/dev/faq-test</span>{" "}
            <span className="text-xs text-yellow-600">placeholder</span>
          </li>
          <li>
            <span className="text-gray-400">/dev/zoom-test</span>{" "}
            <span className="text-xs text-yellow-600">placeholder</span>
          </li>
        </ul>
      </section>

      {/* Mailgun Section */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Mailgun</h2>
        <p className="text-sm text-gray-500">
          Send test emails and inspect recent events.
        </p>

        {/* Test Email Form – you can wire this later to /api/mailgun/test */}
        <div className="space-y-3">
          <h3 className="text-md font-medium">Send Test Email</h3>
          <form
            action="/api/mailgun/test" // TODO: create this API route
            method="POST"
            className="space-y-3 max-w-md"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="to">
                To
              </label>
              <input
                id="to"
                name="to"
                type="email"
                required
                className="border rounded px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="border rounded px-3 py-2 text-sm"
                placeholder="Test from MWM Admin"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="text">
                Text
              </label>
              <textarea
                id="text"
                name="text"
                rows={3}
                className="border rounded px-3 py-2 text-sm"
                placeholder="Hello from Mindfulness with Mind ✨"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded bg-black text-white hover:bg-gray-800"
            >
              Send Test Email
            </button>
          </form>
        </div>

        {/* Events Viewer placeholder */}
        <div className="space-y-2 pt-4 border-t">
          <h3 className="text-md font-medium">Events Viewer</h3>
          <p className="text-xs text-gray-500">
            Later: filters (date, event type) and a link to raw JSON per event.
          </p>
          <p className="text-xs text-gray-400">
            Placeholder – wire to /api/mailgun/events when ready.
          </p>
        </div>
      </section>

      {/* Zoom Section */}
      <section className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Zoom</h2>
        <p className="text-sm text-gray-500">
          Current webhook endpoint and integration status.
        </p>

        {/* For now, static/placeholder; later, read from config/env/DB */}
        <div className="text-sm space-y-1">
          <div className="font-mono break-all">
            Current webhook endpoint:{" "}
            <span className="text-gray-700">
              https://your-domain.com/api/zoom/webhook
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Later: fetch this from config/DB and show verification status.
          </div>
        </div>
      </section>
    </main>
  );
}
