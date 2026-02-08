import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const Stripe = (await import('stripe')).default

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2026-01-28.clover',
    })

    const { garageId, email } = await req.json()
    console.log('💡 Reçu du front:', { garageId, email })  // <- log ici

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: 1,
        },
      ],
      success_url: 'https://soumissions-auto.ca/fr/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://soumissions-auto.ca/fr/cancel',
      metadata: { garage_id: garageId },
    })

    console.log('💡 Session Stripe créée:', session.id) // <- log ici

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('❌ Erreur dans checkout POST:', err)  // <- log l’erreur exacte
    return NextResponse.json({ error: 'Erreur checkout', details: err }, { status: 500 })
  }
}
