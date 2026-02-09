import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // 🔐 Sécurité : vérifier la clé AU RUNTIME
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY manquante')
    return NextResponse.json(
      { error: 'Stripe key missing' },
      { status: 500 }
    )
  }

  // ⚠️ Import Stripe AU RUNTIME (évite build error)
  const Stripe = (await import('stripe')).default

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-01-28',
  })

  const { email } = await req.json()

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
  })

  return NextResponse.json({ url: session.url })
}
