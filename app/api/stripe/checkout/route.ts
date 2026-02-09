import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { email } = await req.json()

  // Vérifie si le garage existe
  const { data: existing, error: selectError } = await supabase
    .from('garages')
    .select('id')
    .eq('email', email)
    .single()

  let garageId: string

  if (selectError || !existing) {
    garageId = crypto.randomUUID()
    const { error: insertError } = await supabase
      .from('garages')
      .insert([{ id: garageId, email, payment_status: 'pending' }])
    if (insertError) console.error('⚠️ Supabase insert failed:', insertError)
  } else {
    garageId = existing.id
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL

  // Crée la session Stripe
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    subscription_data: {
      trial_period_days: 30,
      metadata: { garage_id: garageId },
    },
    metadata: { garage_id: garageId },
    success_url: 'https://soumissions-auto.ca/fr/success?session_id={CHECKOUT_SESSION_ID}',
	cancel_url: 'https://soumissions-auto.ca/fr/cancel',
  })

  // Met à jour Supabase avec stripe_session_id
  const { error: updateError } = await supabase
    .from('garages')
    .update({ stripe_session_id: session.id })
    .eq('id', garageId)

  if (updateError) console.error('⚠️ Supabase update failed:', updateError)

  return NextResponse.json({
    url: session.url,
    stripe_session_id: session.id,
    garage_id: garageId,
  })
}
