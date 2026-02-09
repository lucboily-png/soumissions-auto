import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  console.log('Stripe route called')

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY missing at runtime')
    return NextResponse.json({ error: 'Stripe key missing' }, { status: 500 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email } = body
  if (!email) {
    return NextResponse.json({ error: 'Email missing' }, { status: 400 })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: { name: 'Soumissions Auto' },
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
