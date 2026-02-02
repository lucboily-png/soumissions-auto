import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  try {
    const data = await req.json()

    await resend.emails.send({
      from: 'Soumissions Auto <no-reply@soumissions-auto.ca>',
      to: 'luc.boily@gmail.com',
      subject: '🚗 Nouvelle demande – Garage partenaire',
      html: `
        <h2>Nouvelle demande de partenariat</h2>
        <p><strong>Nom du garage :</strong> ${data.garageName}</p>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
		<p><strong>Code Postal :</strong> ${data.postalcode}</p>
        <p><strong>Téléphone :</strong> ${data.phone}</p>
        <p><strong>Ville :</strong> ${data.city}</p>
        <p><strong>Message :</strong><br/>${data.message || '—'}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Email error' }, { status: 500 })
  }
}
