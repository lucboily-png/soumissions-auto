import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import garages from '@/data/garages.json';

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseKey || !resendKey) {
    console.error("❌ Missing env vars");
    return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const resend = new Resend(resendKey);

  try {
    const data = await req.json();

    const firstName = data.firstName || '';
    const lastName = data.lastName || '';
    const name = `${firstName} ${lastName}`.trim();
    const {
      email = '',
      phone = '',
      postalCode = '',
      year = '',
      brand = '',
      model = '',
      serviceType = '',
      description = '',
      urgency = '',
      preferred_contact = '',
      language = 'FR',
    } = data;

    const normalizedPostal = postalCode.replace(/\s/g, '').toUpperCase();

    // Cherche garages
    const matchedGarages = garages.filter(g =>
      g.postalCodes.map(pc => pc.replace(/\s/g, '').toUpperCase())
        .includes(normalizedPostal)
    );

    if (matchedGarages.length === 0) {
      return NextResponse.json({
        success: false,
        message: language === 'EN'
          ? "Sorry, no garages found near your location."
          : "Désolé, nous n'avons trouvé aucun garage près de chez-vous."
      }, { status: 404 });
    }

    // 🔹 Enregistrement Supabase
    const { error: dbError } = await supabase.from('quotes').insert([{
      name,
      email,
      phone,
      postal_code: normalizedPostal,
      year,
      brand,
      model,
      service: serviceType,
      description,
      urgency,
      preferred_contact,
      language
    }]);

    if (dbError) {
      console.error("❌ Supabase error:", dbError.message);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 🔹 Email aux garages
    const garageEmailHTML = language === 'EN'
      ? `<div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
           <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden">
           <div style="background:#0f172a;color:#fff;padding:20px"><h2>New Quote Request</h2></div>
           <div style="padding:20px;color:#111827">
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Phone:</strong> ${phone}</p>
           <p><strong>Postal Code:</strong> ${normalizedPostal}</p>
           <hr/>
           <p><strong>Vehicle:</strong> ${year} ${brand} ${model}</p>
           <p><strong>Service:</strong> ${serviceType}</p>
           <p><strong>Urgency:</strong> ${urgency}</p>
           <p><strong>Description:</strong> ${description || '—'}</p>
           </div></div></div>`
      : `<div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
           <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden">
           <div style="background:#0f172a;color:#fff;padding:20px"><h2>Nouvelle demande de soumission</h2></div>
           <div style="padding:20px;color:#111827">
           <p><strong>Nom :</strong> ${name}</p>
           <p><strong>Email :</strong> ${email}</p>
           <p><strong>Téléphone :</strong> ${phone}</p>
           <p><strong>Code postal :</strong> ${normalizedPostal}</p>
           <hr/>
           <p><strong>Véhicule :</strong> ${year} ${brand} ${model}</p>
           <p><strong>Service :</strong> ${serviceType}</p>
           <p><strong>Délai :</strong> ${urgency}</p>
           <p><strong>Description :</strong> ${description || '—'}</p>
           </div></div></div>`;

    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <no-reply@soumissions-auto.ca>',
        to: garage.email,
        subject: language === 'EN'
          ? `🛠️ New Quote – ${brand} ${model} ${year}`
          : `🛠️ Nouvelle demande – ${brand} ${model} ${year}`,
        html: garageEmailHTML,
      });
    }

    // 🔹 Email au client
    const clientEmailHTML = language === 'EN'
      ? `<div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
           <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden">
           <div style="background:#2563eb;color:#fff;padding:20px"><h2>Request Sent Successfully</h2></div>
           <div style="padding:20px;color:#111827">
           <p>Hello ${firstName},</p>
           <p>Your quote request has been sent to garages near you.</p>
           <p>They will contact you soon according to your preferred method.</p>
           </div></div></div>`
      : `<div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
           <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden">
           <div style="background:#2563eb;color:#fff;padding:20px"><h2>Demande envoyée avec succès</h2></div>
           <div style="padding:20px;color:#111827">
           <p>Bonjour ${firstName},</p>
           <p>Votre demande a bien été transmise à des garages près de chez vous.</p>
           <p>Un professionnel communiquera avec vous selon votre préférence.</p>
           </div></div></div>`;

    await resend.emails.send({
      from: 'Soumissions Auto <no-reply@soumissions-auto.ca>',
      to: email,
      subject: language === 'EN'
        ? 'Quote Request Confirmation'
        : 'Confirmation de votre demande de soumission',
      html: clientEmailHTML,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Server error:', (err as Error).message);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
