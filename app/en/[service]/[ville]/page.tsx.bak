import QuoteForm from "@/components/QuoteForm";

type PageProps = {
  params?: {
    service?: string;
    ville?: string;
  };
};

export default function Page({ params }: PageProps) {
  const service = params?.service?.replace("-", " ") ?? "unknown service";
  const ville = params?.ville?.replace("-", " ") ?? "unknown city";

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        Get a quote for {service} in {ville}
      </h1>
      <QuoteForm />
    </main>
  );
}
