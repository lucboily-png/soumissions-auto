import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: Request) {
  // 🔐 ENV VARS (runtime only)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    return NextResponse.json(
      { error: 'Missing environment variables' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const resend = new Resend(resendKey);

  try {
    const body = await req.json();

    // 👉 adapte les champs si nécessaire
    const {
      name,
      email,
      phone,
      service,
      message,
      preferred_contact,
      language,
    } = body;

    // 1️⃣ Enregistrer dans Supabase
    const { error: dbError } = await supabase
      .from('quotes')
      .insert([
        {
          name,
          email,
          phone,
          service,
          message,
          preferred_contact,
          language,
        },
      ]);

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    // 2️⃣ Envoyer email
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
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
