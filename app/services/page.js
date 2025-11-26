// app/services/page.js
import Header from "../../components/Header";

import EmailSupportStudioFAQSnippet from "@/components/EmailSupportStudioFAQSnippet";

// ...inside your Email Support Studio section:

<section id="email-support-studio" className="...">
  {/* Existing content about the offering */}
  {/* ... */}

  <EmailSupportStudioFAQSnippet />
</section>
const BG_SRC = "/Customization.png"; // background for Services page

export default function ServicesPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${BG_SRC})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
      }}
    >
      <Header active="services" />

      <main className="services-wrap">
        {/* TOP ROW: text + hero image */}
        <section className="services-grid">
          <div>
            <h1 className="services-title">Services</h1>

            <p className="services-intro">
              Thoughtful AI support for coaches, teachers, retreat leaders, and
              conscious organizations.
            </p>
            <p className="services-intro">
              Instead of juggling a “tech salad” of separate tools, Mindfulness
              With Mind offers a unified studio of support that quietly handles
              repetitive questions, logistics, and follow-ups in your voice.
            </p>

            <h2 className="services-subtitle">At a glance, we offer:</h2>
            <ul className="services-list">
              <li>Email Support Studio</li>
              <li>Client Support &amp; FAQ Assistant</li>
              <li>Session Notes &amp; Summary Helper (early access)</li>
              <li>Live Circle &amp; Zoom Co-Pilot (coming soon)</li>
              <li>Auto-Transcriptions &amp; Insight Summaries (coming soon)</li>
              <li>
                MWM Studio: Client Resource Library &amp; Portal (in development)
              </li>
            </ul>

            {/* NEW: links under "At a glance" */}
            <h3 className="services-link-heading">
              <a href="#by-offering">Services by Offering</a>
            </h3>
            <h3 className="services-link-heading">
              <a href="#by-business-type">Services by Business Type</a>
            </h3>
          </div>

          {/* right image */}
          <div className="services-right">
            <img
              src="/Cora0.png"
              alt="Cora AI Agent"
              className="services-hero"
              width={360}
              height={360}
            />
          </div>
        </section>

        {/* SECTION: Services by Offering */}
        <section id="by-offering">
          <h2>Services by Offering</h2>
          <p className="services-body-text">
            These are the core building blocks of the MWM studio – the specific
            ways we can support your practice and your team.
          </p>

          <h3>Email Support Studio</h3>
          <p className="services-body-text">
            Clear, consistent replies in your voice for repetitive questions:
            logistics, policies, links, and basic scheduling details.
          </p>
          <ul className="services-body-list">
            <li>
              Handles common questions so you don&apos;t repeat yourself all day.
            </li>
            <li>Uses tone and wording aligned with your values and boundaries.</li>
            <li>
              Flags complex or sensitive messages for you to answer personally.
            </li>
          </ul>

          <h3>Client Support &amp; FAQ Assistant</h3>
          <p className="services-body-text">
            A thoughtful support assistant trained on your FAQs, welcome emails,
            retreat guides, and program pages to answer common questions.
          </p>
          <ul className="services-body-list">
            <li>Perfect for courses, memberships, and retreats.</li>
            <li>
              Answers questions like “Where&apos;s the replay?”, “What time is
              this in my time zone?”, and “What should I bring?”.
            </li>
            <li>Reduces back-and-forth for you and your team.</li>
          </ul>

          <h3>Session Notes &amp; Summary Helper (Early Access)</h3>
          <p className="services-body-text">
            Turn your own written or spoken reflections into clear, organized
            notes and summaries to track long-term work with clients or students.
          </p>
          <ul className="services-body-list">
            <li>Highlights key themes, practices, and follow-ups.</li>
            <li>Supports continuity across sessions and programs.</li>
            <li>
              Can generate thoughtful summaries you share with clients (or keep
              private).
            </li>
          </ul>

          <h3>Live Circle &amp; Zoom Co-Pilot (Coming Soon)</h3>
          <p className="services-body-text">
            Quiet support in your live online spaces – circles, classes, and
            gatherings.
          </p>
          <ul className="services-body-list">
            <li>Answers basic logistical questions in the call chat.</li>
            <li>Shares links, reminders, and key resources during sessions.</li>
            <li>
              Tracks common questions that can feed into your FAQ and follow-ups.
            </li>
          </ul>

          <h3>Auto-Transcriptions &amp; Insight Summaries (Coming Soon)</h3>
          <p className="services-body-text">
            For recorded sessions, classes, and retreats where you want more
            than just a raw transcript.
          </p>
          <ul className="services-body-list">
            <li>Creates accurate transcriptions of your recordings.</li>
            <li>
              Generates readable summaries with themes, practices, and key
              moments.
            </li>
            <li>
              Helps you repurpose your work into future content and integration
              materials.
            </li>
          </ul>

          <h3>MWM Studio: Client Resource Library &amp; Portal (In Development)</h3>
          <p className="services-body-text">
            An organized, central home for your key materials – FAQs, policies,
            schedules, and program information.
          </p>
          <ul className="services-body-list">
            <li>Keeps your resources organized for you, your team, and clients.</li>
            <li>Supports consistency across multiple offerings.</li>
            <li>
              Designed to grow as your work and community evolve over time.
            </li>
          </ul>
        </section>

        {/* SECTION: Services by Business Type */}
        <section id="by-business-type">
          <h2>Services by Business Type</h2>
          <p className="services-body-text">
            Not everyone thinks in terms of tools. This section helps you see
            how MWM can support different kinds of businesses and organizations.
          </p>

          <h3>Solo Coaches &amp; Practitioners</h3>
          <p className="services-body-text">
            For life coaches, healers, therapists, and spiritual guides running
            their own practice (often with a small VA).
          </p>
          <ul className="services-body-list">
            <li>
              <strong>MWM Inbox Starter</strong> – Email Support Studio plus a
              simple FAQ assistant for your main offers.
            </li>
            <li>
              <strong>Client Journey Support</strong> – Email Support Studio, FAQ
              Assistant, and Session Notes &amp; Summary Helper for 1:1 work.
            </li>
            <li>
              Goal: fewer late-night emails, clearer communication, more energy
              for your sessions.
            </li>
          </ul>

          <h3>Group Programs &amp; Memberships</h3>
          <p className="services-body-text">
            For ongoing communities, circles, and group coaching containers with
            recurring questions and many moving parts.
          </p>
          <ul className="services-body-list">
            <li>
              <strong>Community Support Studio</strong> – FAQ Assistant connected
              to your course or membership materials, plus Email Support Studio
              for member questions.
            </li>
            <li>
              <strong>Launch &amp; Live Support</strong> – support flows around a
              specific launch or cohort, with optional Live Circle &amp; Zoom
              Co-Pilot when available.
            </li>
            <li>
              Goal: members feel held and informed, while you focus on
              facilitation.
            </li>
          </ul>

          <h3>Retreat Leaders &amp; Centers</h3>
          <p className="services-body-text">
            Retreats bring deep work and complex logistics – travel, packing,
            timing, and integration.
          </p>
          <ul className="services-body-list">
            <li>
              <strong>Retreat Clarity Kit</strong> – FAQ Assistant for one
              retreat plus Email Support Studio for travel and preparation
              questions.
            </li>
            <li>
              <strong>Retreat Series Support</strong> – flows across multiple
              retreats, with optional Auto-Transcriptions &amp; Session Notes
              Helper for integration.
            </li>
            <li>
              Goal: participants feel safe and clear, and you spend less time
              repeating details.
            </li>
          </ul>

          <h3>Training Programs, Schools &amp; Larger Organizations</h3>
          <p className="services-body-text">
            For organizations with multiple programs, cohorts, or locations
            needing consistent communication and support.
          </p>
          <ul className="services-body-list">
            <li>
              <strong>Multi-Program Support Studio</strong> – FAQ Assistants for
              different programs, Email Support Studio with routing rules, and
              internal documentation.
            </li>
            <li>
              <strong>Organizational Partnership</strong> – phased roadmap,
              deeper discovery with leadership, and ongoing refinement over time.
            </li>
            <li>
              Goal: reduce load on admin teams, increase clarity for
              participants, and build a support system that can grow with you.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
