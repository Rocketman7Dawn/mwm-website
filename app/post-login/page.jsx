            // app/post-login/page.jsx
            import { redirect } from "next/navigation";
            import { getServerSession } from "next-auth";
            import { authOptions } from "@/pages/api/auth/[...nextauth]";

            export default async function PostLoginPage() {
              const session = await getServerSession(authOptions);

              // Not logged in → go to sign in
              if (!session?.user) {
                redirect("/auth/signin");
              }

              const { isMwmAdmin, clientId } = session.user;

              // Global MWM admin → admin dashboard
              if (isMwmAdmin) {
                redirect("/admin");
              }

              // Client admin → their client dashboard (UUID)
              if (clientId) {
                redirect(`/clients/${clientId}`);
              }

              // Fallback: no role / no clientId
              return (
                <main style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "system-ui" }}>
                  <h1>Post-login routing error</h1>
                  <p>We couldn&apos;t determine where to send you.</p>
                  <pre>{JSON.stringify(session.user, null, 2)}</pre>
                </main>
              );
            }
