import { NextResponse } from 'next/server'
import { garages } from '@/data/garages'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const data = await req.json()

  const clientPostalPrefix = data.postalCode
    .toUpperCase()
    .replace(/\s/g, '')
    .slice(0, 3)

  const matchedGarages = garages.filter(
    g => g.postalCode === clientPostalPrefix
  )

  if (matchedGarages.length === 0) {
    return NextResponse.json(
      { error: 'Aucun garage trouvé pour ce code postal.' },
      { status: 404 }
    )
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  for (const garage of matchedGarages) {
    await transporter.sendMail({
      from: `"Soumission Auto" <${process.env.EMAIL_USER}>`,
      to: garage.email,
      subject: 'Nouvelle demande de soumission',
      html: `
        <h2>Nouvelle demande</h2>
        <p><strong>Nom :</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${data.phone}</p>
        <p><strong>Code postal :</strong> ${data.postalCode}</p>
        <p><strong>Service :</strong> ${data.serviceType}</p>
        <p><strong>Description :</strong><br/>${data.description}</p>
      `,
    })
  }

  return NextResponse.json({ success: true })
}
