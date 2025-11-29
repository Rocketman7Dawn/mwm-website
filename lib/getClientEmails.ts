// lib/getClientEmails.ts
// Temporary stub implementation so the build passes.
// We'll wire this to Supabase once the email corpus is ready.

export async function getRecentEmailsForClient(
  clientSlug: string,
  limit = 10
): Promise<
  Array<{
    id: string;
    subject: string;
    body_text: string;
    received_at: string;
    from_email: string;
    source: string;
  }>
> {
  console.warn(
    "[getRecentEmailsForClient] Stub called for client:",
    clientSlug,
    "limit:",
    limit
  );

  // For now, return an empty list.
  return [];
}
