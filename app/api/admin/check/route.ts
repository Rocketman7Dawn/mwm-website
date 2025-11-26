// app/api/admin/check/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function GET() {
  // 1) Get the current NextAuth session using the same config as pages/api/auth
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, reason: "not_logged_in" },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json(
      { ok: false, reason: "server_misconfigured" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase
    .from("client_users")
    .select("is_admin")
    .eq("email", session.user.email)
    .maybeSingle();

  if (error) {
    console.error("Supabase error in /api/admin/check:", error);
    return NextResponse.json(
      { ok: false, reason: "db_error" },
      { status: 500 }
    );
  }

  if (!data?.is_admin) {
    return NextResponse.json(
      { ok: false, reason: "not_admin" },
      { status: 403 }
    );
  }

  return NextResponse.json({ ok: true });
}
