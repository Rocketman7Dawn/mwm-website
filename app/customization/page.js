// app/customization/page.js
import Header from "../../components/Header";

export const metadata = {
  title: "Customization | Mindfulness with Mind",
  description:
    "User-friendly, seamless integrations, and secure customization services tailored to your needs.",
};

export default function CustomizationPage() {
  const BG = "/Customization.png"; // your Contact background
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
      {/* Fixed, full-viewport background behind everything */}
      <div className="page-bg pointer-events-none">
        <img src="/Customization.png" alt="" className="w-full h-full object-cover" draggable="false" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Header */}
      <Header active="customization" />

      {/* Content */}
      <main className="mx-auto w-full max-w-[1600px] px-6 md:px-10 pt-[84px] md:pt-[96px] pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <h1 className="leading-tight drop-shadow-lg text-[36px] md:text-[48px] lg:text-[56px]">
            Customization
          </h1>

          <div
            className="rounded-[28px] border border-white/40 bg-white/10 backdrop-blur-md shadow-2xl p-6 md:p-8"
            style={{ width: "min(100%, 1000px)", marginInline: "auto" }}
          >
            <div className="space-y-10">
              {/* Item 1 */}
              <div className="grid items-start gap-3 md:gap-4 grid-cols-[42px_1fr] md:grid-cols-[48px_1fr]">
                <svg
                  className="w-[42px] h-[42px] md:w-12 md:h-12 text-white/90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="7.5" r="3.25" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
                <div>
                  <h3 className="text-2xl md:text-[26px] leading-snug mb-2">User-friendly</h3>
                  <p className="text-white/90 leading-relaxed break-words hyphens-auto">
                    MWM can create user-friendly customization services that fit your needs to a T.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="grid items-start gap-3 md:gap-4 grid-cols-[42px_1fr] md:grid-cols-[48px_1fr]">
                <svg
                  className="w-[42px] h-[42px] md:w-12 md:h-12 text-white/90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                  <circle cx="12" cy="12" r="3.5" />
                </svg>
                <div>
                  <h3 className="text-2xl md:text-[26px] leading-snug mb-2">Seamless integration</h3>
                  <p className="text-white/90 leading-relaxed break-words hyphens-auto">
                    We integrate with the tools you use daily and streamline your processes and workflows.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="grid items-start gap-3 md:gap-4 grid-cols-[42px_1fr] md:grid-cols-[48px_1fr]">
                <svg
                  className="w-[42px] h-[42px] md:w-12 md:h-12 text-white/90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
                  <path d="M9.5 12.5l1.8 1.8 3.2-3.6" />
                </svg>
                <div>
                  <h3 className="text-2xl md:text-[26px] leading-snug mb-2">Secure &amp; safe</h3>
                  <p className="text-white/90 leading-relaxed break-words hyphens-auto">
                    We use industry-standard security practices to protect you and your clients’ data.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* /Glass card */}
        </div>
      </main>
    </div>
  );
}
