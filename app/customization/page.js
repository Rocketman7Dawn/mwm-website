// app/customization/page.js
import Header from "../../components/Header";

export default function CustomizationPage() {
  const BG = "/Customization.png";

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
      <Header active="customization" />

      <main className="custom-wrap">
        <section className="custom-grid">
          {/* Left: title */}
          <h1 className="custom-title">Customization</h1>

          {/* Right: glass card */}
          <div className="custom-card">
            {/* Feature 1 */}
            <div className="custom-feature">
              {/* person icon */}
              <svg
                className="custom-icon"
                viewBox="0 0 48 48"
                width="56" height="56"             /* ✅ hard-size inline */
                fill="none"
              >
                <circle cx="24" cy="16" r="6" stroke="white" strokeWidth="2.5"/>
                <path d="M8 40c0-7.18 7.16-12 16-12s16 4.82 16 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <div>
                <h3 className="custom-h">User-friendly</h3>
                <p className="custom-p">
                  MWM can create user-friendly customization services that fit your needs to a T.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="custom-feature">
              {/* gear/sun icon */}
              <svg
                className="custom-icon"
                viewBox="0 0 48 48"
                width="56" height="56"             /* ✅ hard-size inline */
                fill="none"
              >
                <circle cx="24" cy="24" r="7" stroke="white" strokeWidth="2.5"/>
                <path d="M24 8v4M24 36v4M8 24h4M36 24h4M12 12l3 3M33 33l3 3M12 36l3-3M33 15l3-3"
                      stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <div>
                <h3 className="custom-h">Seamless integration</h3>
                <p className="custom-p">
                  We integrate with the tools you use daily and streamline your processes and workflows.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="custom-feature">
              {/* shield check */}
              <svg
                className="custom-icon"
                viewBox="0 0 48 48"
                width="56" height="56"             /* ✅ hard-size inline */
                fill="none"
              >
                <path d="M24 6l14 6v9c0 9.39-6.61 17.9-14 21-7.39-3.1-14-11.61-14-21v-9l14-6z"
                      stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M18 24l4 4 8-8" stroke="white" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <h3 className="custom-h">Secure &amp; safe</h3>
                <p className="custom-p">
                  We use industry-standard security practices to protect you and your clients’ data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
