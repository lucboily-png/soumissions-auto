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
    intro:
      'Complete this form to receive multiple quotes from auto repair shops near you ready to service your vehicle.',
    success: 'Your request has been sent successfully.',
    notfound: 'No garage found near you.',
    error: 'An error occurred. Please try again.',
    submit: 'Submit request',
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length < 10) return value
    return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`
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
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.png" alt="Soumissions Auto" width={220} height={90} priority />
        </div>

        <h1 className="text-3xl font-bold text-center mb-3">{t.title}</h1>
        <p className="text-center text-gray-600 mb-8">{t.intro}</p>

        <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" required placeholder="First name" className="input" />
          <input name="lastName" required placeholder="Last name" className="input" />
          <input type="email" name="email" required placeholder="Email" className="input md:col-span-2" />
          <input type="tel" name="phone" required placeholder="Phone" className="input" onChange={(e) => (e.target.value = formatPhone(e.target.value))} />
          <input name="postalCode" required placeholder="Postal code" className="input" />
          <textarea name="message" placeholder="Message (optional)" className="input md:col-span-2 h-28" />
          <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-lg">
            {loading ? '...' : t.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
