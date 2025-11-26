// app/clients/[clientId]/page.js

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { createClient } from "@supabase/supabase-js";
import AuthenticatedLayout from "../../../components/AuthenticatedLayout";

export default async function ClientDashboard(props) {
  // Next 15: params/searchParams are async
  const params = await props.params;
  const searchParams = await props.searchParams;

  const { clientId } = params; // slug, e.g. "mwp"
  const zoomStatus = searchParams?.zoom || null;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect(`/auth/signin?callbackUrl=/clients/${clientId}`);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return (
      <main
        style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "system-ui" }}
      >
        <h1>Client Dashboard</h1>
        <p>Server config error – Supabase URL or key missing.</p>
      </main>
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  let client = null;
  let clientError = null;
  let services = [];
  let servicesError = null;
  let zoomConnection = null;
  let zoomConnectionError = null;

  // 1) Load client by slug (e.g. "mwp")
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("slug", clientId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching client:", error);
      clientError = error.message;
    } else {
      client = data;
    }
  } catch (err) {
    console.error("Unexpected error fetching client:", err);
    clientError = "Unexpected error loading client.";
  }

  const clientUuid = client?.id; // uuid from DB

  // 2) Load services for this client (uuid)
  if (clientUuid) {
    try {
      const { data, error } = await supabase
        .from("client_services_view")
        .select("*")
        .eq("client_id", clientUuid);

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching client services:", error);
        servicesError = error.message;
      } else {
        services = data || [];
      }
    } catch (err) {
      console.error("Error fetching client services:", err);
      servicesError = "Unexpected error loading services.";
    }

    // 3) Load Zoom connection (uuid)
    try {
      const { data, error } = await supabase
        .from("zoom_connections")
        .select("*")
        .eq("client_id", clientUuid)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching zoom connection:", error);
        zoomConnectionError = error.message;
      } else {
        zoomConnection = data;
      }
    } catch (err) {
      console.error("Error fetching zoom connection:", err);
      zoomConnectionError = "Unexpected error loading Zoom connection.";
    }
  }

  const clientName = client?.name || "Client";

  // --- STYLES ---
  const cardStyle = {
    maxWidth: "960px",
    margin: "2.5rem auto",
    padding: "1.75rem 2rem",
    borderRadius: "18px",
    background: "rgba(0, 0, 0, 0.65)",
    color: "#f9fafb",
    fontFamily: 'var(--font-yeseva, "Yeseva One", serif)',
  };

  const headerRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  };

  const zoomCardStyle = {
    borderRadius: "14px",
    background: "rgba(15, 23, 42, 0.9)",
    padding: "1.25rem 1.5rem",
    marginBottom: "1.25rem",
  };

  const servicesCardStyle = {
    borderRadius: "14px",
    background: "rgba(15, 23, 42, 0.9)",
    padding: "1.25rem 1.5rem",
  };

  const serviceRowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 1.25rem",
    borderRadius: "999px",
    background: "rgba(15, 23, 42, 0.9)",
  };

  return (
    <AuthenticatedLayout active="clients">
      <main style={cardStyle}>
        {/* Header */}
        <header style={headerRowStyle}>
          <div>
            <h1 style={{ fontSize: "1.9rem", fontWeight: 600, margin: 0 }}>
              Welcome {clientName}
            </h1>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.9rem",
                color: "#cbd5f5",
              }}
            >
              This is your Mindfulness with Mind client dashboard.
            </p>
            {zoomStatus === "success" && (
              <p
                style={{
                  marginTop: "0.25rem",
                  fontSize: "0.75rem",
                  color: "#4ade80",
                }}
              >
                Zoom connected successfully.
              </p>
            )}
            {zoomStatus === "error" && (
              <p
                style={{
                  marginTop: "0.25rem",
                  fontSize: "0.75rem",
                  color: "#f97373",
                }}
              >
                There was an issue connecting Zoom. Please try again.
              </p>
            )}
          </div>

          {/* Log out – go to /auth/signout (no callbackUrl) */}
          <a
            href="/auth/signout"
            style={{
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.92)",
              padding: "0.35rem 1.25rem",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "#020617",
              border: "none",
              cursor: "pointer",
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            Log out
          </a>
        </header>

        {/* Error messages */}
        {clientError && (
          <p
            style={{
              marginBottom: "0.5rem",
              fontSize: "0.8rem",
              color: "#f97373",
            }}
          >
            Error loading client info.
          </p>
        )}
        {zoomConnectionError && (
          <p
            style={{
              marginBottom: "0.5rem",
              fontSize: "0.8rem",
              color: "#f97373",
            }}
          >
            Error loading Zoom connection info.
          </p>
        )}
        {servicesError && (
          <p
            style={{
              marginBottom: "0.5rem",
              fontSize: "0.8rem",
              color: "#f97373",
            }}
          >
            Error loading services.
          </p>
        )}

        {/* Zoom card */}
        <section style={zoomCardStyle}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>
            Zoom connection
          </h2>
          {zoomConnection ? (
            <p
              style={{
                marginTop: "0.4rem",
                fontSize: "0.8rem",
                color: "#e5e7eb",
              }}
            >
              Zoom is connected for this client.
            </p>
          ) : (
            <>
              <p
                style={{
                  marginTop: "0.4rem",
                  fontSize: "0.8rem",
                  color: "#e5e7eb",
                }}
              >
                Zoom is not yet connected for this client.
              </p>
              <a
                href={`/api/zoom/connect?clientId=${clientId}`}
                style={{
                  display: "inline-flex",
                  marginTop: "0.75rem",
                  borderRadius: "999px",
                  background: "#0ea5e9",
                  padding: "0.4rem 1.25rem",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "#ffffff",
                  textDecoration: "none",
                  fontFamily:
                    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                Connect Zoom
              </a>
            </>
          )}
        </section>

        {/* Services card */}
        <section style={servicesCardStyle}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>
            Services
          </h2>
          {services.length === 0 ? (
            <p
              style={{
                marginTop: "0.6rem",
                fontSize: "0.8rem",
                color: "#94a3b8",
              }}
            >
              No services configured yet for this client.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "0.75rem 0 0 0",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {services.map((svc) => (
                <li key={svc.id} style={serviceRowStyle}>
                  <span>{svc.service_name}</span>
                  <span
                    style={{
                      color: "#cbd5f5",
                      fontSize: "0.8rem",
                      fontFamily:
                        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {svc.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AuthenticatedLayout>
  );
}
