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
    /* -------------------------------
       Récupération FormData
    -------------------------------- */
    const formData = await req.formData()
	const photos = formData.getAll('photos') as File[]
	
    const payload = {
      firstName: String(formData.get('firstName')),
      lastName: String(formData.get('lastName')),
      email: String(formData.get('email')),
      phone: normalizePhone(String(formData.get('phone'))),
      postalCode: String(formData.get('postalCode')),
      service: String(formData.get('service')),
      brand: String(formData.get('brand')),
      model: String(formData.get('model')),
      year: String(formData.get('year')),
      preferredContact: String(formData.get('preferredContact')),
      message: String(formData.get('message') || ''),
      lang: String(formData.get('lang') || 'fr'),
    }

    /* -------------------------------
       Gestion des photos
    -------------------------------- */
    const files = formData.getAll('photos') as File[]

    if (files.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 photos' },
        { status: 400 }
      )
    }

    const photoUrls: string[] = []

    for (const file of files) {
      if (!file || file.size === 0) continue

      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = `quotes/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('quote-photos')
        .upload(filePath, file)

      if (uploadError) {
        console.error(uploadError)
        continue
      }

      const { data } = await supabase.storage
        .from('quote-photos')
        .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 jours

      if (data?.signedUrl) {
        photoUrls.push(data.signedUrl)
      }
    }

    /* -------------------------------
       Normalisation
    -------------------------------- */
    const postalCode = payload.postalCode.replace(/\s/g, '').toUpperCase()
    const fsa = postalCode.substring(0, 3)
    const formattedPhone = payload.phone?.replace(/\D/g, '') || null
    const lang = payload.lang === 'en' ? 'en' : 'fr'
    const isEN = lang === 'en'

    /* -------------------------------
       Match garages par FSA
    -------------------------------- */
    const matchedGarages = garages.filter(garage =>
      garage.postalCodes.some(pc =>
        pc.replace(/\s/g, '').toUpperCase().substring(0, 3) === fsa
      )
    )

    if (matchedGarages.length === 0) {
      return NextResponse.json(
        { error: 'Aucun garage trouvé pour ce code postal.' },
        { status: 404 }
      )
    }

    /* -------------------------------
       Contenu email
    -------------------------------- */
    const subject = isEN
      ? '🛠️ New Auto Quote Request'
      : '🛠️ Nouvelle demande de soumission auto'

    const htmlEmail = `
  <div style="background:#f3f4f6;padding:24px;font-family:Arial,sans-serif">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:24px">

      <h2 style="margin-top:0;color:#1e40af">
        ${isEN ? '🛠️ New Auto Quote Request' : '🛠️ Nouvelle demande de soumission auto'}
      </h2>

      <p style="margin:8px 0"><strong>${isEN ? 'Name' : 'Nom'} :</strong> ${payload.firstName} ${payload.lastName}</p>
      <p style="margin:8px 0"><strong>Email :</strong> ${payload.email}</p>
      <p style="margin:8px 0"><strong>${isEN ? 'Phone' : 'Téléphone'} :</strong> ${payload.phone}</p>
      <p style="margin:8px 0"><strong>${isEN ? 'Postal Code' : 'Code postal'} :</strong> ${postalCode}</p>
      <p style="margin:8px 0"><strong>${isEN ? 'Service' : 'Service'} :</strong> ${payload.service}</p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb" />

      <h3 style="margin-bottom:8px;color:#111">
        ${isEN ? 'Vehicle information' : 'Informations sur le véhicule'}
      </h3>

      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:6px 0"><strong>${isEN ? 'Brand' : 'Marque'}</strong></td>
          <td>${payload.brand}</td>
        </tr>
        <tr>
          <td style="padding:6px 0"><strong>${isEN ? 'Model' : 'Modèle'}</strong></td>
          <td>${payload.model}</td>
        </tr>
        <tr>
          <td style="padding:6px 0"><strong>${isEN ? 'Year' : 'Année'}</strong></td>
          <td>${payload.year}</td>
        </tr>
      </table>

      ${payload.message ? `
        <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb" />
        <p><strong>${isEN ? 'Message from client' : 'Message du client'} :</strong><br/>
        ${payload.message}</p>
      ` : ''}

      ${photoUrls.length > 0 ? `
        <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb" />
        <p><strong>${isEN ? 'Attached photos' : 'Photos jointes'} :</strong></p>
        <ul>
          ${photoUrls
            .map(
              (url, i) =>
                `<li><a href="${url}" target="_blank">📷 ${isEN ? 'Photo' : 'Photo'} ${i + 1}</a></li>`
            )
            .join('')}
        </ul>
      ` : ''}

      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />

      <p style="font-size:12px;color:#6b7280;text-align:center">
        Soumissions-Auto.ca<br/>
        ${isEN
          ? 'This request was sent automatically.'
          : 'Cette demande a été transmise automatiquement.'}
      </p>

    </div>
  </div>
`


    /* -------------------------------
       Envoi des emails
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
       Insert Supabase
    -------------------------------- */
    const { error } = await supabase.from('quotes').insert([
      {
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        phone: formattedPhone,
        postal_code: postalCode,
        service: payload.service,
        message: payload.message || null,

        vehicle_brand: payload.brand,
        vehicle_model: payload.model,
        vehicle_year: payload.year,

        language: lang,
        garages_contacted: matchedGarages.map(g => g.name),
        photo_urls: photoUrls.length ? photoUrls : null,
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

/* ===============================
   Helper functions
================================ */
function normalizePhone(phone: string) {
  return phone.replace(/\D/g, '')
}
