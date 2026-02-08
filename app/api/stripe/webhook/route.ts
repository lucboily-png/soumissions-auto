export async function POST(req: Request) {
  // ✅ import Stripe AU RUNTIME (pas au build)
  const Stripe = (await import('stripe')).default

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-01-28.clover',
  })

  const body = await req.arrayBuffer()
  const signature = req.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err) {
    console.error('❌ Webhook signature invalide', err)
    return new Response('Webhook error', { status: 400 })
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
