import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Quote = {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  service: string
  postal_code: string
  message: string | null
  created_at: string
}

type Dispatch = {
  id: string
  garage_email: string
  garage_name?: string
  status: 'sent' | 'failed'
  error_message?: string
  sent_at: string
}

export default async function AdminDashboard() {
  // 1️⃣ Récupérer toutes les demandes
  const { data: quotes, error: quotesError } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (quotesError) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p>Erreur récupération des données : {quotesError.message}</p>
      </div>
    )
  }

  // 2️⃣ Pour chaque demande, récupérer les dispatches
  const quotesWithDispatches = await Promise.all(
    quotes!.map(async (q: Quote) => {
      const { data: dispatches } = await supabase
        .from('quote_dispatches')
        .select('*')
        .eq('quote_id', q.id)
        .order('sent_at', { ascending: true })

      return {
        ...q,
        garages_count: dispatches?.length || 0,
        dispatches: dispatches || [],
      }
    })
  )

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Admin Dashboard</h1>

      {/* Lien pour télécharger le CSV via API route */}
      <a
        href="/api/admin/export"
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          marginBottom: '1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none',
        }}
      >
        Export CSV
      </a>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Client</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Service</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Postal Code</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Garages Contacted</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Détails</th>
          </tr>
        </thead>
        <tbody>
          {quotesWithDispatches.map((q) => (
            <tr key={q.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {new Date(q.created_at).toLocaleString()}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{q.client_name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{q.service}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{q.postal_code}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{q.garages_count}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <ul>
                  {q.dispatches.map((d: Dispatch) => (
                    <li key={d.id}>
                      {d.garage_name || 'Nom indisponible'} ({d.garage_email}) - {d.status.toUpperCase()}
                      {d.status === 'failed' ? ` (${d.error_message})` : ''}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
