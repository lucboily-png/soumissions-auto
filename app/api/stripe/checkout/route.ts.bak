import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

import Stripe from 'stripe'
export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

    const body = await req.json()
    const email = body.email

    if (!email) {
      return NextResponse.json(
        { error: 'Email manquant' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Accès Soumissions Auto',
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
      { error: err.message ?? 'Erreur Stripe' },
      { status: 500 }
    )
  }
}
