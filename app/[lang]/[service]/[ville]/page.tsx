import QuoteForm from "@/components/QuoteForm";

type PageProps = {
  params: {
    lang: string;
    service: string;
    ville: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  const lang: "fr" | "en" = params.lang === "en" ? "en" : "fr";
  const service = params.service.replace("-", " ");
  const ville = params.ville.replace("-", " ");

  return {
    title:
      lang === "en"
        ? `Get a quote for ${service} in ${ville} | Soumissions Auto`
        : `Soumission ${service} à ${ville} | Soumissions Auto`,
    description:
      lang === "en"
        ? `Quickly get a quote for ${service} in ${ville} from local garages ready to book.`
        : `Obtenez rapidement une soumission pour ${service} à ${ville}. Comparez des devis de garages locaux prêts à prendre rendez-vous.`,
  };
}

export default function Page({ params }: PageProps) {
  const lang: "fr" | "en" = params.lang === "en" ? "en" : "fr";
  const service = params.service.replace("-", " ");
  const ville = params.ville.replace("-", " ");

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* H1 dynamique */}
      <h1 className="text-3xl font-bold mb-4">
        {lang === "en"
          ? `Get a quote for ${service} in ${ville}`
          : `Soumission de ${service} à ${ville}`}
      </h1>

      {/* Texte SEO */}
      <p className="mb-4">
        {lang === "en"
          ? "Use our service to quickly receive multiple quotes from local garages."
          : `Soumissions-Auto vous permet de recevoir rapidement plusieurs devis de garages locaux prêts à prendre rendez-vous.`}
      </p>

      {/* Formulaire bilingue */}
      <QuoteForm lang={lang} />

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">
          {lang === "en" ? "Frequently Asked Questions" : "Questions fréquentes"}
        </h2>

        <p className="mb-2">
          <strong>
            {lang === "en"
              ? "How long to receive a quote?"
              : "Combien de temps pour recevoir une soumission ?"}
          </strong>
          <br />
          {lang === "en"
            ? "Most garages respond within 24 hours."
            : "La plupart des garages répondent dans un délai de 24 heures."}
        </p>

        <p className="mb-2">
          <strong>
            {lang === "en" ? "Is it free for clients?" : "Est-ce gratuit pour les clients ?"}
          </strong>
          <br />
          {lang === "en" ? "Yes, it's completely free." : "Oui, le service est entièrement gratuit pour les clients."}
        </p>

        <p>
          <strong>
            {lang === "en" ? "Which garages will contact me?" : "Quels garages me contactent ?"}
          </strong>
          <br />
          {lang === "en"
            ? "Garages located in your area, based on your postal code."
            : "Des garages situés dans votre secteur, selon votre code postal."}
        </p>
      </section>
    </main>
  );
}
