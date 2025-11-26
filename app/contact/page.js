// app/contact/page.js
import Header from "../../components/Header";

// Use the same background as Services / Customization
const BG_SRC = "/Customization.png";

export default function ContactPage() {
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
      <Header active="contact" />

      <main className="contact-wrap">
        <h1 className="contact-title">Contact Us</h1>

        <section className="contact-grid">
          {/* Left: image */}
          <div>
            <img
              src="/contact2.jpg"
              alt="Human and AI hands reaching toward each other"
              style={{
                width: "100%",
                maxWidth: "480px",
                borderRadius: "10px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            />
          </div>

          {/* Right: contact details */}
          <div className="contact-info">
            <h2 className="contact-h">Phone</h2>
            <p className="contact-p">
              <a href="tel:+19176644956" className="contact-link">
                +1 917-664-4956
              </a>
            </p>

            <h2 className="contact-h">Email</h2>
            <p className="contact-p">
              <a
                href="mailto:cid@mindfulnesswithmind.com"
                className="contact-link"
              >
                cid@mindfulnesswithmind.com
              </a>
            </p>

            <h2 className="contact-h">Social</h2>
            <div className="contact-social">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24">
                  <path
                    d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.5 1.6-1.5H16V5.1C15.8 5 15 5 14.1 5c-2.4 0-3.9 1.4-3.9 4v2.9H8v3h2.2v7h3.3z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                </svg>
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24">
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="4"
                    ry="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3.2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <circle cx="17" cy="7" r="0.9" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
