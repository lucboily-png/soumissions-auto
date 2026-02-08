import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export async function POST(req: Request) {
  try {
    const { garageId, email } = await req.json()

    if (!garageId || !email) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    // ⚠️ Supabase import dynamique (CRUCIAL)
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 🔹 Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: 'https://soumissions-auto.ca/fr/success?session_id={CHECKOUT_SESSION_ID}',
	cancel_url: 'https://soumissions-auto.ca/fr/cancel',
      metadata: {
        garage_id: garageId,
      },
    })

    // 🔹 Sauvegarder la session immédiatement
    await supabase
      .from('garages')
      .update({
        stripe_session_id: session.id,
        payment_status: 'pending',
      })
      .eq('id', garageId)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('❌ Stripe checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
