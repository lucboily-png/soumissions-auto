'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

type Status = 'idle' | 'success' | 'notfound' | 'error'

export default function QuoteFormEN() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [loading, setLoading] = useState(false)

  const t = {
    title: 'Auto Repair Quote Request',
    success: 'Your request has been sent successfully.',
    notfound: 'No garage found near you.',
    error: 'An error occurred. Please try again.',
    submit: 'Submit request',
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    try {
      const formData = new FormData(e.currentTarget)

      const payload = {
        firstName: String(formData.get('firstName')),
        lastName: String(formData.get('lastName')),
        email: String(formData.get('email')),
        phone: String(formData.get('phone')),
        postalCode: String(formData.get('postalCode')),
        service: String(formData.get('service')),
        brand: String(formData.get('brand')),
        model: String(formData.get('model')),
        year: String(formData.get('year')),
        preferredContact: String(formData.get('preferredContact')),
        message: String(formData.get('message') || ''),
        lang: 'en',
      }

      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 200) {
        setStatus('success')
        formRef.current?.reset()
      } else if (res.status === 404) {
        setStatus('notfound')
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/logo.png"
            alt="Soumissions Auto"
            width={220}
            height={90}
            priority
          />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">{t.title}</h1>

        {status !== 'idle' && (
          <div className="mb-6 text-center font-medium">
            {status === 'success' && <div className="bg-green-100 text-green-800 p-4 rounded-lg">{t.success}</div>}
            {status === 'notfound' && <div className="bg-red-100 text-red-800 p-4 rounded-lg">{t.notfound}</div>}
            {status === 'error' && <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">{t.error}</div>}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input name="firstName" required placeholder="First name" className="w-full border p-3 rounded-lg" />
          <input name="lastName" required placeholder="Last name" className="w-full border p-3 rounded-lg" />
          <input type="email" name="email" required placeholder="Email" className="w-full border p-3 rounded-lg" />
          <input name="phone" required placeholder="Phone" className="w-full border p-3 rounded-lg" />
          <input name="postalCode" required placeholder="Postal code" className="w-full border p-3 rounded-lg" />

          <select name="service" required className="w-full border p-3 rounded-lg bg-white">
            <option value="">Service type</option>
            <option value="oil_change">Oil change</option>
            <option value="tires">Tires</option>
            <option value="brakes">Brakes</option>
            <option value="diagnostic">Engine diagnostic</option>
            <option value="general">General maintenance</option>
          </select>

          <input name="brand" required placeholder="Brand" className="w-full border p-3 rounded-lg" />
          <input name="model" required placeholder="Model" className="w-full border p-3 rounded-lg" />
          <input name="year" required placeholder="Year" className="w-full border p-3 rounded-lg" />

          <select name="preferredContact" required className="w-full border p-3 rounded-lg bg-white">
            <option value="">Preferred contact method</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text message</option>
          </select>

          <textarea name="message" placeholder="Message (optional)" className="w-full border p-3 rounded-lg h-28" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? '...' : t.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
