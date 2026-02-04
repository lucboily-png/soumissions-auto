import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    const { data, error } = await supabase.rpc('increment_page_view', {
      p_name: 'quote_form', // ⚠️ correspond au nom attendu dans Supabase
    })

    if (error) {
      console.error('Page view error:', error)
      return NextResponse.json({ error: 'Counter error' }, { status: 500 })
    }

    return NextResponse.json({ views: data[0].current_views })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Counter error' }, { status: 500 })
  }
}
