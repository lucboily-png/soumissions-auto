import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import garages from '@/data/garages.json'

export async function POST(req: Request) {
  try {
    // Vérification clé Resend
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Configuration email manquante' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const data = await req.json()

    // Validation minimale
    if (!data.email || !data.postalCode) {
      return NextResponse.json(
        { success: false, message: 'Données invalides' },
        { status: 400 }
      )
    }

    // Normalisation du code postal
    const postalCode = data.postalCode.replace(/\s/g, '').toUpperCase()

    // Recherche garages
    const matchedGarages = garages.filter(g =>
      g.postalCodes
        .map(pc => pc.replace(/\s/g, '').toUpperCase())
        .includes(postalCode)
    )

    // Aucun garage trouvé
    if (matchedGarages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Désolé, nous n'avons trouvé aucun garage près de chez-vous.",
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
            <h2 style="margin:0">Nouvelle demande de soumission</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email :</strong> ${data.email}</p>
            <p><strong>Téléphone :</strong> ${data.phone}</p>
            <p><strong>Code postal :</strong> ${postalCode}</p>

            <hr style="margin:16px 0" />

            <p><strong>Véhicule :</strong><br>
              ${data.year} ${data.brand} ${data.model}
            </p>

            <p><strong>Service demandé :</strong><br>
              ${data.serviceType}
            </p>

            <p><strong>Délai :</strong><br>
              ${data.urgency}
            </p>

            <p><strong>Description :</strong><br>
              ${data.description || '—'}
            </p>
          </div>
        </div>
      </div>
    `

    // Envoi aux garages
    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <onboarding@resend.dev>',
        to: garage.email,
        subject: `🛠️ Nouvelle demande de soumission – ${data.brand} ${data.model} ${data.year}`,
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
            <h2 style="margin:0">Demande envoyée avec succès</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p>Bonjour ${data.firstName},</p>

            <p>
              Votre demande de soumission a bien été transmise à des garages
              près de chez vous.
            </p>

            <p>
              Un professionnel communiquera avec vous sous peu selon votre
              préférence de contact.
            </p>

            <hr style="margin:16px 0" />

            <p style="font-size:14px;color:#6b7280">
              Soumissions Auto – Mise en relation avec des garages locaux.
            </p>
          </div>
        </div>
      </div>
    `

    await resend.emails.send({
      from: 'Soumissions Auto <onboarding@resend.dev>',
      to: data.email,
      subject: 'Confirmation de votre demande de soumission',
      html: clientEmailHTML,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur API submit:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
