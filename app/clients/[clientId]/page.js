// app/clients/[clientId]/page.js
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { createClient } from "@supabase/supabase-js";
import LogoutButton from "@/components/LogoutButton";

export default async function ClientDashboard({ params, searchParams }) {
  const { clientId } = params || {}; // UUID of the client
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
      <main style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "system-ui" }}>
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

  // Fetch client record (to get client name)
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("id, name")
      .eq("id", clientId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching client:", error);
      clientError = error.message;
    } else {
      client = data || null;
    }
  } catch (err) {
    console.error("Unexpected error fetching client:", err);
    clientError = "Unexpected error loading client.";
  }

  // Fetch services for this client from the new view
  try {
    const { data, error } = await supabase
      .from("client_services_view")
      .select("id, service_name, service_key, status")
      .eq("client_id", clientId);

    if (error) {
      console.error("Error fetching client services:", error);
      servicesError = error.message;
    } else {
      services = data || [];
    }
  } catch (err) {
    console.error("Unexpected error fetching client services:", err);
    servicesError = "Unexpected error loading services.";
  }

  // Fetch zoom connection for this client
  try {
    const { data, error } = await supabase
      .from("zoom_connections")
      .select("id, token_expires_at")
      .eq("client_id", clientId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching zoom connection:", error);
      zoomConnectionError = error.message;
    } else {
      zoomConnection = data || null;
    }
  } catch (err) {
    console.error("Unexpected error fetching zoom connection:", err);
    zoomConnectionError = "Unexpected error loading zoom connection.";
  }

  const isZoomConnected = !!zoomConnection;
  const clientName = client?.name || clientId; // fallback to UUID if name missing

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        fontFamily: "system-ui",
        color: "#ffffff",
      }}
    >
      {/* Header with client name, user, and logout */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>
            Services for Client {clientName}
          </h1>
          {clientError && (
            <p style={{ color: "#ff8a80", marginBottom: "0.25rem" }}>
              Error loading client info.
            </p>
          )}
          <p style={{ opacity: 0.8 }}>
            Signed in as <strong>{session.user.email}</strong>
          </p>
        </div>

        <LogoutButton />
      </header>

      {/* Zoom status message from callback */}
      {zoomStatus === "connected" && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "0.75rem",
            borderRadius: 6,
            background: "#d4f8d0",
            border: "1px solid #2e7d32",
            fontSize: "0.9rem",
            color: "#1b5e20",
            fontWeight: 600,
          }}
        >
          Zoom is connected for this client ✅
        </div>
      )}

      {zoomStatus && zoomStatus !== "connected" && (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "0.75rem",
            borderRadius: 6,
            background: "#ffe0e0",
            border: "1px solid #f44336",
            fontSize: "0.9rem",
            color: "#b71c1c",
            fontWeight: 600,
          }}
        >
          Zoom connection status: <strong>{zoomStatus}</strong>
        </div>
      )}

      {/* Zoom connection banner / button */}
      {isZoomConnected ? (
        <div
          style={{
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            borderRadius: 6,
            background: "#d4f8d0",
            border: "1px solid #2e7d32",
            fontSize: "0.9rem",
            color: "#1b5e20",
            fontWeight: 600,
          }}
        >
          Zoom is connected for this client ✅
        </div>
      ) : (
        <div style={{ marginBottom: "1.25rem" }}>
          <p style={{ marginBottom: "0.5rem" }}>
            Zoom is not yet connected for this client.
          </p>
          <a
            href={`/api/zoom/oauth/start?clientId=${clientId}`}
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              borderRadius: 999,
              border: "1px solid #4fc3f7",
              background: "#29b6f6",
              color: "#000000",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            Connect Zoom
          </a>
        </div>
      )}

      {zoomConnectionError && (
        <p style={{ color: "#ff8a80", marginBottom: "1rem" }}>
          Error loading Zoom connection info.
        </p>
      )}

      {/* Services section */}
      {servicesError ? (
        <p style={{ color: "#ff8a80" }}>Error loading services.</p>
      ) : !services || services.length === 0 ? (
        <p>No services found for this client.</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id} style={{ marginBottom: 8 }}>
              <strong>{service.service_name || "Service"}</strong>
              <br />
              Status: {service.status || "unknown"}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
