// app/page.js
import Header from "../components/Header";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/Home.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
      }}
    >
      {/* Home is active => not underlined */}
      <Header active="home" />

      <main className="page-wrap">
        {/* TOP ROW: logo | headings | hero image */}
        <section className="home-grid">
          {/* logo (left) */}
          <div className="logo-left">
            <img
              src="/mwm_logo.png"
              alt="Mindfulness with Mind"
              className="logo-img"
              width={260}
              height={260}
            />
          </div>

          {/* center headings */}
          <div className="center-headings">
            <h1 className="h1-main">Mindfulness with Mind</h1>
            <h2 className="h2-sub">
              Thoughtful AI Automation
              <br />
              for Conscious Businesses
            </h2>
          </div>

          {/* hero image (right) */}
          <div className="hero-right">
            <img
              src="/AIwith%20Meditation.jpg"
              alt="AI with Meditation artwork"
              className="hero-img"
              width={420}
              height={420}
            />
          </div>
        </section>

        {/* body copy */}
        <section className="body-copy">
          <p>Thoughtful AI automation agents for conscious businesses.</p>
          <p>
            Free yourself and your team to focus on the real work—while your
            AI agents care for repetitive email, FAQs, and logistics.
          </p>
          <p>
            We design each agent specifically for life coaches, spiritual
            teachers, retreat leaders, and conscious organizations, using your
            materials, your tone, and your boundaries so your clients feel held,
            not handled.
          </p>
          <p>
            We intentionally design for conscious communities and train every
            agent to respond with clarity, warmth, and compassion.
          </p>
        </section>
      </main>
    </div>
  );
}
