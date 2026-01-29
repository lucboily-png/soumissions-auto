import QuoteForm from "@/components/QuoteForm";

type PageProps = {
  params?: {
    service?: string;
    ville?: string;
  };
};

// Génération du metadata SEO
export async function generateMetadata({ params }: PageProps) {
  const service = params?.service?.replace("-", " ") ?? "service inconnu";
  const ville = params?.ville?.replace("-", " ") ?? "ville inconnue";

  return {
    title: `Soumission ${service} à ${ville} | Soumissions Auto`,
    description: `Obtenez rapidement une soumission pour ${service} à ${ville}. Comparez des devis de garages locaux prêts à prendre rendez-vous.`,
  };
}

export default function Page({ params }: PageProps) {
  const service = params?.service?.replace("-", " ") ?? "service inconnu";
  const ville = params?.ville?.replace("-", " ") ?? "ville inconnue";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* H1 SEO */}
      <h1 className="text-3xl font-bold mb-4">
        Soumission de {service} à {ville}
      </h1>

      {/* Texte SEO court et clair */}
      <p className="mb-4">
        Vous cherchez une soumission pour <strong>{service}</strong> à{" "}
        <strong>{ville}</strong> ? Soumissions-Auto vous permet de recevoir
        rapidement plusieurs devis de garages locaux prêts à prendre rendez-vous.
      </p>

      <p className="mb-6">
        Complétez le formulaire ci-dessous et comparez facilement les propositions
        de garages situés dans votre secteur.
      </p>

      {/* Formulaire */}
      <QuoteForm />

      {/* FAQ SEO */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Questions fréquentes</h2>

        <p className="mb-2">
          <strong>Combien de temps pour recevoir une soumission ?</strong>
          <br />
          La plupart des garages répondent dans un délai de 24 heures.
        </p>

        <p className="mb-2">
          <strong>Est-ce gratuit pour les clients ?</strong>
          <br />
          Oui, le service est entièrement gratuit pour les clients.
        </p>

        <p>
          <strong>Quels garages me contactent ?</strong>
          <br />
          Des garages situés dans votre secteur, selon votre code postal.
        </p>
      </section>
    </main>
  );
}
