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
          <div>
            <h1 className="h1-main">Mindfulness with Mind</h1>
            <h2 className="h2-sub">
              AI Automation for the
              <br />
              Conscious
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
          <p>Highly personalized AI Automation agents</p>
          <p>
            Free up yourself and your staff so that you can dive deeply into
            coaching, supporting and elevating your clients!
          </p>
          <p>
            Do what you do best while we support your clients in the best way
            possible.
          </p>
          <p>
            We intentionally design for conscious communities and have trained
            our AI Agents to respond to your clients’ needs with warmth and
            compassion.
          </p>
        </section>
      </main>
    </div>
  );
}
