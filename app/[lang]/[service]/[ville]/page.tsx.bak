import QuoteForm from "@/components/QuoteForm";

type PageProps = {
  params: {
    lang: string;
    service: string;
    ville: string;
  };
};

export default function Page({ params }: PageProps) {
  const lang: "fr" | "en" = params.lang === "en" ? "en" : "fr";
  const service = params.service.replace("-", " ");
  const ville = params.ville.replace("-", " ");

  return (
    <main>
      <h1>{lang === "en" ? `Get a quote for ${service} in ${ville}` : `Soumission de ${service} à ${ville}`}</h1>
      <QuoteForm lang={lang} />
    </main>
  );
}
