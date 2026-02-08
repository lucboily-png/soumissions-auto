import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.arrayBuffer()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Webhook signature invalide', err)
    return new Response('Webhook error', { status: 400 })
  }

  // 1️⃣ Checkout terminé → trialing
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const garageId: string = session.metadata?.garage_id

    if (garageId) {
      supabase
        .from('garages')
        .update({
          payment_status: 'trialing',
          stripe_session_id: session.id,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('id', garageId)
        .then(({ error }) => {
          if (error) console.error('⚠️ Supabase trial update failed:', error)
          else console.log(`✅ Garage ${garageId} mis à jour en trialing`)
        })
    }
  }

  // 2️⃣ Premier vrai paiement → paid
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as any
    const subscriptionId: string = invoice.subscription

    if (!subscriptionId) {
      console.error('❌ invoice.subscription introuvable')
      return new Response('No subscription ID', { status: 400 })
    }

    supabase
      .from('garages')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId)
      .then(({ error }) => {
        if (error) console.error('⚠️ Supabase paid update failed:', error)
        else console.log(`✅ Subscription ${subscriptionId} payée`)
      })
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
