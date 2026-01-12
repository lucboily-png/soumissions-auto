import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: Request) {
  // 🔐 Récupère les variables d'environnement
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.error("❌ Missing environment variables");
    return NextResponse.json(
      { error: 'Missing environment variables' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const resend = new Resend(resendKey);

  try {
    const body = await req.json();

    // 🔹 Support FR/EN
    const firstName = body.firstName || '';
    const lastName = body.lastName || '';
    const name = `${firstName} ${lastName}`.trim();

    const {
      email = '',
      phone = '',
      service = '',
      message = '',
      preferred_contact = '',
      language = 'FR',
    } = body;

    // ⚠️ Vérifie que le code postal est valide si nécessaire
    const postalCode = body.postalCode || '';

    // 1️⃣ Enregistrer dans Supabase
    const { error: dbError } = await supabase.from('quotes').insert([
      {
        name,
        email,
        phone,
        service,
        message,
        preferred_contact,
        language,
        postal_code: postalCode,
      },
    ]);

    if (dbError) {
      console.error("❌ Supabase error:", dbError.message);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 2️⃣ Envoyer email via Resend
    try {
      await resend.emails.send({
        from: 'Soumissions Auto <no-reply@soumissions-auto.ca>',
        to: ['luc.boily@hotmail.com'],
        subject: 'Nouvelle demande de soumission',
        html: `
          <h2>Nouvelle demande</h2>
          <p><strong>Nom:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Téléphone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong><br/>${message}</p>
          <p><strong>Code postal:</strong> ${postalCode}</p>
          <p><strong>Langue:</strong> ${language}</p>
        `,
      });
    } catch (emailErr) {
      console.error("❌ Resend error:", (emailErr as Error).message);
      // Ne bloque pas le succès Supabase
      return NextResponse.json(
        { warning: 'Quote saved but email failed', emailError: (emailErr as Error).message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Server error:", (err as Error).message);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
