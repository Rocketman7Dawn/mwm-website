export async function getRecentEmailsForClient(clientSlug: string, limit = 10) {
  const { data, error } = await supabase
    .from('client_email_corpus')
    .select('id, subject, body_text, received_at, from_email, source')
    .eq('client_slug', clientSlug)
    .neq('source', 'seed')          // 👈 ignore seed rows
    .order('received_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Error fetching emails for ${clientSlug}: ${error.message}`);
  }

  return data ?? [];
}
