'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send
} from 'lucide-react'

type Lang = 'fr' | 'en'

export default function GarageRecruitmentForm({
  lang = 'fr',
}: {
  lang?: Lang
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const pathname = usePathname()
  const lang = pathname.startsWith('/en') ? 'en' : 'fr'
  const isEN = lang === 'en'

  const t = {
    title: isEN
      ? 'Join the Soumissions-Auto.ca Network'
      : 'Rejoignez le réseau Soumissions-Auto.ca',
    subtitle: isEN
      ? 'Receive qualified customer requests in your area. No fixed fees. No commitment.'
      : 'Recevez des demandes de clients qualifiés dans votre région. Aucun frais fixe. Aucun engagement.',
    successTitle: isEN ? 'Request sent successfully ✅' : 'Demande envoyée avec succès ✅',
    successText: isEN
      ? 'Thank you for your interest. Our team will contact you shortly.'
      : 'Merci pour votre intérêt. Un membre de notre équipe vous contactera rapidement.',
    garage: isEN ? 'Garage name' : 'Nom du garage',
    name: isEN ? 'Your name' : 'Votre nom',
    email: isEN ? 'Email address' : 'Adresse courriel',
    phone: isEN ? 'Phone number' : 'Téléphone',
    city: isEN ? 'City' : 'Ville',
    postal: isEN ? 'Postal code' : 'Code postal',
    message: isEN ? 'Message (optional)' : 'Message (optionnel)',
    messagePlaceholder: isEN
      ? 'Tell us briefly about your garage...'
      : 'Parlez-nous brièvement de votre garage...',
    submit: isEN ? 'Get started' : 'Commencer',
    sending: isEN ? 'Sending…' : 'Envoi en cours…',
  }

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
      <div className="max-w-xl mx-auto bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold text-green-700 mb-2">
          {t.successTitle}
        </h3>
        <p className="text-green-700">{t.successText}</p>
      </div>
    )
  }

  return (
    <section className="bg-slate-50 py-12 px-4 rounded-2xl border border-slate-200">
      <div className="max-w-3xl mx-auto">
        {/* Intro */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            {t.title}
          </h2>
          <p className="text-slate-600 text-lg">{t.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input icon={Building2} name="garageName" label={t.garage} required />
          <Input icon={User} name="name" label={t.name} required />
          <Input icon={Mail} name="email" label={t.email} type="email" required />
          <Input icon={Phone} name="phone" label={t.phone} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input icon={MapPin} name="city" label={t.city} />
            <Input icon={MapPin} name="postalcode" label={t.postal} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.message}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <textarea
                name="message"
                rows={4}
                className="w-full pl-10 rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder={t.messagePlaceholder}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-white font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            <Send size={18} />
            {loading ? t.sending : t.submit}
          </button>
        </form>
      </div>
    </section>
  )
}

/* ===============================
   Input Component
================================ */
function Input({
  icon: Icon,
  label,
  ...props
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 text-slate-400" size={18} />
        <input
          {...props}
          className="w-full pl-10 rounded-lg border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
        />
      </div>
    </div>
  )
}
