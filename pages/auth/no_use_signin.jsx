// pages/auth/signin.jsx
import { getProviders, getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return { props: { providers: providers ?? {}, csrfToken: csrfToken ?? null } };
}

export default function SignIn({ providers, csrfToken }) {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || "/admin";
  const lastError = router.query.error;

  return (
    <main style={{ maxWidth: 420, margin: "4rem auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Sign in</h1>

      {router.query.email && (
        <p style={{ marginBottom: 10 }}>
          Check your email <strong>{router.query.email}</strong> for a magic link.
        </p>
      )}
      {lastError && (
        <p style={{ color: "crimson", marginBottom: 10 }}>
          Sign-in error: {lastError}
        </p>
      )}

      {/* EMAIL (native NextAuth form with CSRF) */}
      {providers?.email && (
        <form
          method="post"
          action="/api/auth/signin/email"
          style={{ marginBottom: 24 }}
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken || ""} />
          <input name="callbackUrl" type="hidden" defaultValue={callbackUrl} />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            style={{
              display: "block",
              width: "100%",
              padding: 10,
              marginTop: 6,
              marginBottom: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
            }}
          />
          <button type="submit" style={{ padding: "10px 14px", borderRadius: 8 }}>
            Send magic link
          </button>
        </form>
      )}

      {/* GOOGLE (optional) */}
      {providers?.google && (
        <div style={{ marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            style={{ padding: "10px 14px", borderRadius: 8 }}
          >
            Continue with Google
          </button>
        </div>
      )}
    </main>
  );
}
