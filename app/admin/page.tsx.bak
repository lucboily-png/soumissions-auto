import { supabase } from '@/lib/supabase'

export default async function AdminPage() {
  const { data: quotes, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-600">Erreur Supabase: {error.message}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard – Soumissions</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Nom</th>
            <th className="px-4 py-2 border-b">Téléphone</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Véhicule</th>
            <th className="px-4 py-2 border-b">Service</th>
            <th className="px-4 py-2 border-b">Code postal</th>
          </tr>
        </thead>
        <tbody>
          {quotes?.map(q => (
            <tr key={q.id} className="border-t">
              <td className="px-4 py-2">{new Date(q.created_at).toLocaleString()}</td>
              <td className="px-4 py-2">{q.first_name} {q.last_name}</td>
              <td className="px-4 py-2">{q.phone}</td>
              <td className="px-4 py-2">{q.email}</td>
              <td className="px-4 py-2">{q.brand} {q.model} {q.year}</td>
              <td className="px-4 py-2">{q.service}</td>
              <td className="px-4 py-2">{q.postal_code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
