import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const Stripe = (await import('stripe')).default

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-01-28.clover',
  })

  const { garageId, email } = await req.json()

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

  return NextResponse.json({ url: session.url })
}
