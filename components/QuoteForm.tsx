'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

type Lang = 'fr' | 'en'
type Status = 'idle' | 'success' | 'notfound' | 'error'

export default function QuoteForm({ lang = 'fr' }: { lang?: Lang }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [loading, setLoading] = useState(false)

  const t = {
    fr: {
      intro:
        'Remplissez ce formulaire pour recevoir plusieurs soumissions de garages locaux prêts à réparer votre véhicule.',
      title: 'Demande de soumission – Réparation automobile',
      success: 'Votre demande a été envoyée avec succès.',
      notfound: 'Aucun garage trouvé près de chez vous.',
      error: 'Une erreur est survenue. Veuillez réessayer.',
      submit: 'Envoyer la demande',
      placeholders: {
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        postalCode: 'Code postal',
        brand: 'Marque',
        model: 'Modèle',
        year: 'Année',
        message: 'Message (optionnel)',
        preferredContact: 'Moyen de communication préféré',
      },
      serviceOptions: [
        'Changement d’huile',
        'Changement de pneus',
        'Freins',
        'Suspension',
        'Alignement',
        'Diagnostic moteur',
        'Entretien général',
        'Autre',
      ],
      contactOptions: ['Courriel', 'Téléphone', 'Texto'],
    },
    en: {
      intro:
        'Complete this form and receive multiple quotes from garages near you ready to service your vehicle.',
      title: 'Auto Repair Quote Request',
      success: 'Your request has been sent successfully.',
      notfound: 'No garage found near you.',
      error: 'An error occurred. Please try again.',
      submit: 'Submit request',
      placeholders: {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone',
        postalCode: 'Postal code',
        brand: 'Brand',
        model: 'Model',
        year: 'Year',
        message: 'Message (optional)',
        preferredContact: 'Preferred contact method',
      },
      serviceOptions: [
        'Oil change',
        'Tire change',
        'Brakes',
        'Suspension',
        'Alignment',
        'Engine diagnostics',
        'General maintenance',
        'Other',
      ],
      contactOptions: ['Email', 'Phone', 'Text'],
    },
  }[lang]

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
        brand: String(formData.get('brand')),
        model: String(formData.get('model')),
        year: String(formData.get('year')),
        message: String(formData.get('message') || ''),
        service: String(formData.get('service')),
        preferredContact: String(formData.get('preferredContact')),
        lang,
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
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-x1">

        {/* Intro texte */}
        <h1 className="text-center text-gray-700 text-lg mb-4 font-medium">{t.intro}</h1>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Soumissions Auto"
            width={220}
            height={90}
            priority
          />
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold mb-6 text-center">{t.title}</h1>

        {/* Statuts */}
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

        {/* Formulaire */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 bg-white rounded-xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="grid grid-cols-1 gap-4">
            <input
              name="firstName"
              required
              placeholder={t.placeholders.firstName}
              className="w-full border rounded-lg p-3 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
            <input
              name="lastName"
              required
              placeholder={t.placeholders.lastName}
              className="w-full border rounded-lg p-3 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
            <input
              type="email"
              name="email"
              required
              placeholder={t.placeholders.email}
              className="w-full border rounded-lg p-3 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
            <input
              type="tel"
              name="phone"
              required
              placeholder={t.placeholders.phone}
              className="w-full border rounded-lg p-3 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
            <input
              name="postalCode"
              required
              placeholder={t.placeholders.postalCode}
              className="w-full border rounded-lg p-3 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
            <select
              name="service"
              required
              className="w-full border rounded-lg p-3 bg-white focus:border-gray-400 focus:ring focus:ring-gray-300"
            >
              <option value="">Type de service</option>
              {t.serviceOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              name="brand"
              required
              placeholder={t.placeholders.brand}
              className="w-full border rounded-lg p-3 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
            <input
              name="model"
              required
              placeholder={t.placeholders.model}
              className="w-full border rounded-lg p-3 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
            <input
              name="year"
              required
              placeholder={t.placeholders.year}
              className="w-full border rounded-lg p-3 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
            <select
              name="preferredContact"
              required
              className="w-full border rounded-lg p-3 bg-white focus:border-gray-400 focus:ring focus:ring-gray-300"
            >
              <option value="">{t.placeholders.preferredContact}</option>
              {t.contactOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <textarea
              name="message"
              placeholder={t.placeholders.message}
              className="w-full border rounded-lg p-3 h-28 focus:border-gray-400 focus:ring focus:ring-gray-300 text-gray-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-lg transition-all duration-300"
          >
            {loading ? '...' : t.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
