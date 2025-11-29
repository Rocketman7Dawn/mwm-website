// lib/getClientEmails.ts
import { supabaseAdmin } from "./supabaseClient";

export type ClientEmailRecord = {
  id: string;
  client_slug: string;
  subject: string | null;
  body_text: string | null;
  received_at: string;
  from_email: string | null;
  to_email: string | null;
  source: string | null;
};

export async function getRecentEmailsForClient(
  clientSlug: string,
  limit = 10
): Promise<ClientEmailRecord[]> {
  const { data, error } = await supabaseAdmin
    .from("client_email_corpus")
    .select(
      "id, client_slug, subject, body_text, received_at, from_email, to_email, source"
    )
    .eq("client_slug", clientSlug)
    .order("received_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentEmailsForClient] Error:", error);
    throw error;
  }

  return (data as ClientEmailRecord[]) ?? [];
}
