'use client'

export default function StripeTestPage() {
  const handleStripe = async () => {
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <div>
      <h1>Test Stripe</h1>
      <button onClick={handleStripe}>Tester Stripe</button>
    </div>
  )
}
