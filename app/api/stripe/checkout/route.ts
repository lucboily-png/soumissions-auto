import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY manquante')
    return NextResponse.json(
      { error: 'Stripe key missing' },
      { status: 500 }
    )
  }

  const stripe = new Stripe(stripeSecretKey)

  const body = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Soumission Auto',
          },
          unit_amount: 5000,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
  })

  return NextResponse.json({ url: session.url })
}
