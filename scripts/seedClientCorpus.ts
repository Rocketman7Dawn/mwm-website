// scripts/seedClientCorpus.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedClientCorpus() {
  // 1) Fetch clients
  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, name, slug, contact_email');

  if (error) {
    console.error('Error fetching clients:', error.message);
    process.exit(1);
  }

  if (!clients || clients.length === 0) {
    console.log('No clients found.');
    process.exit(0);
  }

  // 2) Build rows for client_email_corpus
  const rows = clients.map((c) => ({
    client_id: c.id,
    client_slug: c.slug,
    from_email: c.contact_email || 'unknown@example.com',
    to_email: `seed+${c.slug}@mindfulnesswithmind.com`,
    subject: `Initial seed entry for ${c.name}`,
    body_text: `This is a seed entry for client ${c.name} (${c.slug}).`,
    source: 'seed',
  }));

  const { error: insertError } = await supabase
    .from('client_email_corpus')
    .insert(rows);

  if (insertError) {
    console.error('Error inserting seed rows:', insertError.message);
    process.exit(1);
  }

  console.log(`Inserted ${rows.length} seed rows into client_email_corpus.`);
}

seedClientCorpus();
