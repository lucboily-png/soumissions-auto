import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import garages from '@/data/garages.json'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Normalisation téléphone → (XXX)-XXX-XXXX
function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '').slice(0, 10)
  if (digits.length !== 10) return phone
  return `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6)}`
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    if (!data.email || !data.postalCode) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    /* =========================
       NORMALISATION
    ========================= */

    const postalCode = data.postalCode.replace(/\s/g, '').toUpperCase()
    const fsa = postalCode.substring(0, 3)
    const phoneFormatted = formatPhone(data.phone || '')
    const language = data.language === 'en' ? 'en' : 'fr'

    /* =========================
       MATCH GARAGES (FSA)
    ========================= */

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
            language === 'en'
              ? 'No garage found near you.'
              : "Aucun garage trouvé près de chez vous.",
        },
        { status: 404 }
      )
    }

    /* =========================
       INSERT SUPABASE (AVANT EMAIL)
    ========================= */

    const { error: insertError } = await supabase.from('quotes').insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: phoneFormatted,
      postal_code: fsa,
      service: data.service,
      language,
      garages_contacted: matchedGarages.map(g => g.name),
    })

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Erreur enregistrement' },
        { status: 500 }
      )
    }

    /* =========================
       EMAIL GARAGES
    ========================= */

    const garageEmailHTML = `
      <div style="font-family:Arial;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px">
          <div style="background:#0f172a;color:#fff;padding:20px">
            <h2>Nouvelle demande de soumission</h2>
          </div>
          <div style="padding:20px">
            <p><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email :</strong> ${data.email}</p>
            <p><strong>Téléphone :</strong> ${phoneFormatted}</p>
            <p><strong>Code postal :</strong> ${postalCode}</p>
            <hr />
            <p><strong>Véhicule :</strong><br>${data.year} ${data.brand} ${data.model}</p>
            <p><strong>Service :</strong><br>${data.service}</p>
            <p><strong>Message :</strong><br>${data.message || '—'}</p>
          </div>
        </div>
      </div>
    `

    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <no-reply@soumissions-auto.ca>',
        to: garage.email,
        subject: `🛠️ Nouvelle demande – ${data.brand} ${data.model}`,
        html: garageEmailHTML,
      })
    }

    /* =========================
       EMAIL CLIENT
    ========================= */

    const clientEmailHTML =
      language === 'en'
        ? `
        <h2>Your request has been sent</h2>
        <p>Hello ${data.firstName},</p>
        <p>Your request was sent to garages near you.</p>
        `
        : `
        <h2>Demande envoyée avec succès</h2>
        <p>Bonjour ${data.firstName},</p>
        <p>Votre demande a été transmise à des garages près de chez vous.</p>
        `

    await resend.emails.send({
      from: 'Soumissions Auto <no-reply@soumissions-auto.ca>',
      to: data.email,
      subject:
        language === 'en'
          ? 'Your quote request confirmation'
          : 'Confirmation de votre demande',
      html: clientEmailHTML,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
