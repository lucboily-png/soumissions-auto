'use client'
import { useState } from 'react'

export default function QuoteForm({ lang }: { lang: 'fr' | 'en' }) {
  const [status, setStatus] =
    useState<'idle' | 'sending' | 'success' | 'error' | 'nogarage'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    const form = e.currentTarget
    const formData = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.status === 404) {
        setStatus('nogarage')
        return
      }

      if (!res.ok) {
        throw new Error('Server error')
      }

      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        lang === 'en'
          ? 'An error occurred. Please try again.'
          : 'Une erreur est survenue. Veuillez réessayer.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="firstName" required placeholder={lang === 'en' ? 'First Name' : 'Prénom'} className="w-full p-2 border rounded" />
      <input name="lastName" required placeholder={lang === 'en' ? 'Last Name' : 'Nom'} className="w-full p-2 border rounded" />
      <input name="email" type="email" required placeholder="Email" className="w-full p-2 border rounded" />
      <input name="phone" required placeholder={lang === 'en' ? 'Phone' : 'Téléphone'} className="w-full p-2 border rounded" />
      <input name="postalCode" required placeholder={lang === 'en' ? 'Postal Code' : 'Code postal'} className="w-full p-2 border rounded" />
      <input name="service" required placeholder={lang === 'en' ? 'Service needed' : 'Service demandé'} className="w-full p-2 border rounded" />
      <input name="brand" placeholder={lang === 'en' ? 'Car brand' : 'Marque'} className="w-full p-2 border rounded" />
      <input name="model" placeholder={lang === 'en' ? 'Model' : 'Modèle'} className="w-full p-2 border rounded" />
      <input name="year" placeholder={lang === 'en' ? 'Year' : 'Année'} className="w-full p-2 border rounded" />
      <textarea name="message" placeholder={lang === 'en' ? 'Message (optional)' : 'Message (optionnel)'} className="w-full p-2 border rounded" />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {status === 'sending'
          ? lang === 'en' ? 'Sending...' : 'Envoi...'
          : lang === 'en' ? 'Send' : 'Envoyer'}
      </button>

      {status === 'success' && (
        <p className="text-green-600">
          {lang === 'en'
            ? 'Your request has been sent successfully. A garage will contact you shortly.'
            : 'Votre demande a été envoyée avec succès. Un garage vous contactera sous peu.'}
        </p>
      )}

      {status === 'nogarage' && (
        <p className="text-orange-600">
          {lang === 'en'
            ? 'No garage found for this postal code.'
            : 'Aucun garage trouvé pour ce code postal.'}
        </p>
      )}

      {status === 'error' && (
        <p className="text-red-600">{errorMessage}</p>
      )}
    </form>
  )
}
