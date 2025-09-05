// app/auth/signin/page.js
"use client";

import Header from "../../../components/Header";
import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ClientLoginPage() {
  const [providers, setProviders] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    getProviders()
      .then((p) => mounted && setProviders(p || {}))
      .catch(() => mounted && setProviders({}));
    return () => { mounted = false; };
  }, []);

  const has = (id) => providers && Object.values(providers).some(p => p.id === id);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url(/Client%20Login.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
        color: "#fff",
      }}
    >
      <Header active="login" />
      <Header active="signin" />

      <main className="login-wrap">
        <div className="login-positioner">
          <h1 className="login-title login-title--grid">Client Login</h1>

          <section className="login-card">
            {/* EMAIL (Magic Link) */}
            {has("email") && (
              <div style={{ marginBottom: 10 }}>
                <label className="login-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  className="login-input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="login-btn"
                  onClick={() => email && signIn("email", { email, redirect: true })}
                >
                  Click for magic link
                </button>
              </div>
            )}

            <div className="login-or">or</div>

            {/* OTHER PROVIDERS */}
            <div className="login-providers">
              {providers &&
                Object.values(providers)
                  .filter(p => p.id !== "email")
                  .map((p) => (
                    <button
                      key={p.id}
                      className="login-btn"
                      onClick={() => signIn(p.id, { redirect: true })}
                    >
                      Continue with {p.name}
                    </button>
                  ))}

              {/* Fallback if no providers are exposed */}
              {providers && Object.keys(providers).length === 0 && (
                <a className="login-btn" href="/api/auth/signin">
                  Continue to Sign In
                </a>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
