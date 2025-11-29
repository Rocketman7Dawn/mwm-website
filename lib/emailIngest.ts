// lib/emailIngest.ts
import { supabaseAdmin } from "./supabaseClient";

export type IngestEmailParams = {
  clientSlug: string;
  subject: string | null;
  bodyText: string | null;
  fromEmail: string | null;
  toEmail: string | null;
  receivedAt?: string | Date | null;
  source?: string | null;
};

export async function ingestInboundEmail({
  clientSlug,
  subject,
  bodyText,
  fromEmail,
  toEmail,
  receivedAt,
  source,
}: IngestEmailParams) {
  const receivedAtDate =
    receivedAt instanceof Date
      ? receivedAt
      : receivedAt
      ? new Date(receivedAt)
      : new Date();

  const { data, error } = await supabaseAdmin
    .from("client_email_corpus")
    .insert({
      client_slug: clientSlug,
      subject,
      body_text: bodyText,
      from_email: fromEmail,
      to_email: toEmail,
      received_at: receivedAtDate.toISOString(),
      source: source ?? "mailgun",
    })
    .select()
    .single();

  if (error) {
    console.error("[ingestInboundEmail] Error inserting email:", error);
    throw error;
  }

  return data;
}
