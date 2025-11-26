// app/admin/page.js
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Only allow logged-in MWM Admins
  if (!session || !session.user?.isMwmAdmin) {
    redirect("/auth/signin");
  }

  return (
    <AuthenticatedLayout active="admin">
      {/* Top header row */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-50">
            MWM Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Internal console for clients, AI tools, Mailgun, and Zoom integration.
          </p>
        </div>

        {/* Admin logout */}
        <form action="/auth/signout" method="get">
          <button
            type="submit"
            className="rounded-full bg-white/90 px-4 py-1 text-sm font-medium text-slate-900 hover:bg-white"
          >
            Log out
          </button>
        </form>
      </header>

      <section className="space-y-6 text-sm text-slate-100">
        {/* Clients Section */}
        <div className="rounded-2xl bg-slate-900/70 p-5 ring-1 ring-white/10">
          <h2 className="text-base font-semibold text-slate-50">Clients</h2>
          <p className="mt-1 text-xs text-slate-300">
            Quick links into client admin dashboards.
          </p>
          <div className="mt-3 space-y-1 text-xs">
            <div>
              <a
                href="/clients"
                className="text-sky-300 underline hover:text-sky-200"
              >
                All Clients (future list)
              </a>
            </div>
            <div>
              <a
                href="/clients/mwp"
                className="text-sky-300 underline hover:text-sky-200"
              >
                Mayan Wisdom Project (/clients/mwp)
              </a>
            </div>
          </div>
        </div>

        {/* MWM AI Tools Hub */}
        <div className="rounded-2xl bg-slate-900/70 p-5 ring-1 ring-white/10">
          <h2 className="text-base font-semibold text-slate-50">
            MWM AI Tools Hub
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            Internal dev endpoints for testing chat, email, FAQ, and Zoom tools.
          </p>
          <ul className="mt-3 space-y-1 text-xs">
            <li>
              <a
                href="/dev/chat-test"
                className="text-sky-300 underline hover:text-sky-200"
              >
                Chat Test (/dev/chat-test)
              </a>{" "}
              <span className="text-[0.65rem] text-green-400">existing</span>
            </li>
            <li>
              <span className="text-slate-400">/dev/email-draft-test</span>{" "}
              <span className="text-[0.65rem] text-yellow-400">
                placeholder
              </span>
            </li>
            <li>
              <span className="text-slate-400">/dev/email-logs</span>{" "}
              <span className="text-[0.65rem] text-yellow-400">
                placeholder
              </span>
            </li>
            <li>
              <span className="text-slate-400">/dev/faq-test</span>{" "}
              <span className="text-[0.65rem] text-yellow-400">
                placeholder
              </span>
            </li>
            <li>
              <span className="text-slate-400">/dev/zoom-test</span>{" "}
              <span className="text-[0.65rem] text-yellow-400">
                placeholder
              </span>
            </li>
          </ul>
        </div>

        {/* Mailgun Section */}
        <div className="rounded-2xl bg-slate-900/70 p-5 ring-1 ring-white/10">
          <h2 className="text-base font-semibold text-slate-50">Mailgun</h2>
          <p className="mt-1 text-xs text-slate-300">
            Send test emails and inspect recent events.
          </p>

          {/* Test Email Form – wire later to /api/mailgun/test */}
          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-medium text-slate-50">
              Send Test Email
            </h3>
            <form
              action="/api/mailgun/test" // TODO: create this API route
              method="POST"
              className="max-w-md space-y-3"
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" htmlFor="to">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="rounded border border-slate-600 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                  placeholder="you@example.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="rounded border border-slate-600 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                  placeholder="Test from MWM Admin"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" htmlFor="text">
                  Text
                </label>
                <textarea
                  id="text"
                  name="text"
                  rows={3}
                  className="rounded border border-slate-600 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none focus:border-sky-400"
                  placeholder="Hello from Mindfulness with Mind ✨"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-white/90 px-4 py-1.5 text-xs font-medium text-slate-900 hover:bg-white"
              >
                Send Test Email
              </button>
            </form>
          </div>

          {/* Events Viewer placeholder */}
          <div className="mt-4 space-y-1 border-t border-slate-700 pt-3">
            <h3 className="text-sm font-medium text-slate-50">
              Events Viewer
            </h3>
            <p className="text-[0.7rem] text-slate-400">
              Later: filters (date, event type) and a link to raw JSON per
              event.
            </p>
            <p className="text-[0.7rem] text-slate-500">
              Placeholder – wire to /api/mailgun/events when ready.
            </p>
          </div>
        </div>

        {/* Zoom Section */}
        <div className="rounded-2xl bg-slate-900/70 p-5 ring-1 ring-white/10">
          <h2 className="text-base font-semibold text-slate-50">Zoom</h2>
          <p className="mt-1 text-xs text-slate-300">
            Current webhook endpoint and integration status.
          </p>

          {/* For now, static/placeholder; later, read from config/env/DB */}
          <div className="mt-3 space-y-1 text-xs">
            <div className="font-mono break-all text-slate-200">
              Current webhook endpoint:{" "}
              <span className="text-slate-300">
                https://your-domain.com/api/zoom/webhook
              </span>
            </div>
            <div className="text-[0.7rem] text-slate-400">
              Later: fetch this from config/DB and show verification status.
            </div>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  );
}
