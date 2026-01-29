"use client";

import QuoteForm from "@/components/QuoteForm";

type PageProps = {
  params: {
    lang: string;
    service: string;
    ville: string;
  };
};

export default function Page({ params }: PageProps) {
  const lang: 'fr' | 'en' = params.lang === "en" ? "en" : "fr";
  const service = params.service.replace("-", " ");
  const ville = params.ville.replace("-", " ");

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        {lang === "en"
          ? `Get a quote for ${service} in ${ville}`
          : `Soumission de ${service} à ${ville}`}
      </h1>

      <p className="mb-4">
        {lang === "en"
          ? "Use our service to quickly receive multiple quotes from local garages."
          : "Soumissions-Auto vous permet de recevoir rapidement plusieurs devis de garages locaux."}
      </p>

      <QuoteForm lang={lang} />
    </main>
  );
}
