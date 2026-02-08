import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const data = await req.json()

const { data: garage, error } = await supabase
  .from('garages')
  .insert({
    garage_name: data.garageName,
    name: data.name,
    email: data.email,
    phone: data.phone,
    city: data.city,
    postal_code: data.postalCode,
    message: data.message,
    lang: data.lang,
    payment_status: 'pending',
  })
  .select()
  .single()

    if (error) throw error
	


   // 2️⃣ Envoyer l’email (inchangé)
    await resend.emails.send({
      from: 'Soumissions Auto <no-reply@soumissions-auto.ca>',
      to: 'luc.boily@gmail.com',
      subject: '🚗 Nouvelle demande – Garage partenaire',
      html: `
        <h2>Nouvelle demande de partenariat</h2>
        <p><strong>Nom du garage :</strong> ${data.garageName}</p>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Code Postal :</strong> ${data.postalCode}</p>
        <p><strong>Téléphone :</strong> ${data.phone}</p>
        <p><strong>Ville :</strong> ${data.city}</p>
        <p><strong>Message :</strong><br/>${data.message || '—'}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}
