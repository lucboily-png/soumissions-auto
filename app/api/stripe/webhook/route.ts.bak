import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export async function POST(req: Request) {
  const body = await req.arrayBuffer()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {s
    event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('❌ Webhook signature invalide', err)
    return new Response('Webhook error', { status: 400 })
  }

  // ⚠️ Supabase import dynamique
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // ✅ Checkout complété → TRIAL
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const garageId = session.metadata?.garage_id
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : undefined

    if (!garageId) {
      console.error('❌ garage_id manquant')
      return new Response('OK')
    }

    const { error } = await supabase
      .from('garages')
      .update({
        payment_status: 'trialing',
        stripe_session_id: session.id,
        stripe_subscription_id: subscriptionId,
      })
      .eq('id', garageId)

    if (error) {
      console.error('⚠️ Supabase trial update failed:', error)
    } else {
      console.log(`✅ Garage ${garageId} en TRIAL`)
    }
  }

  // ✅ Paiement réel prélevé → PAID
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as any

    const subscriptionId =
      typeof invoice.subscription === 'string'
        ? invoice.subscription
        : null

    if (!subscriptionId) {
      console.error('❌ subscription introuvable sur invoice')
      return new Response('OK')
    }

    const { error } = await supabase
      .from('garages')
      .update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId)

    if (error) {
      console.error('⚠️ Supabase paid update failed:', error)
    } else {
      console.log(`💰 Abonnement ${subscriptionId} payé`)
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
