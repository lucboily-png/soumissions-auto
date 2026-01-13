'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

type Status = 'idle' | 'success' | 'notfound' | 'error'

export default function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [loading, setLoading] = useState(false)

  const t = {
    title: 'Demande de soumission – Réparation automobile',
    success: 'Votre demande a été envoyée avec succès.',
    notfound: 'Aucun garage trouvé près de chez vous.',
    error: 'Une erreur est survenue. Veuillez réessayer.',
    submit: 'Envoyer la demande',
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
        lang: 'fr',
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

        {status === 'success' && (
          <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-lg text-center">
            {t.success}
          </div>
        )}
        {status === 'notfound' && (
          <div className="mb-6 bg-red-100 text-red-800 p-4 rounded-lg text-center">
            {t.notfound}
          </div>
        )}
        {status === 'error' && (
          <div className="mb-6 bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
            {t.error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <input name="firstName" required placeholder="Prénom" className="w-full border p-3 rounded-lg" />
          <input name="lastName" required placeholder="Nom" className="w-full border p-3 rounded-lg" />
          <input type="email" name="email" required placeholder="Courriel" className="w-full border p-3 rounded-lg" />
          <input name="phone" required placeholder="Téléphone" className="w-full border p-3 rounded-lg" />
          <input name="postalCode" required placeholder="Code postal" className="w-full border p-3 rounded-lg" />

          <select name="service" required className="w-full border p-3 rounded-lg bg-white">
            <option value="">Type de service</option>
			<option value="oil_change">Changement d’huile</option>
			<option value="tire_change">Changement de pneus</option>
			<option value="brakes">Freins</option>
			<option value="suspension">Suspension</option>
			<option value="alignment">Alignement</option>
			<option value="engine_diagnostic">Diagnostic moteur</option>
			<option value="maintenance">Entretien général</option>
			<option value="other">Autre</option>
          </select>

          <input name="brand" required placeholder="Marque" className="w-full border p-3 rounded-lg" />
          <input name="model" required placeholder="Modèle" className="w-full border p-3 rounded-lg" />
          <input name="year" required placeholder="Année" className="w-full border p-3 rounded-lg" />

          <select name="preferredContact" required className="w-full border p-3 rounded-lg bg-white">
            <option value="">Moyen de communication préféré</option>
            <option value="email">Courriel</option>
            <option value="phone">Téléphone</option>
            <option value="text">Texto</option>
          </select>

          <textarea name="message" placeholder="Message (optionnel)" className="w-full border p-3 rounded-lg h-28" />

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
