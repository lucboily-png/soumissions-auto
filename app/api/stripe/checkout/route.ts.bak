import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    // 1️⃣ Vérification ENV
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY missing')
      return new Response('Stripe key missing', { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-01-28.clover',
    })

    // 2️⃣ Lecture body
    const body = await req.json()
    const { email } = body

    if (!email) {
      return new Response('Email missing', { status: 400 })
    }

    // 3️⃣ Création session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: { name: 'Soumissions Auto – Accès Garage' },
            unit_amount: 4900,
          },
          quantity: 1,
        },
      ],
      success_url: 'https://soumissions-auto.ca/fr/success',
      cancel_url: 'https://soumissions-auto.ca/fr/cancel',
    })

    // 4️⃣ Réponse OK
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return new Response('Server error', { status: 500 })
  }
}
