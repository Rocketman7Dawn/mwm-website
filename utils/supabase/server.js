// utils/supabase/server.js
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function getSupabaseServerClient() {
  // ⬇️ Next 15: cookies() must be awaited
  const cookieStore = await cookies();

  return createServerComponentClient({
    cookies: () => cookieStore,
  });
}
