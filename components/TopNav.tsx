// -----------------------------
// components/TopNav.tsx
// -----------------------------
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


const nav = [
{ href: "/", label: "Home" },
{ href: "/services", label: "Services" },
{ href: "/customization", label: "Customization" },
{ href: "/about", label: "About" },
{ href: "/contact", label: "Contact Us" },
{ href: "/login", label: "Client Login" },
];


export default function TopNav() {
const pathname = usePathname();
return (
<header className="sticky top-0 z-50">
<div
className="w-full"
style={{
background: "linear-gradient(90deg, rgba(49,34,21,0.9), rgba(10,10,12,0.95))",
boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
}}
>
<div className="mx-auto flex max-w-7xl items-center gap-6 px-6 md:px-10 py-4">
{/* Optional logo */}
{/* <img src="/logo.png" alt="MWM" className="h-10 w-auto opacity-90" /> */}
<nav className="flex flex-1 items-center gap-6 md:gap-10 overflow-x-auto">
{nav.map(({ href, label }) => {
const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
return (
<Link
key={href}
href={href}
className={`whitespace-nowrap text-lg md:text-2xl font-semibold tracking-wide transition-colors ${
active ? "text-white" : "text-neutral-200 hover:text-white"
}`}
style={{ fontFamily: "Cinzel, serif" }}
>
{label}
</Link>
);
})}
</nav>
</div>
</div>
</header>
);
}