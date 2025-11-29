// lib/emailIngest.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type EmailInput = {
  to: string;
  from: string;
  subject?: string;
  bodyText?: string;
  bodyHtml?: string;
  receivedAt?: string | Date;
};

function extractClientSlugFromTo(to: string): string | null {
  // e.g. mwm-intake+iva_enright@mindfulnesswithmind.com → "iva_enright"
  const match = to.match(/^[^+]+\+([^@]+)@/);
  return match ? match[1].toLowerCase() : null;
}

export async function ingestEmail(email: EmailInput) {
  const clientSlug = extractClientSlugFromTo(email.to);

  if (!clientSlug) {
    throw new Error(`Could not extract client slug from "to" address: ${email.to}`);
  }

  // 1) Find the client by slug
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, slug')
    .eq('slug', clientSlug)
    .single();

  if (clientError || !client) {
    throw new Error(`No client found for slug "${clientSlug}": ${clientError?.message}`);
  }

  // 2) Insert the email into the corpus
  const { data: emailRow, error: insertError } = await supabase
    .from('client_email_corpus')
    .insert({
      client_id: client.id,
      client_slug: client.slug, // 👈 now matches your renamed column
      from_email: email.from,
      to_email: email.to,
      subject: email.subject ?? null,
      body_text: email.bodyText ?? null,
      body_html: email.bodyHtml ?? null,
      received_at: email.receivedAt ?? new Date().toISOString(),
      source: 'forwarded',
    })
    .select('*')
    .single();

  if (insertError || !emailRow) {
    throw new Error(`Error inserting email: ${insertError?.message}`);
  }

  return emailRow;
}
