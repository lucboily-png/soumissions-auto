export async function POST(req: Request) {
  // Import dynamique pour NextResponse et Stripe (évite l'erreur build)
  const { NextResponse } = await import('next/server')
  const StripeModule = await import('stripe')
  const Stripe = StripeModule.default

  // Récupération sécurisée de la clé
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID

  if (!stripeSecretKey) {
    console.error('❌ STRIPE_SECRET_KEY manquante')
    return NextResponse.json(
      { error: 'Stripe key missing' },
      { status: 500 }
    )
  }

  if (!priceId) {
    console.error('❌ STRIPE_PRICE_ID manquante')
    return NextResponse.json(
      { error: 'Stripe price missing' },
      { status: 500 }
    )
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-01-28.clover', // ta version Stripe
  })

  let email: string | undefined
  try {
    const body = await req.json()
    email = body.email
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: 'https://soumissions-auto.ca/fr/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://soumissions-auto.ca/fr/cancel',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('❌ Stripe error:', err)
    return NextResponse.json(
      { error: 'Stripe session creation failed', details: err.message },
      { status: 500 }
    )
  }
}
