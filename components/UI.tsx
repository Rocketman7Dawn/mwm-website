// -----------------------------
return <p className={`text-lg md:text-xl leading-relaxed ${className}`}>{children}</p>;
}


export function CTA({ className = "" }: { className?: string }) {
return (
<Link
href="/contact"
className={`inline-block rounded-2xl px-6 py-3 text-lg font-semibold shadow-xl transition-all hover:scale-[1.02] ${className}`}
style={{
background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))",
border: "1px solid rgba(255,255,255,0.35)",
backdropFilter: "blur(8px)",
}}
>
Use us to make your business more efficient
</Link>
);
}


export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
return (
<div
className={`rounded-3xl p-6 md:p-10 shadow-2xl ${className}`}
style={{
background: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
border: "1px solid rgba(255,255,255,0.35)",
backdropFilter: "blur(10px)",
}}
>
{children}
</div>
);
}


export function Bullet({ children }: { children: React.ReactNode }) {
return (
<li className="flex items-start gap-3 text-xl md:text-2xl leading-snug">
<span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-white/90" />
<span>{children}</span>
</li>
);
}