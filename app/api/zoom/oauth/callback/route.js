// app/api/zoom/oauth/callback/route.js

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token";
const ZOOM_ME_URL = "https://api.zoom.us/v2/users/me";

function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(url, key);
}

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state"); // 🔹 clientId from /start
  const error = url.searchParams.get("error");

  const baseUrl =
    (process.env.NEXTAUTH_URL || process.env.APP_BASE_URL || "")
      .replace(/\/$/, "") || `${url.protocol}//${url.host}`;

  const redirectTo = (path) => NextResponse.redirect(`${baseUrl}${path}`);

  if (error) {
    console.error("Zoom OAuth error:", error);
    // No clientId → send to generic error page
    if (!state) return redirectTo("/admin?zoom=error");
    return redirectTo(`/clients/${state}?zoom=error`);
  }

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  if (!state) {
    console.error("Zoom OAuth missing state (clientId)");
    return redirectTo("/admin?zoom=missing_state");
  }

  const clientId = state; // 🔹 generic clientId from Zoom state

  const zoomClientId = process.env.ZOOM_OAUTH_CLIENT_ID;
  const zoomClientSecret = process.env.ZOOM_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.ZOOM_OAUTH_REDIRECT_URL;

  if (!zoomClientId || !zoomClientSecret || !redirectUri) {
    console.error("Zoom OAuth env vars not configured");
    return redirectTo(`/clients/${clientId}?zoom=config_error`);
  }

  try {
    // 1) Exchange code -> tokens
    const basicAuth = Buffer.from(
      `${zoomClientId}:${zoomClientSecret}`
    ).toString("base64");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    });

    const tokenRes = await fetch(ZOOM_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error("Zoom token exchange failed:", tokenRes.status, text);
      return redirectTo(`/clients/${clientId}?zoom=token_error`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || null;
    const expiresIn = tokenData.expires_in || 3600;

    // 2) Identify Zoom user/account
    const meRes = await fetch(ZOOM_ME_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!meRes.ok) {
      const text = await meRes.text();
      console.error("Zoom /users/me failed:", meRes.status, text);
      return redirectTo(`/clients/${clientId}?zoom=me_error`);
    }

    const me = await meRes.json();
    const zoomUserId = me.id;
    const zoomAccountId = me.account_id;

    // 3) Save tokens in zoom_connections
    const supabase = getSupabaseServiceClient();
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    const { error: upsertError } = await supabase
      .from("zoom_connections")
      .upsert(
        {
          client_id: clientId,
          zoom_account_id: zoomAccountId,
          zoom_user_id: zoomUserId,
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: tokenExpiresAt,
        },
        { onConflict: "client_id" }
      );

    if (upsertError) {
      console.error("Error saving zoom connection:", upsertError);
      return redirectTo(`/clients/${clientId}?zoom=save_error`);
    }

    // 4) Success: back to this client's dashboard
    return redirectTo(`/clients/${clientId}?zoom=connected`);
  } catch (e) {
    console.error("Zoom OAuth callback exception:", e);
    return redirectTo(`/clients/${clientId}?zoom=exception`);
  }
}
