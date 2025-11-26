"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Header from "../../../components/Header";

const BG_SRC = "/Client%20Login.png"; // uses "Client Login.png" from /public

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  // preserve callbackUrl from ?callbackUrl=/clients/mwp etc.
  const callbackUrl = searchParams?.get("callbackUrl") || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl,
      });
    } finally {
      setLoading(false);
    }
  }

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
      {/* top nav, same as rest of site */}
      <Header active="login" />

      <main className="login-wrap">
        <div className="login-positioner">
          {/* Title */}
          <div className="login-title--grid">
            <h1 className="login-title">Client Login</h1>
          </div>

          {/* Login card */}
          <div className="login-card">
            <p
              className="contact-p"
              style={{ marginTop: 0, marginBottom: 16 }}
            >
              Sign in with your client email and password to access your
              project space.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="login-emailRow">
                <label className="login-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-emailRow">
                <label className="login-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
                style={{ marginTop: 12 }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p
              className="contact-p"
              style={{ marginTop: 18, fontSize: "0.9rem", opacity: 0.9 }}
            >
              Having trouble signing in? Reach out to{" "}
              <a
                href="mailto:cid@mindfulnesswithmind.com"
                className="contact-link"
              >
                cid@mindfulnesswithmind.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
