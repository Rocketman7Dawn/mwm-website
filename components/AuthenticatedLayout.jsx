// components/AuthenticatedLayout.jsx

import Header from "./Header";

const AUTH_BG = "/authenticatedpages.png"; // in /public

export default function AuthenticatedLayout({ active, children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${AUTH_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
      }}
    >
      {/* Same top nav as the rest of the site */}
      <Header active={active} />

      {/* Centered content card */}
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 text-slate-100">
        <div className="rounded-3xl bg-black/70 p-6 shadow-2xl ring-1 ring-white/10 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
