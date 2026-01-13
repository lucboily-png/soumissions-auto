'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

type Status = 'idle' | 'success' | 'notfound' | 'error'

export default function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [loading, setLoading] = useState(false)

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    const parts = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
    if (!parts) return value
    return [
      parts[1] && `(${parts[1]})`,
      parts[2] && `-${parts[2]}`,
      parts[3] && `-${parts[3]}`,
    ].join('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

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

    try {
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* TEXTE INTRO H1 */}
      <h1 className="text-3xl font-bold text-center mb-4 max-w-xl mx-auto">
        Complétez ce formulaire et obtenez plusieurs soumissions de garages près
        de chez vous prêts à effectuer la réparation de votre véhicule.
      </h1>

      {/* LOGO */}
      <div className="flex justify-center mb-6">
        <Image
          src="/images/logo.png"
          alt="Soumissions Auto"
          width={220}
          height={90}
          priority
        />
      </div>

      {/* FORMULAIRE */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        {status === 'success' && (
          <div className="mb-4 bg-green-100 text-green-800 p-3 rounded text-center">
            Votre demande a été envoyée avec succès.
          </div>
        )}

        {status === 'notfound' && (
          <div className="mb-4 bg-red-100 text-red-800 p-3 rounded text-center">
            Aucun garage trouvé près de chez vous.
          </div>
        )}

        {status === 'error' && (
          <div className="mb-4 bg-yellow-100 text-yellow-800 p-3 rounded text-center">
            Une erreur est survenue. Veuillez réessayer.
          </div>
        )}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {[
            ['firstName', 'Prénom'],
            ['lastName', 'Nom'],
            ['email', 'Email', 'email'],
            ['postalCode', 'Code postal'],
            ['brand', 'Marque'],
            ['model', 'Modèle'],
            ['year', 'Année'],
          ].map(([name, placeholder, type]) => (
            <input
              key={name}
              name={name}
              type={type || 'text'}
              required
              placeholder={placeholder}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
          ))}

          <input
            name="phone"
            placeholder="Téléphone"
            required
            onChange={(e) => (e.target.value = formatPhone(e.target.value))}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />

          <select
            name="service"
            required
            className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            <option value="">Type de service</option>
            <option>Changement d’huile</option>
            <option>Changement de pneus</option>
            <option>Freins</option>
            <option>Diagnostic moteur</option>
            <option>Entretien général</option>
            <option>Autre</option>
          </select>

          <select
            name="preferredContact"
            required
            className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            <option value="">Moyen de communication préféré</option>
            <option>Courriel</option>
            <option>Téléphone</option>
            <option>Texto</option>
          </select>

          <textarea
            name="message"
            placeholder="Message (optionnel)"
            className="w-full border rounded-lg p-3 h-28 focus:ring-2 focus:ring-gray-400 focus:outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? '...' : 'Envoyer la demande'}
          </button>
        </form>
      </div>
    </div>
  )
}
