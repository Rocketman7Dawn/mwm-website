// app/api/zoom/oauth/start/route.js

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function GET(request) {
  const url = new URL(request.url);
  const clientIdFromQuery = url.searchParams.get("clientId");

  const session = await getServerSession(authOptions);

  const clientId = clientIdFromQuery || session?.user?.clientId || null;

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing clientId for Zoom connect." },
      { status: 400 }
    );
  }

  const zoomClientId = process.env.ZOOM_OAUTH_CLIENT_ID;
  const redirectUri = process.env.ZOOM_OAUTH_REDIRECT_URL;

  if (!zoomClientId || !redirectUri) {
    return NextResponse.json(
      { error: "Zoom OAuth not configured on server." },
      { status: 500 }
    );
  }

  const zoomAuthUrl = new URL("https://zoom.us/oauth/authorize");
  zoomAuthUrl.searchParams.set("response_type", "code");
  zoomAuthUrl.searchParams.set("client_id", zoomClientId);
  zoomAuthUrl.searchParams.set("redirect_uri", redirectUri);
  zoomAuthUrl.searchParams.set("state", clientId); // 🔹 generic: any client UUID

  return NextResponse.redirect(zoomAuthUrl.toString());
}
