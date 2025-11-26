// app/customization/page.js
import Header from "../../components/Header";

const BG_SRC = "/Customization.png";

export default function CustomizationPage() {
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
      <Header active="customization" />

      <main className="custom-wrap">
        {/* INTRO + JUMP LINKS */}
        <section>
          <h1 className="custom-title">Custom Solutions &amp; How We Work</h1>

          <p className="custom-p">
            No two conscious businesses are the same. Your support shouldn&apos;t
            be either.
          </p>
          <p className="custom-p">
            Mindfulness With Mind doesn&apos;t drop a generic system on top of your
            work. We co-design reflective support that matches the way you
            teach, coach, hold space, and run your business.
          </p>

          {/* Links styled EXACTLY like Services page links */}
          <h3 className="services-link-heading">
            <a href="#custom-why">Why Customization Matters</a>
          </h3>
          <h3 className="services-link-heading">
            <a href="#custom-process">Our Process</a>
          </h3>
          <h3 className="services-link-heading">
            <a href="#custom-what">What We Customize</a>
          </h3>
          <h3 className="services-link-heading">
            <a href="#custom-solo-orgs">Solo &amp; Organizations</a>
          </h3>
          <h3 className="services-link-heading">
            <a href="#custom-talk">Talk About Your Practice</a>
          </h3>
        </section>

        {/* SECTIONS */}
        <section id="custom-why" className="custom-section">
          <h2 className="custom-h">Why Customization Matters</h2>
          <p className="custom-p">
            Your work is personal. The way you communicate, set boundaries, and
            care for people is part of your medicine.
          </p>
          <p className="custom-p">
            That&apos;s why we don&apos;t just plug in a generic template. We design
            reflective support that honors the energetics of your work, not just
            the logistics.
          </p>

          <h3 className="custom-h">What We Pay Attention To</h3>
          <ul className="services-body-list">
            <li>
              Tone – your actual voice, not generic &quot;polite support.&quot;
            </li>
            <li>
              Boundaries – what your systems never say, promise, or assume on
              your behalf.
            </li>
            <li>
              Nervous system load – what feels like support vs. what feels like
              pressure.
            </li>
            <li>
              Stage of business – what you actually need now, not &quot;someday
              complexity.&quot;
            </li>
          </ul>

          <h3 className="custom-h">The Intention Behind It</h3>
          <ul className="services-body-list">
            <li>Your values show up in every interaction.</li>
            <li>
              Your clients, students, and guests feel held and respected by how
              your systems respond.
            </li>
            <li>
              Your systems actually lighten your load instead of adding more
              noise.
            </li>
          </ul>
        </section>

        <section id="custom-process" className="custom-section">
          <h2 className="custom-h">Our Process</h2>
          <p className="custom-p">
            Customization doesn&apos;t have to be overwhelming. We move in clear,
            gentle steps so you always know what&apos;s happening and why.
          </p>

          <h3 className="custom-h">1. Listen &amp; Map</h3>
          <p className="custom-p">
            We start with a conversation about your work, your people, and your
            current systems. We map what&apos;s already working – and what&apos;s draining
            you.
          </p>

          <h3 className="custom-h">2. Design a First Layer</h3>
          <p className="custom-p">
            We propose a simple, focused starting layer of support – often
            around email, FAQs, or a specific program or retreat.
          </p>

          <h3 className="custom-h">3. Build &amp; Train</h3>
          <p className="custom-p">
            We train your AI support on your materials, your tone, and your
            boundaries. You&apos;ll see (and can edit) examples of how it responds.
          </p>

          <h3 className="custom-h">4. Refine with Real Use</h3>
          <p className="custom-p">
            Once live, we look at real interactions to refine the system:
            tightening responses, adding clarifications, and adjusting flows as
            needed.
          </p>

          <h3 className="custom-h">5. Grow When You&apos;re Ready</h3>
          <p className="custom-p">
            From there, we can expand into additional services – live support,
            transcriptions, or resource libraries – at a pace that feels right
            for you and your team.
          </p>
        </section>

        <section id="custom-what" className="custom-section">
          <h2 className="custom-h">What We Customize</h2>
          <p className="custom-p">
            We don&apos;t just turn on tools. We shape how those tools behave in
            your ecosystem – what they say, when they respond, and where they
            hand things back to you.
          </p>

          <ul className="services-body-list">
            <li>
              <strong>Language &amp; Tone:</strong> wording, pacing, and energy
              that feel like you.
            </li>
            <li>
              <strong>Boundaries &amp; Policies:</strong> refunds, reschedules,
              access, and expectations.
            </li>
            <li>
              <strong>Flows &amp; Journeys:</strong> how someone moves from
              first contact to working with you, and how they&apos;re supported
              along the way.
            </li>
            <li>
              <strong>Team Hand-offs:</strong> where AI steps back and a human
              steps in.
            </li>
          </ul>
        </section>

        <section id="custom-solo-orgs" className="custom-section">
          <h2 className="custom-h">Solo &amp; Organizations</h2>
          <p className="custom-p">
            We work with a range of conscious businesses: from solo
            practitioners to training organizations and retreat centers.
          </p>

          <h3 className="custom-h">For Solo Practitioners</h3>
          <p className="custom-p">
            We keep things light and focused. One or two supportive workflows
            that genuinely reduce your load – not a whole new job managing
            systems.
          </p>

          <h3 className="custom-h">For Teams &amp; Schools</h3>
          <p className="custom-p">
            We design support that works across multiple people, roles, and
            programs – with clear documentation so your team knows what the
            system is doing on their behalf.
          </p>
        </section>

        <section id="custom-talk" className="custom-section">
          <h2 className="custom-h">Talk About Your Practice</h2>
          <p className="custom-p">
            If you&apos;re curious but unsure how this would look in your world, that&apos;s
            a perfect place to start.
          </p>
          <p className="custom-p">
            We can walk through your current reality – your inbox, your
            programs, your retreats, your team – and explore where thoughtful
            AI support could help you without diluting the heart of your work.
          </p>
          <p className="custom-p">
            From there, we&apos;ll suggest a first layer of support and a gentle path
            forward. No pressure, no hard sell – just clarity.
          </p>
        </section>
      </main>
    </div>
  );
}
