import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  // Récupérer toutes les quotes
  const { data: quotes, error: quotesError } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (quotesError) {
    return NextResponse.json({ error: quotesError.message }, { status: 500 })
  }

  let csv = 'Client,Email,Phone,Service,Postal Code,Message,Garage Name,Garage Email,Status\n'

  for (const q of quotes!) {
    // Récupérer les dispatches pour chaque quote
    const { data: dispatches } = await supabase
      .from('quote_dispatches')
      .select('*')
      .eq('quote_id', q.id)

    if (dispatches && dispatches.length > 0) {
      dispatches.forEach((d) => {
        csv += `"${q.client_name}","${q.client_email}","${q.client_phone}","${q.service}","${q.postal_code}","${q.message || ''}","${d.garage_name || ''}","${d.garage_email}","${d.status}"\n`
      })
    } else {
      csv += `"${q.client_name}","${q.client_email}","${q.client_phone}","${q.service}","${q.postal_code}","${q.message || ''}","","",""\n`
    }
  }

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="quotes.csv"',
    },
  })
}
