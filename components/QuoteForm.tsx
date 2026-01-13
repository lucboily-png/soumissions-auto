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
      h1: 'Obtenez rapidement des soumissions de garages près de chez vous',
      intro:
        'Complétez ce formulaire et obtenez plusieurs soumissions de garages locaux prêts à effectuer la réparation de votre véhicule.',
      title: 'Demande de soumission – Réparation automobile',
      success: 'Votre demande a été envoyée avec succès.',
      notfound: 'Aucun garage trouvé près de chez vous.',
      error: 'Une erreur est survenue. Veuillez réessayer.',
      submit: 'Envoyer la demande',
      serviceLabel: 'Type de service',
      contactLabel: 'Moyen de communication préféré',
      services: [
        'Changement d’huile',
        'Changement de pneus',
        'Freins',
        'Suspension',
        'Alignement',
        'Diagnostic moteur',
        'Entretien général',
        'Autre',
      ],
      contacts: ['Courriel', 'Téléphone', 'Texto'],
    },
    en: {
      h1: 'Get multiple auto repair quotes near you',
      intro:
        'Complete this form to receive multiple quotes from local garages ready to repair your vehicle.',
      title: 'Auto Repair Quote Request',
      success: 'Your request has been sent successfully.',
      notfound: 'No garage found near you.',
      error: 'An error occurred. Please try again.',
      submit: 'Submit request',
      serviceLabel: 'Service type',
      contactLabel: 'Preferred contact method',
      services: [
        'Oil change',
        'Tire change',
        'Brakes',
        'Suspension',
        'Alignment',
        'Engine diagnostic',
        'General maintenance',
        'Other',
      ],
      contacts: ['Email', 'Phone', 'Text'],
    },
  }[lang]

  function normalizePhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length !== 10) return value
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
        message: String(formData.get('message') || ''),
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
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-4">{t.h1}</h1>
        <p className="text-center text-gray-600 mb-8">{t.intro}</p>

        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Soumissions Auto"
            width={220}
            height={90}
            priority
          />
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">{t.title}</h2>

        {status !== 'idle' && (
          <div
            className={`mb-6 rounded-lg p-4 text-center font-medium ${
              status === 'success'
                ? 'bg-green-100 text-green-800'
                : status === 'notfound'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {t[status]}
          </div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 bg-white p-8 rounded-xl shadow"
        >
          <input name="firstName" required placeholder="First name" className="input" />
          <input name="lastName" required placeholder="Last name" className="input" />
          <input type="email" name="email" required placeholder="Email" className="input" />
          <input type="tel" name="phone" required placeholder="Phone" className="input" />
          <input name="postalCode" required placeholder="Postal code" className="input" />

          <select name="service" required className="input">
            <option value="">{t.serviceLabel}</option>
            {t.services.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input name="brand" required placeholder="Brand" className="input" />
          <input name="model" required placeholder="Model" className="input" />
          <input name="year" required placeholder="Year" className="input" />

          <select name="preferredContact" required className="input">
            <option value="">{t.contactLabel}</option>
            {t.contacts.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <textarea name="message" placeholder="Message (optional)" className="input h-28" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-lg disabled:opacity-50"
          >
            {loading ? '...' : t.submit}
          </button>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #d1d5db;
          padding: 0.75rem;
          outline: none;
        }
        .input:focus {
          border-color: #9ca3af;
          box-shadow: 0 0 0 1px #9ca3af;
        }
      `}</style>
    </div>
  )
}
