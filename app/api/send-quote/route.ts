import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { garages } from '@/data/garages'
import fs from 'fs'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY!)

function normalizePostalCode(code: string) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 3)
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

    // Validation stricte
    if (!firstName || !lastName || !email || !phone || !service || !brand || !model || !year || !postalCode || !preferredContact) {
      return NextResponse.json(
        { error: isEN ? 'Missing data' : 'Données manquantes' },
        { status: 400 }
      )
    }

    const postalPrefix = normalizePostalCode(postalCode)

    const matchingGarages = garages.filter((garage) =>
      garage.postalCodes.includes(postalPrefix)
    )

    if (matchingGarages.length === 0) {
      return NextResponse.json(
        { message: isEN ? 'No garage found near you' : 'Aucun garage trouvé' },
        { status: 404 }
      )
    }

    // Préparer CSV
    const csvHeader = [
      'Date',
      'Client',
      'Email',
      'Phone',
      'Service',
      'Postal Code',
      'Message',
      'Garage Name',
      'Garage Email',
      'Status',
    ].join(',')

    const csvRows: string[] = [csvHeader]

    // Envoyer emails
    for (const garage of matchingGarages) {
      try {
        console.log('Sending email to:', garage.email)

        const result = await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: garage.email,
          subject: isEN ? 'New quote request' : 'Nouvelle demande de soumission',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <img src="https://soumissions-auto.ca/images/logo.png" alt="Soumissions Auto" style="max-width: 180px; margin-bottom: 20px;" />
              <h2>${isEN ? 'New quote request' : 'Nouvelle demande de soumission'}</h2>
              <p><strong>${isEN ? 'Client' : 'Client'}:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>${isEN ? 'Phone' : 'Téléphone'}:</strong> ${phone}</p>
              <p><strong>${isEN ? 'Preferred contact' : 'Communication préférée'}:</strong> ${preferredContact}</p>
              <p><strong>${isEN ? 'Service' : 'Service'}:</strong> ${service}</p>
              <p><strong>${isEN ? 'Vehicle' : 'Véhicule'}:</strong> ${brand} ${model} ${year}</p>
              <p><strong>${isEN ? 'Postal code' : 'Code postal'}:</strong> ${postalPrefix}</p>
              ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ''}
              <hr />
              <p style="font-size: 12px; color: #666;">Auto quote platform</p>
            </div>
          `,
        })

        console.log('Resend result:', result)

        // Ajouter au CSV
        const row = [
          new Date().toISOString(),
          firstName + ' ' + lastName,
          email,
          phone,
          service,
          postalPrefix,
          message ? `"${message}"` : '',
          garage.name,
          garage.email,
          'sent',
        ].join(',')

        csvRows.push(row)
      } catch (err) {
        console.error('EMAIL ERROR:', err)

        const row = [
          new Date().toISOString(),
          firstName + ' ' + lastName,
          email,
          phone,
          service,
          postalPrefix,
          message ? `"${message}"` : '',
          garage.name,
          garage.email,
          'failed',
        ].join(',')

        csvRows.push(row)
      }
    }

    // Enregistrer CSV localement (optionnel)
    const filePath = path.join(process.cwd(), 'quote_logs.csv')
    fs.writeFileSync(filePath, csvRows.join('\n'))
    console.log('CSV saved to:', filePath)

    return NextResponse.json({ success: true, garagesContacted: matchingGarages.length })
  } catch (err) {
    console.error('SERVER ERROR:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
