import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import garages from '@/data/garages.json'

export async function POST(req: Request) {
  try {
    /* =========================
       VARIABLES D’ENV
    ========================= */
    if (
      !process.env.RESEND_API_KEY ||
      !process.env.SUPABASE_URL ||
      !process.env.SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        { success: false, message: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    // ⚠️ IMPORTANT : création du client ICI (pas au top-level)
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )

    const data = await req.json()
	console.log('DATA REÇUE:', data)

    /* =========================
       VALIDATION MINIMALE
    ========================= */
    if (!data.email || !data.postalCode) {
      return NextResponse.json(
        { success: false, message: 'Données invalides' },
        { status: 400 }
      )
    }

    /* =========================
       NORMALISATIONS
    ========================= */
    const postalCode = data.postalCode.replace(/\s/g, '').toUpperCase()
    const fsa = postalCode.substring(0, 3)

    const phone = data.phone
      ? data.phone.replace(/\D/g, '').replace(
          /^(\d{3})(\d{3})(\d{4})$/,
          '($1)-$2-$3'
        )
      : null

    /* =========================
       GARAGES PAR CODE POSTAL
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
            data.lang === 'en'
              ? 'Sorry, no garages were found near you.'
              : "Désolé, aucun garage n’a été trouvé près de chez vous.",
        },
        { status: 404 }
      )
    }

    /* =========================
       INSERT SUPABASE
    ========================= */
    const { error: insertError } = await supabase
      .from('quotes')
      .insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone,
          postal_code: postalCode,
          vehicle_year: data.year,
          vehicle_brand: data.brand,
          vehicle_model: data.model,
          service: data.service,
          message: data.message || null,
          language: data.lang || 'fr',
          garages_contacted: matchedGarages.map(g => g.name),
        },
      ])

    if (insertError) {
      console.error('Supabase insert error:', insertError)
      return NextResponse.json(
        { success: false, message: 'Erreur sauvegarde' },
        { status: 500 }
      )
    }

    /* =========================
       EMAIL GARAGES
    ========================= */
    const garageEmailHTML = `
      <div style="font-family:Arial,sans-serif;padding:24px">
        <h2>Nouvelle demande de soumission</h2>
        <p><strong>Client :</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${phone || '—'}</p>
        <p><strong>Code postal :</strong> ${postalCode}</p>
        <hr />
        <p><strong>Véhicule :</strong> ${data.year} ${data.brand} ${data.model}</p>
        <p><strong>Service :</strong> ${data.service}</p>
        <p><strong>Message :</strong><br/>${data.message || '—'}</p>
      </div>
    `

    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <onboarding@resend.dev>',
        to: garage.email,
        subject: `🛠️ Nouvelle soumission – ${data.brand} ${data.model}`,
        html: garageEmailHTML,
      })
    }

    /* =========================
       EMAIL CLIENT
    ========================= */
    const clientEmailHTML =
      data.lang === 'en'
        ? `
        <p>Hello ${data.firstName},</p>
        <p>Your quote request has been sent to garages near you.</p>
        <p>You will be contacted shortly.</p>
      `
        : `
        <p>Bonjour ${data.firstName},</p>
        <p>Votre demande a été envoyée à des garages près de chez vous.</p>
        <p>Vous serez contacté sous peu.</p>
      `

    await resend.emails.send({
      from: 'Soumissions Auto <onboarding@resend.dev>',
      to: data.email,
      subject:
        data.lang === 'en'
          ? 'Your quote request was sent'
          : 'Confirmation de votre demande',
      html: clientEmailHTML,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API send-quote error:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
