import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import garages from '@/data/garages.json'

/* =========================
   LABELS
========================= */

const SERVICE_LABELS = {
  fr: {
    oil_change: "Changement d’huile",
    tire_change: "Changement de pneus",
    brakes: "Freins",
    suspension: "Suspension",
    alignment: "Alignement",
    engine_diagnostic: "Diagnostic moteur",
    maintenance: "Entretien général",
    other: "Autre",
  },
  en: {
    oil_change: "Oil change",
    tire_change: "Tire change",
    brakes: "Brakes",
    suspension: "Suspension",
    alignment: "Alignment",
    engine_diagnostic: "Engine diagnostic",
    maintenance: "General maintenance",
    other: "Other",
  },
}

const CONTACT_LABELS = {
  fr: {
    email: "Courriel",
    phone: "Téléphone",
    sms: "Texto",
  },
  en: {
    email: "Email",
    phone: "Phone",
    sms: "Text message",
  },
}

/* =========================
   API
========================= */

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Configuration email manquante' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const data = await req.json()

    if (!data.email || !data.postalCode) {
      return NextResponse.json(
        { success: false, message: 'Données invalides' },
        { status: 400 }
      )
    }

    /* =========================
       LANG
    ========================= */

    const lang: 'fr' | 'en' = data.lang === 'en' ? 'en' : 'fr'

    const serviceLabel =
      SERVICE_LABELS[lang][data.service] || data.service

    const contactLabel =
      CONTACT_LABELS[lang][data.preferredContact] || data.preferredContact

    /* =========================
       POSTAL CODE (FSA)
    ========================= */

    const postalCode = data.postalCode.replace(/\s/g, '').toUpperCase()
    const fsa = postalCode.substring(0, 3)

    const matchedGarages = garages.filter(g =>
      g.postalCodes
        .map(pc => pc.replace(/\s/g, '').toUpperCase().substring(0, 3))
        .includes(fsa)
    )

    if (matchedGarages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            lang === 'en'
              ? 'No garage found near you.'
              : "Désolé, nous n'avons trouvé aucun garage près de chez-vous.",
        },
        { status: 404 }
      )
    }

    /* =========================
       EMAIL GARAGE
    ========================= */

    const garageEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">
          <div style="background:#0f172a;color:#ffffff;padding:20px">
            <h2 style="margin:0">
              ${lang === 'en' ? 'New quote request' : 'Nouvelle demande de soumission'}
            </h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p><strong>${lang === 'en' ? 'Name' : 'Nom'} :</strong>
              ${data.firstName} ${data.lastName}
            </p>
            <p><strong>Email :</strong> ${data.email}</p>
            <p><strong>${lang === 'en' ? 'Phone' : 'Téléphone'} :</strong> ${data.phone}</p>
            <p><strong>${lang === 'en' ? 'Postal code' : 'Code postal'} :</strong> ${postalCode}</p>

            <hr style="margin:16px 0" />

            <p><strong>${lang === 'en' ? 'Vehicle' : 'Véhicule'} :</strong><br>
              ${data.year} ${data.brand} ${data.model}
            </p>

            <p><strong>${lang === 'en' ? 'Service requested' : 'Service demandé'} :</strong><br>
              ${serviceLabel}
            </p>

            <p><strong>${lang === 'en' ? 'Preferred contact' : 'Moyen de communication'} :</strong><br>
              ${contactLabel}
            </p>

            <p><strong>${lang === 'en' ? 'Message' : 'Description'} :</strong><br>
              ${data.message || '—'}
            </p>
          </div>
        </div>
      </div>
    `

    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <onboarding@resend.dev>',
        to: garage.email,
        subject:
          lang === 'en'
            ? `🛠️ New quote – ${data.brand} ${data.model} ${data.year}`
            : `🛠️ Nouvelle soumission – ${data.brand} ${data.model} ${data.year}`,
        html: garageEmailHTML,
      })
    }

    /* =========================
       EMAIL CLIENT
    ========================= */

    const clientEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">
          <div style="background:#2563eb;color:#ffffff;padding:20px">
            <h2 style="margin:0">
              ${lang === 'en'
                ? 'Request sent successfully'
                : 'Demande envoyée avec succès'}
            </h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p>
              ${lang === 'en'
                ? `Hello ${data.firstName},`
                : `Bonjour ${data.firstName},`}
            </p>

            <p>
              ${lang === 'en'
                ? 'Your request has been sent to garages near you.'
                : 'Votre demande de soumission a bien été transmise à des garages près de chez vous.'}
            </p>

            <p>
              ${lang === 'en'
                ? 'A professional will contact you shortly.'
                : 'Un professionnel communiquera avec vous sous peu.'}
            </p>

            <hr style="margin:16px 0" />

            <p style="font-size:14px;color:#6b7280">
              Soumissions Auto
            </p>
          </div>
        </div>
      </div>
    `

    await resend.emails.send({
      from: 'Soumissions Auto <onboarding@resend.dev>',
      to: data.email,
      subject:
        lang === 'en'
          ? 'Quote request confirmation'
          : 'Confirmation de votre demande de soumission',
      html: clientEmailHTML,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur API send-quote:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
