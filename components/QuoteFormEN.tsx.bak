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
        service: String(formData.get('service')),
        brand: String(formData.get('brand')),
        model: String(formData.get('model')),
        year: String(formData.get('year')),
        message: String(formData.get('message') || ''),
        postalCode: String(formData.get('postalCode')),
        preferredContact: String(formData.get('preferredContact')),
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
      console.error('Submit error:', err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-4">
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

        {status === 'success' && (
          <div className="mb-6 rounded-lg bg-green-100 text-green-800 p-4 text-center font-medium">
            {t.success}
          </div>
        )}

        {status === 'notfound' && (
          <div className="mb-6 rounded-lg bg-red-100 text-red-800 p-4 text-center font-medium">
            {t.notfound}
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 rounded-lg bg-yellow-100 text-yellow-800 p-4 text-center font-medium">
            {t.error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input name="firstName" required placeholder="First name" className="w-full border rounded-lg p-3" />
          <input name="lastName" required placeholder="Last name" className="w-full border rounded-lg p-3" />
          <input type="email" name="email" required placeholder="Email" className="w-full border rounded-lg p-3" />
          <input type="tel" name="phone" required placeholder="Phone" className="w-full border rounded-lg p-3" />
          <input name="postalCode" required placeholder="Postal code" className="w-full border rounded-lg p-3" />

          <select name="service" required className="w-full border rounded-lg p-3 bg-white">
            <option value="">Service type</option>
            <option>Oil change</option>
            <option>Tire change</option>
            <option>Brakes</option>
            <option>Suspension</option>
            <option>Alignment</option>
            <option>Engine diagnostics</option>
            <option>General maintenance</option>
            <option>Other</option>
          </select>

          <input name="brand" required placeholder="Brand" className="w-full border rounded-lg p-3" />
          <input name="model" required placeholder="Model" className="w-full border rounded-lg p-3" />
          <input name="year" required placeholder="Year" className="w-full border rounded-lg p-3" />

          <select name="preferredContact" required className="w-full border rounded-lg p-3 bg-white">
            <option value="">Preferred contact method</option>
            <option>Email</option>
            <option>Phone</option>
            <option>Text</option>
          </select>

          <textarea name="message" placeholder="Message (optional)" className="w-full border rounded-lg p-3 h-28" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-lg"
          >
            {loading ? '...' : t.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
