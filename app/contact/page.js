// app/contact/page.js
import Header from "../../components/Header";

export default function ContactPage() {
  const BG = "/Contact%20Us.png"; // your Contact background

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
        color: "#fff",
      }}
    >
      {/* Contact active => not underlined */}
      <Header active="contact" />

      <main className="contact-wrap">
        <section className="contact-grid">
          <h1 className="contact-title">Contact Us</h1>

          <div className="contact-info">
            <h2 className="contact-h">Phone</h2>
            <p className="contact-p">
              <a className="contact-link" href="tel:+19176644956">+1 917-664-4956</a>
            </p>

            <h2 className="contact-h">Email</h2>
            <p className="contact-p">
              <a
                className="contact-link"
                href="mailto:mindfulnesswithmind@gmail.com"
              >
                mindfulnesswithmind@gmail.com
              </a>
            </p>

            <h2 className="contact-h">Social</h2>
            <div className="contact-social">
              {/* Facebook icon */}
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24">
                  <path d="M15 8h-2a2 2 0 0 0-2 2v2h-2v3h2v7h3v-7h2.3l.7-3H14v-1c0-.3.2-1 1-1h2V8z" />
                </svg>
              </a>
              {/* Instagram icon */}
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1.2" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
