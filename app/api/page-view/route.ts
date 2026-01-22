import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  const { data, error } = await supabase.rpc('increment_page_view', {
    page_name: 'quote_form',
  })

  if (error) {
    console.error('Page view error:', error)
    return NextResponse.json({ error: 'Counter error' }, { status: 500 })
  }

  return NextResponse.json({ views: data })
}
