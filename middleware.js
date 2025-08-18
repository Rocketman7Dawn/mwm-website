// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/auth/signin" },

  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname || "";
      const isAdminRoute = path.startsWith("/admin");
      const isClientRoute = path.startsWith("/clients");

      // Require login for any protected route
      if (!token && (isAdminRoute || isClientRoute)) return false;

      // Admin allowlist (optional)
      if (isAdminRoute) {
        const allowed = (process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean);

        // If no allowlist configured, any authenticated user is allowed
        if (allowed.length === 0) return true;

        const userEmail = (token?.email || "").toLowerCase();
        return allowed.includes(userEmail);
      }

      // Clients routes only require authentication
      if (isClientRoute) return true;

      // Anything else (not matched) — allow
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*", "/clients/:path*"],
};
