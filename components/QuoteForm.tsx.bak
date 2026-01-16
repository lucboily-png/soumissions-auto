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
      intro: 'Complétez ce formulaire et recevez rapidement plusieurs soumissions de garages locaux prêts à réparer votre véhicule.',
	  title: 'Demande de soumission – Réparation automobile',
	  confirmationTitle: '✔️ Demande envoyée avec succès',
	  confirmationText: 'Votre demande a été transmise à des garages près de chez vous. Un professionnel vous contactera sous peu.',
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
        service: 'Type de service',
        brand: 'Marque',
        model: 'Modèle',
        year: 'Année',
        preferredContact: 'Moyen de communication préféré',
        message: 'Message (optionnel)',
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
      intro: 'Fill out this form to receive multiple quotes from local garages ready to repair your vehicle.',
      title: 'Auto Repair Quote Request',
	  confirmationTitle: '✔️Request successfully sent',
	  confirmationText: 'Your request has been sent to auto repair shops near you. A professional will contact you shortly.',
      success: 'Your request has been sent successfully.',
      notfound: 'No garage found near you.',
      error: 'An error occurred. Please try again.',
      submit: 'Submit request',
      placeholders: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        postalCode: 'Postal Code',
        service: 'Service Type',
        brand: 'Brand',
        model: 'Model',
        year: 'Year',
        preferredContact: 'Preferred Contact Method',
        message: 'Message (optional)',
      },
      serviceOptions: [
        'Oil Change',
        'Tire Change',
        'Brakes',
        'Suspension',
        'Alignment',
        'Engine Diagnostic',
        'General Maintenance',
        'Other',
      ],
      contactOptions: ['Email', 'Phone', 'Text'],
    },
  }[lang]

  function normalizePhone(phone: string) {
    // Retire tout sauf les chiffres
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) return phone // si pas 10 chiffres, retourne original
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
        phone: normalizePhone(String(formData.get('phone'))),
        postalCode: String(formData.get('postalCode')),
        service: String(formData.get('service')),
        brand: String(formData.get('brand')),
        model: String(formData.get('model')),
        year: String(formData.get('year')),
        preferredContact: String(formData.get('preferredContact')),
        message: String(formData.get('message') || ''),
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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
	
	{/* Logo */}
      <div className="flex justify-center mb-6">
        <Image
          src="/images/logo.png"
          alt="Soumissions Auto"
          width={250}
          height={110}
          priority
        />
      </div>
	  
      {/* Texte intro */}
      <h1 className="text-xl md:text-2xl font-medium text-center mb-4 max-w-2xl">
        {t.intro}
      </h1>
		<hr className="my-4 border-black-300" />

      {/* Titre formulaire */}
      <h2 className="text-3xl font-bold mb-6 text-center">{t.title}</h2>

      {/* Status messages */}
      {status === 'success' && (
  <div className="mt-10 rounded-xl bg-white p-8 shadow-lg text-center">
    <h2 className="text-2xl font-bold mb-4 text-green-700">
      {t.confirmationTitle}
    </h2>

    <p className="text-gray-700 text-lg mb-6">
      {t.confirmationText}
    </p>

    <p className="text-sm text-gray-500">
      Soumissions Auto
    </p>
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
	  {status !== 'success' && (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-4 bg-white p-6 rounded-lg shadow-md"
      >
        <input
          name="firstName"
          required
          placeholder={t.placeholders.firstName}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-400"
        />
        <input
          name="lastName"
          required
          placeholder={t.placeholders.lastName}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-400"
        />
        <input
          type="email"
          name="email"
          required
          placeholder={t.placeholders.email}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-400"
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder={t.placeholders.phone}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-400"
        />
        <input
          name="postalCode"
          required
          placeholder={t.placeholders.postalCode}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-400"
        />

        <select
          name="service"
          required
          className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-gray-400"
        >
          <option value="">{t.placeholders.service}</option>
          {t.serviceOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          name="brand"
          required
          placeholder={t.placeholders.brand}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-400"
        />
        <input
          name="model"
          required
          placeholder={t.placeholders.model}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-400"
        />
        <input
          name="year"
          required
          placeholder={t.placeholders.year}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-400"
        />

        <select
          name="preferredContact"
          required
          className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-gray-400"
        >
          <option value="">{t.placeholders.preferredContact}</option>
          {t.contactOptions.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <textarea
          name="message"
          placeholder={t.placeholders.message}
          className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:outline-none focus:border-gray-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-lg"
        >
          {loading ? '...' : t.submit}
        </button>
      </form>
	  )}
    </div>
  )
}
