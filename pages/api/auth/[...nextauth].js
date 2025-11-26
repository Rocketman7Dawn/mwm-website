// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

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

  NEXT_PUBLIC_SUPABASE_ANON_KEY, // used for Supabase Auth from frontend
  ENABLE_CREDENTIALS,
} = process.env;

/** Build providers dynamically from env */
const providers = [];

/**
 * Optional Email magic-link provider
 */
if (
  EMAIL_SERVER ||
  (EMAIL_SERVER_HOST && EMAIL_SERVER_USER && EMAIL_SERVER_PASSWORD)
) {
  const port = Number(EMAIL_SERVER_PORT || 587);
  const secure = String(port) === "465";

  providers.push(
    EmailProvider({
      server:
        EMAIL_SERVER || {
          host: EMAIL_SERVER_HOST,
          port,
          secure,
          auth: { user: EMAIL_SERVER_USER, pass: EMAIL_SERVER_PASSWORD },
        },
      from: EMAIL_FROM,
      maxAge: 10 * 60, // 10 minutes
    })
  );
}

/**
 * Optional Google OAuth
 */
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    })
  );
}

/**
 * Credentials (email + password via Supabase Auth)
 */
if ((ENABLE_CREDENTIALS || "").toLowerCase() === "true") {
  providers.push(
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email ?? "";
        const password = credentials?.password ?? "";

        if (!email || !password) return null;

        if (!SUPABASE_URL || !NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.error(
            "Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
          );
          return null;
        }

        // This client uses the anon key because we're calling Supabase Auth,
        // which is safe with anon key on the server.
        const supabase = createClient(
          SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data?.user) {
          console.error("Supabase auth error:", error);
          return null;
        }

        // We return minimal info here; role info is fetched in the jwt callback.
        return {
          id: data.user.id,
          email: data.user.email,
        };
      },
    })
  );
}

const useSupabaseAdapter =
  Boolean(SUPABASE_URL) && Boolean(SUPABASE_SERVICE_ROLE_KEY);

/**
 * Exported authOptions so App Router / API routes can reuse it
 */
export const authOptions = {
  ...(useSupabaseAdapter
    ? {
        adapter: SupabaseAdapter({
          url: SUPABASE_URL,
          secret: SUPABASE_SERVICE_ROLE_KEY,
          schema: "public",
        }),
      }
    : {}),
  providers,
  session: { strategy: "jwt" },
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",

  callbacks: {
    /**
     * Runs whenever a JWT is created/updated.
     * Here we look up the user in `client_users` and attach:
     *  - isAdmin      (client-level admin)
     *  - isMwmAdmin   (global MWM admin)
     *  - clientId     (which client they are admin for)
     */
    async jwt({ token, user }) {
      // We only need to do the DB lookup once per session (when we don't have client info yet)
      if (!token.clientId && (user?.email || token.email)) {
        const email = user?.email || token.email;

        if (email && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
          // Service role key is safe here (this code only runs on the server)
          const supabaseAdmin = createClient(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY
          );

          const { data, error } = await supabaseAdmin
            .from("client_users")
            .select("is_admin, is_mwm_admin, client_id")
            .eq("email", email)
            .single();

          if (error) {
            console.error("Error loading client_users role info:", error);
          }

          if (data) {
            token.isAdmin = !!data.is_admin;
            token.isMwmAdmin = !!data.is_mwm_admin;
            token.clientId = data.client_id || null;
          } else {
            // If no client_users row is found, default everything off
            token.isAdmin = false;
            token.isMwmAdmin = false;
            token.clientId = null;
          }
        }
      }

      return token;
    },

    /**
     * Controls what ends up in `session`.
     * This is what you'll see in getServerSession() and useSession().
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin ?? false;
        session.user.isMwmAdmin = token.isMwmAdmin ?? false;
        session.user.clientId = token.clientId ?? null;
      }
      return session;
    },
  },
};

/**
 * Default NextAuth handler – Pages Router API entrypoint
 */
export default function authHandler(req, res) {
  return NextAuth(req, res, authOptions);
}
