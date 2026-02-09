import { NextResponse } from 'next/server'

export const runtime = 'nodejs' // IMPORTANT pour Stripe

export async function POST(req: Request) {
  try {
    // 🔒 Vérification clé Stripe
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY manquante')
      return NextResponse.json(
        { error: 'Stripe key missing' },
        { status: 500 }
      )
    }

    // ⏱ Import Stripe AU RUNTIME (OBLIGATOIRE sur Vercel)
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2026-01-28.clover',
    })

    // 📦 Données reçues
    const body = await req.json()
    const email = body.email

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    // 💳 Création session Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Soumission garage',
            },
            unit_amount: 1999, // 19.99 $
          },
          quantity: 1,
        },
      ],

      success_url: 'https://soumissions-auto.ca/fr/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://soumissions-auto.ca/fr/cancel',
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur Stripe' },
      { status: 500 }
    )
  }
}
