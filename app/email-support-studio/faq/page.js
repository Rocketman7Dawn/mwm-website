// app/email-support-studio/faq/page.js

export const metadata = {
  title: "Email Support Studio – Help & FAQ | Mindfulness with Mind",
  description:
    "Learn how the Email Support Studio works, from setup to automation modes and safety options.",
};

export default function EmailSupportStudioFAQPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Email Support Studio – Help & FAQ
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            A thoughtful guide to how Email Support Studio works, and how you can
            shape it to support your work.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-6 text-slate-100">
          {/* Q1 */}
          <section>
            <h2 className="text-lg font-semibold text-teal-300">
              1. What does the Email Support Studio do for me?
            </h2>
            <p className="mt-2">
              Email Support Studio helps you handle repeat questions from your
              clients and participants. It reads incoming emails, uses your FAQ
              and your settings, and prepares warm, clear replies that match
              your voice and your values.
            </p>
          </section>

          {/* Q2 */}
          <section>
            <h2 className="text-lg font-semibold text-teal-300">
              2. How do emails get into the Studio?
            </h2>
            <p className="mt-2">
              You&apos;ll receive a private Email Studio address, for example{" "}
              <span className="font-mono text-xs bg-slate-900 px-1 py-0.5 rounded">
                yourname@assist.mindfulnesswithmind.com
              </span>
              . You can:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Add this address as a second recipient on your website contact form,</li>
              <li>Add a simple forwarding rule in your email, or</li>
              <li>Manually forward any email you&apos;d like help with.</li>
            </ul>
            <p className="mt-2">
              A copy of those emails arrives in your dashboard as{" "}
              <em>conversations</em>.
            </p>
          </section>

          {/* Q3 */}
          <section>
            <h2 className="text-lg font-semibold text-teal-300">
              3. What happens after an email arrives?
            </h2>
            <ol className="mt-2 list-decimal space-y-1 pl-6">
              <li>A copy reaches your Email Studio address.</li>
              <li>
                The Studio reads the message and prepares a draft reply based on
                your FAQ, your &quot;About&quot; information, and your current
                settings.
              </li>
              <li>
                You&apos;ll see the email and the draft reply in your dashboard.
              </li>
              <li>
                Depending on your mode, the reply is only drafted, waiting for
                your approval, or sent automatically when it&apos;s simple and
                safe to answer.
              </li>
            </ol>
          </section>

          {/* Q4 */}
          <section>
            <h2 className="text-lg font-semibold text-teal-300">
              4. What are the different modes and how do I choose?
            </h2>
            <p className="mt-2">
              You can choose between four modes in the Email Assistant:
            </p>
            <ul className="mt-2 space-y-3">
              <li>
                <span className="font-semibold">Draft Only</span> – We write
                drafts; you send everything yourself.
              </li>
              <li>
                <span className="font-semibold">Review &amp; Send</span> – We
                draft replies; you approve or edit before anything goes out.
              </li>
              <li>
                <span className="font-semibold">Smart Auto</span> – The Studio
                automatically answers simple questions (logistics, times, basic
                info) and sends anything sensitive to you for review.
              </li>
              <li>
                <span className="font-semibold">Full Auto</span> – Within clear
                rules and safety boundaries you define, the Studio sends replies
                on your behalf.
              </li>
            </ul>
            <p className="mt-2">
              You can switch modes at any time using the buttons at the top of
              your Email Assistant.
            </p>
          </section>

          {/* Q5 */}
          <section>
            <h2 className="text-lg font-semibold text-teal-300">
              5. Can I see and edit what&apos;s being sent?
            </h2>
            <p className="mt-2">
              Yes. Your dashboard has a{" "}
              <span className="font-semibold">Needs your review</span> list
              where you can open, edit, and approve drafts, and a{" "}
              <span className="font-semibold">History</span> section where you
              can see what has already been sent.
            </p>
            <p className="mt-2">
              Even in more automated modes, anything that matches your
              &quot;escalate to me&quot; rules will appear for your review
              first.
            </p>
          </section>

          {/* Q6 */}
          <section>
            <h2 className="text-lg font-semibold text-teal-300">
              6. How does the Studio learn my voice and boundaries?
            </h2>
            <p className="mt-2">
              During setup, you&apos;ll upload your FAQ and a short &quot;About
              You / About Your Work&quot; document, and you&apos;ll tell us how
              you like to address people, how formal or casual you want to be,
              and topics that should always be handled personally.
            </p>
            <p className="mt-2">
              Over time, you can update these materials and settings if your
              work or your language evolves.
            </p>
          </section>

          {/* Q7 */}
          <section>
            <h2 className="text-lg font-semibold text-teal-300">
              7. What if I only want help sometimes?
            </h2>
            <p className="mt-2">
              That&apos;s completely fine. You can stay in{" "}
              <span className="font-semibold">Draft Only</span> mode and just
              forward messages when you want support. The Studio will prepare
              drafts for you to use, and you remain fully hands-on.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
