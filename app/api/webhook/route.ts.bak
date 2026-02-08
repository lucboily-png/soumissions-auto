// /app/api/stripe/checkout/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { garageId, email } = await req.json()

  if (!garageId || !email) {
    return new Response('garageId and email are required', { status: 400 })
  }

  try {
    // Crée la session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 30,
      },
      metadata: {
        garage_id: garageId,
        email: email, // utile pour le webhook ou suivi
      },
      success_url: 'http://localhost:3000/fr/success',
      cancel_url: 'http://localhost:3000/fr/cancel',
    })

    // Optionnel : enregistrer directement l'ID Stripe dans Supabase dès création de session
    await supabase
      .from('garages')
      .update({ stripe_session_id: session.id })
      .eq('id', garageId)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Erreur création session Stripe :', err)
    return new Response('Erreur création session Stripe', { status: 500 })
  }
}
