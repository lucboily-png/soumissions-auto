import QuoteForm from "@/components/QuoteForm";

type PageProps = {
  params?: {
    service?: string;
    ville?: string;
  };
};

export default function Page({ params }: PageProps) {
  const service = params?.service?.replace("-", " ") ?? "service inconnu";
  const ville = params?.ville?.replace("-", " ") ?? "ville inconnue";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        Soumission de {service} à {ville}
      </h1>
      <QuoteForm />
    </main>
  );
}