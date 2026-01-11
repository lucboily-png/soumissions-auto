'use client'
import { useState } from 'react'

export default function QuoteForm({ lang }: { lang: 'fr' | 'en' }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'nogarage'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
  e.preventDefault()

  setLoading(true)
  setError('')
  setSuccess('')

  try {
    const res = await fetch('/api/send-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (!res.ok) {
      // ❌ Aucun garage trouvé
      if (res.status === 404) {
        setError(
          lang === 'en'
            ? 'No garage found for this postal code.'
            : 'Aucun garage trouvé pour ce code postal.'
        )
        return
      }

      // ❌ Autre erreur
      throw new Error(data.error || 'Server error')
    }

    // ✅ SUCCÈS
    setSuccess(
      lang === 'en'
        ? 'Your request has been sent successfully. A garage will contact you shortly.'
        : 'Votre demande a été envoyée avec succès. Un garage vous contactera sous peu.'
    )

    setFormData(initialState)
  } catch (err) {
    setError(
      lang === 'en'
        ? 'An error occurred. Please try again.'
        : 'Une erreur est survenue. Veuillez réessayer.'
    )
  } finally {
    setLoading(false)
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
      <textarea name="message" placeholder={lang === 'en' ? 'Message (optional)' : 'Message (optionnel)'} className="w-full p-2 border rounded"></textarea>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        {status === 'sending'
          ? lang === 'en'
            ? 'Sending...'
            : 'Envoi...'
          : lang === 'en'
          ? 'Send'
          : 'Envoyer'}
      </button>

      {status === 'success' && (
        <p className="text-green-600 mt-2">
          {lang === 'en'
            ? 'Your quote request has been sent successfully!'
            : 'Votre demande de soumission a été envoyée avec succès !'}
        </p>
      )}

      {status === 'nogarage' && (
        <p className="text-orange-600 mt-2">
          {lang === 'en' ? 'No garage found for this postal code.' : 'Aucun garage trouvé pour ce code postal.'}
        </p>
      )}

      {status === 'error' && (
        <p className="text-red-600 mt-2">{errorMessage}</p>
      )}
    </form>
  )
}
