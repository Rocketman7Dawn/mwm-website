// app/clients/[clientId]/email-assistant/page.js

"use client";

import { useState } from "react";
import Link from "next/link";

const MODES = ["Draft Only", "Review & Send", "Smart Auto", "Full Auto"];

export default function EmailAssistantPage({ params }) {
  const { clientId } = params;
  const [selectedMode, setSelectedMode] = useState("Draft Only");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* Header + mode */}
        <header className="flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Email Support Studio
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Client:{" "}
              <span className="font-mono text-slate-200">{clientId}</span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="text-xs uppercase tracking-wide text-slate-400">
              Automation mode
            </span>
            <div className="flex flex-wrap gap-2">
              {MODES.map((mode) => {
                const isSelected = mode === selectedMode;
                const isLocked =
                  mode === "Smart Auto" || mode === "Full Auto"; // e.g. gated for paid later

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      if (!isLocked) setSelectedMode(mode);
                    }}
                    className={[
                      "rounded-full border px-3 py-1 text-xs font-medium transition",
                      isSelected
                        ? "border-teal-400 bg-teal-500/20 text-teal-200"
                        : "border-slate-700 bg-slate-900 text-slate-300 hover:border-teal-500 hover:text-teal-200",
                      isLocked ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {mode}
                    {isLocked && (
                      <span className="ml-1 text-[10px] align-middle">
                        🔒
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              className="text-xs text-teal-300 underline underline-offset-4 hover:text-teal-200"
            >
              {showHelp ? "Hide help" : "How does this work?"}
            </button>
          </div>
        </header>

        {/* Help / FAQ panel */}
        {showHelp && (
          <section className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-xs text-slate-100">
            <h2 className="text-sm font-semibold text-teal-300">
              Email Support Studio – How This Works
            </h2>
            <div className="mt-3 space-y-4 leading-relaxed">
              <div>
                <p className="font-semibold">
                  What does the Email Support Studio do for me?
                </p>
                <p className="mt-1 text-slate-300">
                  It helps you handle repeat questions from your clients and
                  participants. The Studio reads incoming emails, uses your FAQ
                  and your settings, and prepares warm, clear replies that match
                  your work and your values.
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  How do emails get into the Studio?
                </p>
                <p className="mt-1 text-slate-300">
                  You&apos;ll receive a private Email Studio address, for
                  example{" "}
                  <span className="font-mono bg-slate-900 px-1 py-0.5 rounded">
                    yourname@assist.mindfulnesswithmind.com
                  </span>
                  . You can add this address to your website contact form, add a
                  forwarding rule in your email, or manually forward messages
                  you&apos;d like help with. A copy of those emails appears here
                  as conversations.
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  What happens after an email arrives?
                </p>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-slate-300">
                  <li>A copy reaches your Email Studio address.</li>
                  <li>
                    The Studio prepares a draft reply based on your FAQ and
                    settings.
                  </li>
                  <li>
                    You see the email and draft here in the dashboard, under
                    &quot;Needs your review&quot; or &quot;History.&quot;
                  </li>
                  <li>
                    Depending on your mode, replies are only drafted, waiting
                    for approval, or sent automatically when they&apos;re
                    simple and safe to answer.
                  </li>
                </ol>
              </div>

              <div>
                <p className="font-semibold">
                  What are the different modes for sending?
                </p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                  <li>
                    <span className="font-semibold">Draft Only</span> – We
                    write drafts; you send everything yourself.
                  </li>
                  <li>
                    <span className="font-semibold">Review &amp; Send</span> –
                    We draft replies; you approve or edit before they go out.
                  </li>
                  <li>
                    <span className="font-semibold">Smart Auto</span> – The
                    Studio answers simple questions automatically and routes
                    sensitive topics to you.
                  </li>
                  <li>
                    <span className="font-semibold">Full Auto</span> – Within
                    clear rules and boundaries you define, the Studio can send
                    replies on your behalf.
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">
                  Can I see and edit what&apos;s being sent?
                </p>
                <p className="mt-1 text-slate-300">
                  Yes. Anything that needs your review will appear in
                  &quot;Needs your attention.&quot; You can open each email,
                  edit the draft, and approve before sending. You can also see
                  a history of replies that have already gone out.
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  Where can I read the full FAQ?
                </p>
                <p className="mt-1 text-slate-300">
                  For a more detailed walkthrough, you can read the full{" "}
                  <Link
                    href="/email-support-studio/faq"
                    className="text-teal-300 underline underline-offset-4 hover:text-teal-200"
                  >
                    Email Support Studio Help &amp; FAQ
                  </Link>{" "}
                  on the Mindfulness with Mind website.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Main content area: queue + setup checklist (placeholders for now) */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Left: Queue / drafts */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h2 className="text-sm font-semibold text-slate-100">
              Needs your attention
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Incoming emails that are waiting for a reply or approval will
              appear here.
            </p>
            {/* TODO: Replace with real data table */}
            <div className="mt-4 rounded-xl border border-dashed border-slate-700 p-4 text-xs text-slate-500">
              No emails yet. Once your Email Studio address is receiving
              messages, drafts will appear here for you to review.
            </div>
          </div>

          {/* Right: Setup checklist + status */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold text-slate-100">
                Setup checklist
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                A quick overview of what&apos;s needed for Email Support Studio
                to run smoothly.
              </p>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                <li>⬜ Upload FAQ</li>
                <li>⬜ Upload &quot;About You / About Your Work&quot;</li>
                <li>⬜ Connect or choose an email flow</li>
                <li>⬜ Choose your automation mode</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
              <h2 className="text-sm font-semibold text-slate-100">
                Activity overview
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                A quick snapshot of how the Studio is supporting you.
              </p>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Emails received today</dt>
                  <dd className="font-mono text-slate-100">0</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Drafts created today</dt>
                  <dd className="font-mono text-slate-100">0</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Replies sent this week</dt>
                  <dd className="font-mono text-slate-100">0</dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
