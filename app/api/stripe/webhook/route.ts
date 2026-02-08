import type Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const StripeModule = (await import('stripe')).default
  const stripe = new StripeModule(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-01-28.clover',
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.arrayBuffer()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const garageId = session.metadata?.garage_id

    if (!garageId) return new Response('Missing garage_id', { status: 200 })

    const { error } = await supabase
      .from('garages')
      .update({
        payment_status: 'trialing',
        stripe_session_id: session.id,
        stripe_subscription_id: session.subscription as string,
      })
      .eq('id', garageId)

    if (error) console.error('❌ Supabase update error:', error)
    else console.log(`✅ Garage ${garageId} mis à jour`)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
