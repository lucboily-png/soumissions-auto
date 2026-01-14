import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import garages from '@/data/garages.json';

export async function POST(req: Request) {
  try {
    // Vérification clé Resend
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: 'Configuration email manquante' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await req.json();

    // Validation minimale
    if (!data.email || !data.postalCode) {
      return NextResponse.json(
        { success: false, message: 'Données invalides' },
        { status: 400 }
      );
    }

    // Normalisation du code postal (FSA)
    const postalCode = data.postalCode.replace(/\s/g, '').toUpperCase();
    const fsa = postalCode.substring(0, 3);

    // Recherche garages par FSA
    const matchedGarages = garages.filter(g =>
      g.postalCodes
        .map(pc => pc.replace(/\s/g, '').toUpperCase().substring(0, 3))
        .includes(fsa)
    );

    if (matchedGarages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Désolé, nous n'avons trouvé aucun garage près de chez-vous.",
        },
        { status: 404 }
      );
    }

    const isFR = data.lang === 'fr';

    /* =========================
       EMAIL GARAGE
    ========================= */
    const garageEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">
          <div style="background:${isFR ? '#0f172a' : '#0f172a'};color:#ffffff;padding:20px">
            <h2 style="margin:0">${isFR ? 'Nouvelle demande de soumission' : 'New Auto Repair Quote Request'}</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p><strong>${isFR ? 'Nom' : 'Name'} :</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>${isFR ? 'Téléphone' : 'Phone'}:</strong> ${data.phone}</p>
            <p><strong>${isFR ? 'Code postal' : 'Postal code'}:</strong> ${postalCode}</p>
            <hr style="margin:16px 0" />
            <p><strong>${isFR ? 'Véhicule' : 'Vehicle'}:</strong><br>
              ${data.year} ${data.brand} ${data.model}
            </p>
            <p><strong>${isFR ? 'Service demandé' : 'Requested service'}:</strong><br>
              ${data.service}
            </p>
            <p><strong>${isFR ? 'Message' : 'Message'}:</strong><br>
              ${data.message || '—'}
            </p>
          </div>
        </div>
      </div>
    `;

    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <onboarding@resend.dev>',
        to: garage.email,
        subject: `🛠️ ${isFR ? 'Nouvelle demande de soumission' : 'New Quote Request'} – ${data.brand} ${data.model} ${data.year}`,
        html: garageEmailHTML,
      });
    }

    /* =========================
       EMAIL CLIENT
    ========================= */
    const clientEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">
          <div style="background:${isFR ? '#2563eb' : '#2563eb'};color:#ffffff;padding:20px">
            <h2 style="margin:0">${isFR ? 'Demande envoyée avec succès' : 'Your request has been sent successfully'}</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p>${isFR ? `Bonjour ${data.firstName},` : `Hi ${data.firstName},`}</p>
            <p>${isFR ? 
              'Votre demande de soumission a bien été transmise à des garages près de chez vous.' : 
              'Your quote request has been successfully sent to local garages near you.'
            }</p>
            <p>${isFR ? 
              'Un professionnel communiquera avec vous sous peu selon votre préférence de contact.' : 
              'A professional will reach out to you shortly according to your preferred contact method.'
            }</p>
            <hr style="margin:16px 0" />
            <p style="font-size:14px;color:#6b7280">
              ${isFR ? 'Soumissions Auto – Mise en relation avec des garages locaux.' : 'Soumissions Auto – Connecting you with local garages.'}
            </p>
          </div>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Soumissions Auto <onboarding@resend.dev>',
      to: data.email,
      subject: isFR ? 'Confirmation de votre demande de soumission' : 'Quote Request Confirmation',
      html: clientEmailHTML,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur API submit:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
