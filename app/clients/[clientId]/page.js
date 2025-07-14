// app/clients/[clientId]/page.js
import { getSupabaseServerClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ClientDashboard({ params }) {
  const supabase = getSupabaseServerClient();
  const { clientId } = params;

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('client_id', clientId);

  if (error) {
    console.error('Error fetching services:', error.message);
    return <div>Error loading services.</div>;
  }

  return (
    <main>
      <h1>Services for Client {clientId}</h1>
      {services.length === 0 ? (
        <p>No services found for this client.</p>
      ) : (
        <ul>
          {services.map(service => (
            <li key={service.id}>
              <strong>{service.service_name || service.type}</strong><br />
              Status: {service.status || 'unknown'}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
