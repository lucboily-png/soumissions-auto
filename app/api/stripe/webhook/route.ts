import Stripe from 'stripe'

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-01-28.clover',
  })

  const body = await req.arrayBuffer()
  const signature = req.headers.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    Buffer.from(body),
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
