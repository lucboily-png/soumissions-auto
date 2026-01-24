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
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#111">
          ${isEN ? 'New Quote Request' : 'Nouvelle demande de soumission'}
        </h2>

        <p><strong>${isEN ? 'Name' : 'Nom'} :</strong> ${payload.firstName} ${payload.lastName}</p>
        <p><strong>Email :</strong> ${payload.email}</p>
        <p><strong>${isEN ? 'Phone' : 'Téléphone'} :</strong> ${payload.phone}</p>
        <p><strong>${isEN ? 'Postal Code' : 'Code postal'} :</strong> ${postalCode}</p>
        <p><strong>${isEN ? 'Service' : 'Service'} :</strong> ${payload.service}</p>

        <p><strong>${isEN ? 'Vehicle' : 'Véhicule'} :</strong></p>
        <ul>
          <li>${isEN ? 'Brand' : 'Marque'} : ${payload.brand}</li>
          <li>${isEN ? 'Model' : 'Modèle'} : ${payload.model}</li>
          <li>${isEN ? 'Year' : 'Année'} : ${payload.year}</li>
        </ul>

        ${payload.message ? `<p><strong>Message :</strong><br/>${payload.message}</p>` : ''}

        ${photoUrls.length > 0 ? `
          <h3>Photos jointes</h3>
          <ul>
            ${photoUrls.map((url, i) => `<li><a href="${url}" target="_blank">Photo ${i + 1}</a></li>`).join('')}
          </ul>
        ` : ''}
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
