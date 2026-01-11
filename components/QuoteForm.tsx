'use client'

import { useState } from 'react'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  postalCode: string
  service: string
  brand?: string
  model?: string
  year?: string
  message?: string
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  postalCode: '',
  service: '',
  brand: '',
  model: '',
  year: '',
  message: '',
}

export default function QuoteForm({ lang }: { lang: 'fr' | 'en' }) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'nogarage'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Met à jour le state du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 404) {
          setStatus('nogarage')
          return
        }
        throw new Error(data.error || 'Server error')
      }

      setStatus('success')
      setFormData(initialFormData)
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
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
        placeholder={lang === 'en' ? 'First Name' : 'Prénom'}
        className="w-full p-2 border rounded"
      />
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
        placeholder={lang === 'en' ? 'Last Name' : 'Nom'}
        className="w-full p-2 border rounded"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        placeholder={lang === 'en' ? 'Phone' : 'Téléphone'}
        className="w-full p-2 border rounded"
      />
      <input
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        required
        placeholder={lang === 'en' ? 'Postal Code' : 'Code postal'}
        className="w-full p-2 border rounded"
      />
      <input
        name="service"
        value={formData.service}
        onChange={handleChange}
        required
        placeholder={lang === 'en' ? 'Service needed' : 'Service demandé'}
        className="w-full p-2 border rounded"
      />
      <input
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        placeholder={lang === 'en' ? 'Car brand' : 'Marque'}
        className="w-full p-2 border rounded"
      />
      <input
        name="model"
        value={formData.model}
        onChange={handleChange}
        placeholder={lang === 'en' ? 'Model' : 'Modèle'}
        className="w-full p-2 border rounded"
      />
      <input
        name="year"
        value={formData.year}
        onChange={handleChange}
        placeholder={lang === 'en' ? 'Year' : 'Année'}
        className="w-full p-2 border rounded"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder={lang === 'en' ? 'Message (optional)' : 'Message (optionnel)'}
        className="w-full p-2 border rounded"
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        {status === 'sending'
          ? lang === 'en' ? 'Sending...' : 'Envoi...'
          : lang === 'en' ? 'Send' : 'Envoyer'}
      </button>

      {status === 'success' && (
        <p className="text-green-600 mt-2">
          {lang === 'en'
            ? 'Your quote request has been sent successfully! A garage will contact you shortly.'
            : 'Votre demande de soumission a été envoyée avec succès ! Un garage vous contactera sous peu.'}
        </p>
      )}

      {status === 'nogarage' && (
        <p className="text-orange-600 mt-2">
          {lang === 'en'
            ? 'No garage found for this postal code.'
            : 'Aucun garage trouvé pour ce code postal.'}
        </p>
      )}

      {status === 'error' && (
        <p className="text-red-600 mt-2">{errorMessage}</p>
      )}
    </form>
  )
}
