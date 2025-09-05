// app/about/page.js
import Header from "../../components/Header";

export default function AboutPage() {
  const BG = "/About.png"; // background for About page

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
      }}
    >
      {/* "About" is active -> not underlined in the header */}
      <Header active="about" />

      <main className="about-wrap">
        <h1 className="about-title">About</h1>

        <section className="about-grid">
          {/* Card: Cid */}
          <article className="about-card">
            <div className="about-top">
              <img src="/cid.jpg" alt="Cid Isbell" className="about-photo" />
              <h2 className="about-name">Cid Isbell - Seeker</h2>
            </div>
            <p className="about-text">
              Cid has been a seeker and finder on a path to spiritual discovery
              for 30 years. He is pairing his tech expertise with his desire for
              conscious expansion into new territories.
            </p>
          </article>

          {/* Card: Cora */}
          <article className="about-card">
            <div className="about-top">
              <img
                src="/AIwithRedDots.jpg"
                alt="Inspired AI artwork"
                className="about-photo"
              />
              <h2 className="about-name">Cora - Inspired AI</h2>
            </div>
            <p className="about-text">
              Cora is our mindful AI partner—built to listen, learn, and respond
              with warmth. She blends practical automation with compassionate
              communication so your community feels supported while your work
              flows with ease.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
