// components/Header.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { href: "/", label: "Home", key: "home" },
  { href: "/services", label: "Services", key: "services" },
  { href: "/customization", label: "Customization", key: "customization" },
  { href: "/about", label: "About", key: "about" },
  { href: "/contact", label: "Contact Us", key: "contact" },
  { href: "/auth/signin", label: "Client Login", key: "login" },
];

export default function Header({ active = "" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Lock page scroll when the mobile menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isActive = (href, key) => {
    if (active) return active === key;                  // optional prop
    if (!pathname) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[2000] pointer-events-auto">
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.35))",
          backdropFilter: "blur(6px)",
        }}
      >
        <nav aria-label="Main navigation" className="navbar">
          {/* Desktop: single centered row */}
          <ul className="nav-list">
            {items.map(({ href, label, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`navlink navlg${isActive(href, key) ? " active" : ""}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile: hamburger (shown via CSS at ≤1024px) */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open ? "true" : "false"}
            className="header-mobile-btn"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </div>

      {/* Mobile slide-down panel */}
      {open && (
        <div className="header-mobile-panel">
          <ul>
            {items.map(({ href, label, key }) => (
              <li key={`m-${href}`}>
                <Link
                  href={href}
                  className={`navlink navlg${isActive(href, key) ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
