// -----------------------------
// app/login/page.tsx
// -----------------------------
import { H2, PageShell, Paragraph } from "@/components/UI";
export default function Page() {
return (
<PageShell bg="/Client Login.png">
<section className="pt-12 md:pt-20">
<H2>Client Login</H2>
<div className="mt-10 max-w-2xl">
<label className="block text-lg md:text-xl mb-2">Email Address</label>
<input type="email" placeholder="you@example.com" className="w-full rounded-xl bg-white/90 text-black px-4 py-3 text-lg shadow-lg placeholder:text-neutral-500 focus:outline-none focus:ring-4 focus:ring-white/40" />
<div className="mt-6">
<button className="rounded-xl px-5 py-3 text-lg font-semibold shadow-xl transition-all hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(8px)" }}>
Login with your Google Account
</button>
</div>
<Paragraph className="mt-6 opacity-90">Private and secure. Need help? We’ll get you in.</Paragraph>
</div>
</section>
</PageShell>
);
}