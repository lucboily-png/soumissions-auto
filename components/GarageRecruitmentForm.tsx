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

  const t = {
    fr: {
      title: 'Rejoignez le réseau Soumissions-Auto.ca',
      subtitle: 'Recevez des demandes de clients qualifiés de votre région.',
      successTitle: 'Demande envoyée avec succès ✅',
      successText: 'Merci pour votre intérêt. Vous serez redirigé vers le paiement.',
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
      subtitle: 'Receive qualified customer requests in your area.',
      successTitle: 'Request sent successfully ✅',
      successText: 'You will now be redirected to payment.',
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

    try {
      // 1️⃣ Sauvegarde le garage dans Supabase via ton endpoint API
      const res = await fetch('/api/recruit-garage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      })

      if (!res.ok) throw new Error('Erreur lors de l’envoi du formulaire')

      const savedGarage = await res.json()
      const garageId = savedGarage.id  // ID du garage créé 

      // 2️⃣ Crée la session Stripe avec garageId
      const stripeRes = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garageId, email: formData.email }),
      })

      if (!stripeRes.ok) throw new Error('Erreur création session Stripe')
      const data = await stripeRes.json()

      // 3️⃣ Redirige vers Stripe pour paiement
      window.location.href = data.url
    } catch (err) {
      console.error(err)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-12">
        <Image
          src={isEN ? '/images/recrut-garage-en.png' : '/images/recrut-garage-fr.png'}
          alt="Soumissions Auto"
          width={800}
          height={970}
          priority
        />
      </div>
          <h2 className="mb-3 text-3xl font-bold text-slate-900">{t.title}</h2>
          <p className="text-lg text-slate-600">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5">
          <Input name="garageName" label={t.garage} required />
          <Input name="name" label={t.name} required />
          <Input name="email" label={t.email} type="email" required />
          <Input name="phone" label={t.phone} />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input name="city" label={t.city} />
            <Input name="postalCode" label={t.postal} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t.message}</label>
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

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
      />
    </div>
  )
}
