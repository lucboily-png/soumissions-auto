'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Lang = 'fr' | 'en'
type Status = 'idle' | 'success' | 'notfound' | 'error'

 
const translations = {
  fr: {
    introTitle: 'Obtenez un rendez-vous rapidement avec un garage certifié près de chez vous.',
    introText:
      'Obtenez des soumissions de la part d’entreprises certifiées de votre région en remplissant notre formulaire en ligne.',

    formTitle: 'Demande de soumissions',

    confirmationTitle: '✔️ Demande envoyée avec succès',
    confirmationText:
      'Votre demande a été transmise à des garages près de chez vous. Un professionnel vous contactera sous peu.',

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
      'Silencieux',
      'Pare-brise',
      'Esthétique / peinture',
      'Carrosserie',
      'Diagnostic moteur',
      'Entretien général',
      'Lavage de voiture',
      'Autre',
    ],

    contactOptions: ['Courriel', 'Téléphone', 'Texto'],

    garageCtaTitle: 'Êtes-vous propriétaire d’un garage ?',
    garageCtaText:
      'Rejoignez notre réseau et recevez des demandes de clients sérieux, prêts à prendre rendez-vous.',
    garageCtaButton: 'En savoir plus',
  },

  en: {
    introTitle: 'Find the best garages near you in under 24 hours',
    introText:
      'Get quotes from certified businesses in your area by filling out our online form.',

    formTitle: 'Auto Repair Quote Request',

    confirmationTitle: '✔️ Request successfully sent',
    confirmationText:
      'Your request has been sent to garages near you. A professional will contact you shortly.',

    notfound: 'No garage found near you.',
    error: 'An error occurred. Please try again.',
    submit: 'Submit request',

    placeholders: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      postalCode: 'Postal code',
      service: 'Service type',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      preferredContact: 'Preferred contact method',
      message: 'Message (optional)',
    },

    serviceOptions: [
      'Oil change',
      'Tire change',
      'Brakes',
      'Suspension',
      'Alignment',
      'Muffler',
      'Windshield',
      'Detailing / paint',
      'Body',
      'Engine diagnostic',
      'General maintenance',
      'Car wash',
      'Other',
    ],

    contactOptions: ['Email', 'Phone', 'Text'],

    garageCtaTitle: 'Are you a garage owner?',
    garageCtaText:
      'Join our network and receive quote requests from serious local customers ready to book.',
    garageCtaButton: 'Get started',
  },
}

export default function QuoteForm({ lang = 'fr' }: { lang?: Lang }) {
	
	useEffect(() => {
    // Appel à l'API pour incrémenter le compteur à chaque visite
    fetch('/api/page-view', { method: 'POST' })
      .then(res => res.json())
      .then(data => console.log('Page views:', data.views))
      .catch(err => console.error('Page view error:', err))
  }, [])

  const t = translations[lang]
  const isEN = lang === 'en'

  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [loading, setLoading] = useState(false)
  

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    try {
      const formData = new FormData(e.currentTarget)
      formData.append('lang', lang)

      const res = await fetch('/api/send-quote', {
        method: 'POST',
        body: formData,
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
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-8">

		{/* Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src={isEN ? '/images/logosa.png' : '/images/logosa.png'}
          alt="Soumissions Auto"
          width={600}
          height={235}
          priority
        />
      </div>
	  
	   {/* Intro client */}
      <section className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-2xl font-bold mb-2">{t.introTitle}</h1>
      </section>
	  
	  	{/* Logo */}
      <div className="flex justify-center mb-12">
        <Image
          src={isEN ? '/images/logo-en.png' : '/images/logo-fr.png'}
          alt="Soumissions Auto"
          width={800}
          height={971}
          priority
        />
      </div>
	  
	   {/* Intro client */}
      <section className="max-w-2xl mx-auto mb-10 text-center">
        <p className="text-2xl font-bold text-gray-700">{t.introText}</p>
      </section>


      {/* Titre formulaire */}
      <h2 className="text-3xl font-bold mb-6 text-center">{t.formTitle}</h2>

      {/* Confirmation */}
      {status === 'success' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow text-center">
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            {t.confirmationTitle}
          </h3>
          <p className="text-gray-700">{t.confirmationText}</p>
        </div>
      )}

      {status !== 'success' && (
        <>
          {/* Formulaire */}
          <form
  ref={formRef}
  onSubmit={handleSubmit}
  encType="multipart/form-data"
  className="w-full max-w-2xl mx-auto space-y-5 bg-white p-8 rounded-2xl shadow-lg"
>

  {/* Prénom */}
  <div>
    <input
      name="firstName"
      required
      placeholder={t.placeholders.firstName}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Nom */}
  <div>
    <input
      name="lastName"
      required
      placeholder={t.placeholders.lastName}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Email */}
  <div>
    <input
      type="email"
      name="email"
      required
      placeholder={t.placeholders.email}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Téléphone */}
  <div>
    <input
      type="tel"
      name="phone"
      required
      placeholder={t.placeholders.phone}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Code postal */}
  <div>
    <input
      name="postalCode"
      required
      placeholder={t.placeholders.postalCode}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Service */}
  <div>
    <select
      name="service"
      required
      className="w-full border border-gray-300 rounded-xl p-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">{t.placeholders.service}</option>
      {t.serviceOptions.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  </div>

  {/* Marque */}
  <div>
    <input
      name="brand"
      required
      placeholder={t.placeholders.brand}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Modèle */}
  <div>
    <input
      name="model"
      required
      placeholder={t.placeholders.model}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Année */}
  <div>
    <input
      name="year"
      required
      placeholder={t.placeholders.year}
      className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Moyen de contact */}
  <div>
    <select
      name="preferredContact"
      required
      className="w-full border border-gray-300 rounded-xl p-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">{t.placeholders.preferredContact}</option>
      {t.contactOptions.map((c) => (
        <option key={c}>{c}</option>
      ))}
    </select>
  </div>

  {/* Message */}
  <div>
    <textarea
      name="message"
      placeholder={t.placeholders.message}
      className="w-full border border-gray-300 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Photos */}
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {isEN ? 'Add photos (optional – max 5)' : 'Ajouter des photos (optionnel – max 5)'}
    </label>

    <input
      type="file"
      name="photos"
      accept="image/*"
      multiple
      onChange={(e) => {
        const files = e.target.files
        if (!files) return
        if (files.length > 5) {
          alert(isEN ? 'Maximum 5 photos allowed' : 'Maximum 5 photos autorisées')
          e.target.value = ''
        }
      }}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:rounded-lg file:border-0
        file:bg-gray-100 file:px-4 file:py-2
        file:text-sm file:font-semibold
        hover:file:bg-gray-200"
    />
  </div>

  {/* Bouton */}
  <button
    type="submit"
    disabled={loading}
    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl text-lg transition"
  >
    {loading ? '...' : t.submit}
  </button>
</form>
          {/* CTA garages */}
          <section className="mt-16 max-w-3xl mx-auto rounded-2xl bg-gray-900 px-8 py-10 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">{t.garageCtaTitle}</h3>
            <p className="text-gray-300 mb-6">{t.garageCtaText}</p>

            <Link
              href={`/${lang}/recrutement`}
              className="inline-block rounded-xl bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-700"
            >
              {t.garageCtaButton}
            </Link>
          </section>
		  <p className="mt-10 text-center text-sm uppercase tracking-wide text-gray-400">
      Soumissions-Auto.ca • 2026
    </p>
        </>
      )}
    </div>
  )
}
