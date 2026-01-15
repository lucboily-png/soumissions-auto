import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import garages from '@/data/garages.json'

/* ===============================
   ENV
================================ */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const resend = new Resend(process.env.RESEND_API_KEY!)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

/* ===============================
   POST
================================ */
export async function POST(req: Request) {
  try {
    const data = await req.json()

    /* -------------------------------
       Normalisation
    -------------------------------- */
    const postalCode = data.postalCode.replace(/\s/g, '').toUpperCase()
    const formattedPhone = data.phone?.replace(/\D/g, '') || null
    const lang = data.lang === 'en' ? 'en' : 'fr'
    const isEN = lang === 'en'

    /* -------------------------------
       Match garages
    -------------------------------- */
    const matchedGarages = garages.filter(g =>
      g.postalCodes.includes(postalCode)
    )

    if (matchedGarages.length === 0) {
      return NextResponse.json(
        { error: 'Aucun garage trouvé pour ce code postal.' },
        { status: 404 }
      )
    }

    /* -------------------------------
       EMAIL CONTENT
    -------------------------------- */
    const subject = isEN
      ? ' 🛠️ New Auto Quote Request'
      : '🛠️  Nouvelle demande de soumission auto'

    const htmlEmail = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#111">
          ${isEN ? 'New Quote Request' : 'Nouvelle demande de soumission'}
        </h2>

        <p><strong>${isEN ? 'Name' : 'Nom'} :</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>${isEN ? 'Phone' : 'Téléphone'} :</strong> ${data.phone}</p>
        <p><strong>${isEN ? 'Postal Code' : 'Code postal'} :</strong> ${postalCode}</p>
        <p><strong>${isEN ? 'Service' : 'Service'} :</strong> ${data.service}</p>

        <hr />

        <p><strong>${isEN ? 'Vehicle' : 'Véhicule'} :</strong></p>
        <ul>
          <li>${isEN ? 'Brand' : 'Marque'} : ${data.brand}</li>
          <li>${isEN ? 'Model' : 'Modèle'} : ${data.model}</li>
          <li>${isEN ? 'Year' : 'Année'} : ${data.year}</li>
        </ul>

        ${data.message ? `<p><strong>Message :</strong><br/>${data.message}</p>` : ''}
      </div>
    `

    /* -------------------------------
       SEND EMAILS
    -------------------------------- */
    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <no-reply@soumissions-auto.ca>',
        to: garage.email,
        subject,
        html: htmlEmail,
      })
    }

    /* -------------------------------
       INSERT SUPABASE
    -------------------------------- */
    const { error } = await supabase.from('quotes').insert([
      {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: formattedPhone,
        postal_code: postalCode,
        service: data.service,
        message: data.message || null,

        vehicle_brand: data.brand,
        vehicle_model: data.model,
        vehicle_year: data.year,

        language: lang,
        garages_contacted: matchedGarages.map(g => g.name),
      },
    ])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
