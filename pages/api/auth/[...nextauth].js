// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import Email from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const {
  NEXTAUTH_SECRET,

  EMAIL_SERVER,
  EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD,
  EMAIL_FROM,

  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,

  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,

  ENABLE_CREDENTIALS,
} = process.env;

const providers = [];

// Email (Mailgun SMTP)
if (EMAIL_SERVER || (EMAIL_SERVER_HOST && EMAIL_SERVER_USER && EMAIL_SERVER_PASSWORD)) {
  const port = Number(EMAIL_SERVER_PORT || 587);
  const secure = String(port) === "465";
  providers.push(
    Email({
      server:
        EMAIL_SERVER ||
        {
          host: EMAIL_SERVER_HOST,
          port,
          secure,
          auth: { user: EMAIL_SERVER_USER, pass: EMAIL_SERVER_PASSWORD },
        },
      from: EMAIL_FROM,
      maxAge: 10 * 60,
    })
  );
}

// Google (optional)
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    })
  );
}

// Credentials (optional; disabled until you implement authorize)
if ((ENABLE_CREDENTIALS || "").toLowerCase() === "true") {
  providers.push(
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        return null; // deny until real validation is added
      },
    })
  );
}

const useSupabaseAdapter = Boolean(SUPABASE_URL) && Boolean(SUPABASE_SERVICE_ROLE_KEY);

export default NextAuth({
  ...(useSupabaseAdapter
    ? {
        adapter: SupabaseAdapter({
          url: SUPABASE_URL,
          secret: SUPABASE_SERVICE_ROLE_KEY,
          schema: "public", // <<— important fix
        }),
      }
    : {}),
  providers,
  session: { strategy: "jwt" },
  secret: NEXTAUTH_SECRET,
  pages: { signIn: "/auth/signin" },
  debug: process.env.NODE_ENV === "development",
});
