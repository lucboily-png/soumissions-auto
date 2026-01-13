import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import garages from '@/data/garages.json'

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Email configuration missing' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const data = await req.json()

    if (!data.email || !data.postalCode) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      )
    }

    /* =========================
       POSTAL CODE (FSA)
    ========================= */
    const postalCode = data.postalCode.replace(/\s/g, '').toUpperCase()
    const fsa = postalCode.substring(0, 3)

    const matchedGarages = garages.filter(g =>
      g.postalCodes
        .map(pc =>
          pc.replace(/\s/g, '').toUpperCase().substring(0, 3)
        )
        .includes(fsa)
    )

    if (matchedGarages.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No garage found' },
        { status: 404 }
      )
    }

    /* =========================
       LANGUAGE
    ========================= */
    const isEN = data.lang === 'en'

    /* =========================
       EMAIL GARAGE
    ========================= */
    const garageEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px">
          <div style="background:#0f172a;color:#ffffff;padding:20px">
            <h2>${isEN ? 'New quote request' : 'Nouvelle demande de soumission'}</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p><strong>${isEN ? 'Name' : 'Nom'}:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>${isEN ? 'Phone' : 'Téléphone'}:</strong> ${data.phone}</p>
            <p><strong>${isEN ? 'Postal code' : 'Code postal'}:</strong> ${postalCode}</p>

            <hr />

            <p><strong>${isEN ? 'Vehicle' : 'Véhicule'}:</strong><br>
              ${data.year} ${data.brand} ${data.model}
            </p>

            <p><strong>${isEN ? 'Service requested' : 'Service demandé'}:</strong><br>
              ${data.service}
            </p>

            <p><strong>${isEN ? 'Preferred contact' : 'Contact préféré'}:</strong><br>
              ${data.preferredContact}
            </p>

            <p><strong>${isEN ? 'Message' : 'Message'}:</strong><br>
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
        subject: isEN
          ? `🛠️ New quote request – ${data.brand} ${data.model} ${data.year}`
          : `🛠️ Nouvelle demande – ${data.brand} ${data.model} ${data.year}`,
        html: garageEmailHTML,
      })
    }

    /* =========================
       EMAIL CLIENT
    ========================= */
    const clientEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px">
          <div style="background:#2563eb;color:#ffffff;padding:20px">
            <h2>${isEN ? 'Request sent successfully' : 'Demande envoyée avec succès'}</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p>${isEN ? 'Hello' : 'Bonjour'} ${data.firstName},</p>

            <p>
              ${
                isEN
                  ? 'Your quote request has been sent to local garages.'
                  : 'Votre demande a été transmise à des garages près de chez vous.'
              }
            </p>

            <p>
              ${
                isEN
                  ? 'A professional will contact you shortly.'
                  : 'Un professionnel communiquera avec vous sous peu.'
              }
            </p>

            <hr />

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
      subject: isEN
        ? 'Your auto repair quote request'
        : 'Confirmation de votre demande de soumission',
      html: clientEmailHTML,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
