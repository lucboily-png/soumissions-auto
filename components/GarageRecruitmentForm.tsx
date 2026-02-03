'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

type Lang = 'fr' | 'en'

export default function GarageRecruitmentForm() {
  const pathname = usePathname()
  const lang: Lang = pathname.startsWith('/en') ? 'en' : 'fr'
  const isEN = lang === 'en'

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const t = {
    fr: {
      title: 'Rejoignez le réseau Soumissions-Auto.ca',
      subtitle: 'Recevez des demandes de clients qualifiés de votre région.',
      successTitle: 'Demande envoyée avec succès ✅',
      successText:
        'Merci pour votre intérêt. Un membre de notre équipe vous contactera rapidement.',
      garage: 'Nom du garage',
      name: 'Votre nom',
      email: 'Adresse courriel',
      phone: 'Téléphone',
      city: 'Ville',
      postal: 'Code postal',
      message: 'Message (optionnel)',
      messagePlaceholder: 'Parlez-nous brièvement de votre garage...',
      submit: 'Soumettre',
      sending: 'Envoi en cours…',
    },
    en: {
      title: 'Join the Soumissions-Auto.ca Network',
      subtitle:
        'Receive qualified customer requests in your area.',
      successTitle: 'Request sent successfully ✅',
      successText:
        'Thank you for your interest. Our team will contact you shortly.',
      garage: 'Garage name',
      name: 'Your name',
      email: 'Email address',
      phone: 'Phone number',
      city: 'City',
      postal: 'Postal code',
      message: 'Message (optional)',
      messagePlaceholder: 'Tell us briefly about your garage...',
      submit: 'Submit',
      sending: 'Sending…',
    },
  }[lang]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = Object.fromEntries(new FormData(e.currentTarget))

    const res = await fetch('/api/recruit-garage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, lang }),
    })

    setLoading(false)
    if (res.ok) setSuccess(true)
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="mb-2 text-xl font-semibold text-green-700">
          {t.successTitle}
        </h3>
        <p className="text-green-700">{t.successText}</p>
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Intro */}
<div className="mb-10 text-center">
  {/* Logo */}
  <div className="mb-6 flex justify-center">
    <Image
      src="/images/logosa.png"
      alt="Soumissions Auto"
      width={820}
      height={680}
      priority
    />
  </div>

  <h2 className="mb-3 text-3xl font-bold text-slate-900">
    {t.title}
  </h2>
  <p className="text-lg text-slate-600">{t.subtitle}</p>
</div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-xl space-y-5"
        >
          <Input name="garageName" label={t.garage} required />
          <Input name="name" label={t.name} required />
          <Input name="email" label={t.email} type="email" required />
          <Input name="phone" label={t.phone} />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input name="city" label={t.city} />
            <Input name="postalCode" label={t.postal} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {t.message}
            </label>
            <textarea
              name="message"
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
              placeholder={t.messagePlaceholder}
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? t.sending : t.submit}
          </button>
        </form>
		 <p className="mt-10 text-center text-sm uppercase tracking-wide text-gray-400">
      Soumissions-Auto.ca • 2026
    </p>
      </div>
    </section>
  )
}

/* ===============================
   Input Component
================================ */
function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  )
}
