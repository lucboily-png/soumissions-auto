import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // 🔐 Lire la clé Stripe au runtime
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY manquante')
      return NextResponse.json(
        { error: 'Stripe key missing' },
        { status: 500 }
      )
    }

    // ⚠️ Import Stripe au runtime pour éviter les erreurs de build
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
    })

    // Lire le corps JSON
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json(
        { error: 'Email missing' },
        { status: 400 }
      )
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // ou 'payment' selon ton cas
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // assure-toi qu'il est défini dans Vercel
          quantity: 1,
        },
      ],
      success_url: `https://soumissions-auto.ca/fr/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://soumissions-auto.ca/fr/cancel`,
    })

    // Retourner l'URL au client
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('❌ Erreur Stripe Checkout:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
