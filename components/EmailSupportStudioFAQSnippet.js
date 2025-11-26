// components/EmailSupportStudioFAQSnippet.js

import Link from "next/link";

export default function EmailSupportStudioFAQSnippet() {
  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
      <h3 className="text-lg font-semibold text-teal-300">
        Email Support Studio – FAQ
      </h3>

      <dl className="mt-4 space-y-4 text-sm text-slate-100">
        <div>
          <dt className="font-semibold">
            How does Email Support Studio work?
          </dt>
          <dd className="mt-1 text-slate-300">
            Your clients email you like they normally do. A copy of those
            emails is sent to your private Email Studio address. The Studio
            reads the message, looks at your FAQ and &quot;About&quot;
            information, and prepares a caring, on-brand reply for you.
          </dd>
        </div>

        <div>
          <dt className="font-semibold">Do I need a new email address?</dt>
          <dd className="mt-1 text-slate-300">
            You keep your existing email. We add a special Email Studio address
            (for example{" "}
            <span className="font-mono text-xs bg-slate-900 px-1 py-0.5 rounded">
              yourname@assist.mindfulnesswithmind.com
            </span>
            ) that receives a copy of the messages you want help with.
          </dd>
        </div>

        <div>
          <dt className="font-semibold">
            What are my options for automation?
          </dt>
          <dd className="mt-1 text-slate-300">
            You choose your level of support:
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>
                <span className="font-semibold">Draft Only</span> – We write
                replies; you copy, edit, and send.
              </li>
              <li>
                <span className="font-semibold">Review &amp; Send</span> – We
                draft; you approve or edit before anything goes out.
              </li>
              <li>
                <span className="font-semibold">Smart Auto</span> – Simple,
                repetitive questions can be answered automatically; sensitive
                topics are sent to you for review.
              </li>
              <li>
                <span className="font-semibold">Full Auto</span> – Within clear
                boundaries you define, the Studio can answer on your behalf.
              </li>
            </ul>
          </dd>
        </div>

        <div>
          <dt className="font-semibold">
            Can I see what&apos;s being sent and change modes?
          </dt>
          <dd className="mt-1 text-slate-300">
            Yes. Your dashboard shows incoming messages, drafts, sent replies,
            and anything waiting for your review. You can change modes at any
            time with a single click.
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <Link
          href="/email-support-studio/faq"
          className="text-sm font-medium text-teal-300 underline underline-offset-4 hover:text-teal-200"
        >
          Read the full Email Support Studio Help &amp; FAQ
        </Link>
      </div>
    </div>
  );
}
