// app/post-login/page.js

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { createClient } from "@supabase/supabase-js";

export default async function PostLoginPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const email = session.user.email;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase config in post-login");
    redirect("/");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 1) Check if this user is a global admin
  const { data: userRow } = await supabase
    .from("client_users")
    .select("is_mwm_admin, client_id")
    .eq("email", email)
    .maybeSingle();

  if (userRow?.is_mwm_admin) {
    // 🔑 global admin
    redirect("/admin"); // change if your global admin path is different
  }

  // 2) Otherwise, treat as a client user and send to their client dashboard
  const clientId = userRow?.client_id;

  if (!clientId) {
    // no client tied – just drop them at home for now
    redirect("/");
  }

  // Look up client's slug
  const { data: client } = await supabase
    .from("clients")
    .select("slug")
    .eq("id", clientId)
    .single();

  const slug = client?.slug;

  if (!slug) {
    redirect("/");
  }

  redirect(`/clients/${slug}`);
}
