import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import garages from '@/data/garages.json'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: false, message: 'Configuration email manquante' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const data = await req.json()

    if (!data.email || !data.postalCode) {
      return NextResponse.json({ success: false, message: 'Données invalides' }, { status: 400 })
    }

    const postalCode = data.postalCode.replace(/\s/g, '').toUpperCase()
    const fsa = postalCode.substring(0, 3)

    // Recherche garages par FSA
    const matchedGarages = garages.filter(g =>
      g.postalCodes.map(pc => pc.replace(/\s/g, '').toUpperCase().substring(0, 3)).includes(fsa)
    )

    if (matchedGarages.length === 0) {
      return NextResponse.json({ success: false, message: "Aucun garage trouvé.", }, { status: 404 })
    }

    // Liste des emails de garages contactés
    const garagesEmails = matchedGarages.map(g => g.email)

    // ========================= EMAILS =========================
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
            <p><strong>Véhicule :</strong> ${data.year} ${data.brand} ${data.model}</p>
            <p><strong>Service demandé :</strong> ${data.service}</p>
            <p><strong>Description :</strong> ${data.message || '—'}</p>
          </div>
        </div>
      </div>
    `

    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <onboarding@resend.dev>',
        to: garage.email,
        subject: `🛠️ Nouvelle demande – ${data.brand} ${data.model} ${data.year}`,
        html: garageEmailHTML,
      })
    }

    const clientEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">
          <div style="background:#2563eb;color:#ffffff;padding:20px">
            <h2 style="margin:0">Demande envoyée avec succès</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p>Bonjour ${data.firstName},</p>
            <p>Votre demande a été transmise aux garages près de chez vous.</p>
            <p>Un professionnel communiquera avec vous selon votre préférence de contact.</p>
            <hr style="margin:16px 0" />
            <p style="font-size:14px;color:#6b7280">Soumissions Auto – Mise en relation avec des garages locaux.</p>
          </div>
        </div>
      </div>
    `
    await resend.emails.send({
      from: 'Soumissions Auto <onboarding@resend.dev>',
      to: data.email,
      subject: 'Confirmation de votre demande',
      html: clientEmailHTML,
    })

    // ========================= Enregistrement Supabase =========================
    await supabase.from('quotes').insert([
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        postalCode,
        service: data.service,
        brand: data.brand,
        model: data.model,
        year: data.year,
        message: data.message,
        garagesContacted: garagesEmails,
      },
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 })
  }
}
