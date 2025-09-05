// app/services/page.js
import Header from "../../components/Header";

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
        <section className="services-grid">
          <div>
            <h1 className="services-title">What Services do we offer?</h1>
            <ul className="services-list">
              <li>Automated Email Response</li>
              <li>Live Meeting Automated Chat Response</li>
              <li>Website Chat Automation</li>
              <li>Customized Automation Projects</li>
            </ul>
          </div>

          {/* bottom-right image */}
          <div className="services-right">
            <img
              src="/AIwithRedDots.jpg"
              alt="AI with Red Dots"
              className="services-hero"
              width={360}
              height={360}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
