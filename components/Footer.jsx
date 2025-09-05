// ==========================
// components/Footer.jsx (place in /components/Footer.jsx)
// ==========================
export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-white/60 text-sm">
      © {new Date().getFullYear()} Mindfulness with Mind • All rights reserved
    </footer>
  );
}