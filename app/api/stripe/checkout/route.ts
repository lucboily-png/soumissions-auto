import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Test paiement',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://soumissions-auto.ca/fr/success',
      cancel_url: 'https://soumissions-auto.ca/fr/cancel',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('STRIPE CHECKOUT ERROR:', err)
    return NextResponse.json(
      { error: err.message ?? 'Stripe error' },
      { status: 500 }
    )
  }
}
