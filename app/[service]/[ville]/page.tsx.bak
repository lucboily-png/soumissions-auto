import QuoteForm from "@/components/QuoteForm";
import { usePathname } from "next/navigation";

type PageProps = {
  params?: {
    service?: string;
    ville?: string;
  };
};

export default function Page({ params }: PageProps) {
  const service = params?.service?.replace("-", " ") ?? "service inconnu";
  const ville = params?.ville?.replace("-", " ") ?? "ville inconnue";

  // Détection automatique de la langue
  const pathname = usePathname() || "";
  const isEN = pathname.startsWith("/en"); // si URL commence par /en => anglais

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        {isEN
          ? `Get a quote for ${service} in ${ville}`
          : `Soumission de ${service} à ${ville}`}
      </h1>

      <p className="mb-4">
        {isEN
          ? `Use our service to quickly receive multiple quotes from local garages.`
          : `Soumissions-Auto vous permet de recevoir rapidement plusieurs devis de garages locaux.`}
      </p>

      <QuoteForm isEN={isEN} />
    </main>
  );
}
