// components/Header.jsx
import Link from "next/link";

export default function Header({ active = "" }) {
  const baseLinkStyle = {
    color: "#fff",
    fontSize: 28,
    fontWeight: 400,
    fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
    textUnderlineOffset: "6px",
    textDecorationThickness: "3px",
  };

  const linkStyle = (name) =>
    name === active
      ? { ...baseLinkStyle, textDecoration: "none" } // active page: no underline
      : { ...baseLinkStyle, textDecoration: "underline" };

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
      {/* lighter neutral-black glass bar */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0.18))",
          backdropFilter: "blur(6px)",
        }}
      >
     
          <nav
            style={{
              width: "min(98vw, 1600px)",   // was maxWidth: 1200
              margin: "0 auto",
              height: 64,
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >

          {/* left links */}
          <ul
            style={{
              display: "flex",
              gap: 28,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li><Link href="/" style={linkStyle("home")}>Home</Link></li>
            <li><Link href="/services" style={linkStyle("services")}>Services</Link></li>
            <li><Link href="/customization" style={linkStyle("customization")}>Customization</Link></li>
            <li><Link href="/about" style={linkStyle("about")}>About</Link></li>
          </ul>

          {/* right links */}
          <ul
            style={{
              display: "flex",
              gap: 28,
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            <li><Link href="/contact" style={linkStyle("contact")}>Contact Us</Link></li>
            <li><Link href="/auth/signin" style={linkStyle("client")}>Client Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
