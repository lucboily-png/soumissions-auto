import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { garages } from '@/data/garages'

const resend = new Resend(process.env.RESEND_API_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function normalizePostalCode(code: string) {
  return code
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 3)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      firstName,
      lastName,
      email,
      phone,
      service,
      brand,
      model,
      year,
      message,
      postalCode,
      preferredContact,
      lang,
    } = body

    const isEN = lang === 'en'
    const postalPrefix = normalizePostalCode(postalCode)

    const matchingGarages = garages.filter((g) =>
      g.postalCodes.includes(postalPrefix)
    )

    if (matchingGarages.length === 0) {
      return NextResponse.json(
        { message: isEN ? 'No garage found' : 'Aucun garage trouvé' },
        { status: 404 }
      )
    }

    for (const garage of matchingGarages) {
      // 📧 Envoi email
      const emailResult = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: garage.email,
        subject: isEN
          ? 'New quote request'
          : 'Nouvelle demande de soumission',
        html: `
          <h2>Nouvelle demande</h2>
          <p><strong>Client:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Téléphone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Véhicule:</strong> ${brand} ${model} ${year}</p>
          <p><strong>Code postal:</strong> ${postalPrefix}</p>
          ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}
        `,
      })

      // 🧾 Log Supabase
      await supabase.from('quote_logs').insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        service,
        brand,
        model,
        year,
        message,
        postal_code: postalPrefix,
        garage_name: garage.name,
        garage_email: garage.email,
        status: emailResult.error ? 'error' : 'sent',
      })
    }

    return NextResponse.json(
      { success: true, garages: matchingGarages.length },
      { status: 200 }
    )
  } catch (err) {
    console.error('SEND QUOTE ERROR:', err)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
