import QuoteForm from '@/components/QuoteForm'

export default function Page({
  params,
}: {
  params: { service: string; ville: string }
}) {
  const { service, ville } = params

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
         {service}  {ville}
      </h1>

      <p className="mb-6">
        
        {service}  {ville}
      </p>

      <QuoteForm lang="fr" />
    </main>
  )
}
