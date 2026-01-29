"use client"; // nécessaire pour usePathname et useState

import QuoteForm from "@/components/QuoteForm";
import { usePathname } from "next/navigation";

type PageProps = {
  params?: {
    service?: string;
    ville?: string;
  };
};

export default function Page({ params }: PageProps) {
  // Récupère service et ville depuis l'URL
  const service = params?.service?.replace("-", " ") ?? "service inconnu";
  const ville = params?.ville?.replace("-", " ") ?? "ville inconnue";

  // Détection automatique de la langue via l'URL
  const pathname = usePathname() || "";
  const lang: 'fr' | 'en' = pathname.startsWith("/en") ? "en" : "fr";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* H1 dynamique selon la langue */}
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

      {/* Passe la langue à QuoteForm */}
      <QuoteForm lang={lang} />
    </main>
  );
}
