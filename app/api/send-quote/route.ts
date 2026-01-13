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

    // ===================== Normalisation Code Postal =====================
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
          message: data.lang === 'en'
            ? 'No garage found near you.'
            : "Désolé, nous n'avons trouvé aucun garage près de chez-vous.",
        },
        { status: 404 }
      );
    }

    // ===================== Standardisation Téléphone =====================
    const rawPhone = data.phone || '';
    const digits = rawPhone.replace(/\D/g, '');
    if (digits.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }
    const formattedPhone = `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;

    // ===================== EMAIL GARAGE =====================
    const garageEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">
          <div style="background:#0f172a;color:#ffffff;padding:20px">
            <h2 style="margin:0">${data.lang === 'en' ? 'New Quote Request' : 'Nouvelle demande de soumission'}</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p><strong>${data.lang === 'en' ? 'Name' : 'Nom'}:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>${data.lang === 'en' ? 'Phone' : 'Téléphone'}:</strong> ${formattedPhone}</p>
            <p><strong>${data.lang === 'en' ? 'Postal code' : 'Code postal'}:</strong> ${postalCode}</p>

            <hr style="margin:16px 0" />

            <p><strong>${data.lang === 'en' ? 'Vehicle' : 'Véhicule'}:</strong><br>
              ${data.year} ${data.brand} ${data.model}
            </p>

            <p><strong>${data.lang === 'en' ? 'Service requested' : 'Service demandé'}:</strong><br>
              ${data.service}
            </p>

            <p><strong>${data.lang === 'en' ? 'Preferred contact' : 'Moyen de communication préféré'}:</strong><br>
              ${data.preferredContact}
            </p>

            <p><strong>${data.lang === 'en' ? 'Message' : 'Description'}:</strong><br>
              ${data.message || '—'}
            </p>
          </div>
        </div>
      </div>
    `;

    // Envoi aux garages
    for (const garage of matchedGarages) {
      await resend.emails.send({
        from: 'Soumissions Auto <onboarding@resend.dev>',
        to: garage.email,
        subject: `🛠️ ${data.lang === 'en' ? 'New Quote Request' : 'Nouvelle demande de soumission'} – ${data.brand} ${data.model} ${data.year}`,
        html: garageEmailHTML,
      });
    }

    // ===================== EMAIL CLIENT =====================
    const clientEmailHTML = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:24px">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">
          <div style="background:#2563eb;color:#ffffff;padding:20px">
            <h2 style="margin:0">${data.lang === 'en' ? 'Request sent successfully' : 'Demande envoyée avec succès'}</h2>
          </div>
          <div style="padding:20px;color:#111827">
            <p>${data.lang === 'en' ? `Hello ${data.firstName},` : `Bonjour ${data.firstName},`}</p>
            <p>${data.lang === 'en'
              ? 'Your quote request has been sent to garages near you.'
              : 'Votre demande de soumission a bien été transmise à des garages près de chez vous.'}</p>
            <p>${data.lang === 'en'
              ? 'A professional will contact you shortly according to your preferred contact method.'
              : 'Un professionnel communiquera avec vous sous peu selon votre préférence de contact.'}</p>
            <hr style="margin:16px 0" />
            <p style="font-size:14px;color:#6b7280">
              Soumissions Auto – ${data.lang === 'en' ? 'Connecting you with local garages.' : 'Mise en relation avec des garages locaux.'}
            </p>
          </div>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Soumissions Auto <onboarding@resend.dev>',
      to: data.email,
      subject: data.lang === 'en'
        ? 'Confirmation of your quote request'
        : 'Confirmation de votre demande de soumission',
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
