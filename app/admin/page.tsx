'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Quote = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  postalCode: string
  service: string
  brand: string
  model: string
  year: string
  message: string
  garagesContacted: string[]
  created_at: string
}

export default function AdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuotes() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          setError(error.message)
          console.error(error)
        } else {
          setQuotes(data as Quote[])
        }
      } catch (err) {
        console.error(err)
        setError('Erreur lors du chargement des soumissions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  if (loading) return <p className="p-4">Chargement des soumissions...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Soumissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Téléphone</th>
              <th className="px-4 py-2 text-left">Code postal</th>
              <th className="px-4 py-2 text-left">Véhicule</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Garages contactés</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{q.id}</td>
                <td className="px-4 py-2">{q.firstName} {q.lastName}</td>
                <td className="px-4 py-2">{q.email}</td>
                <td className="px-4 py-2">{q.phone}</td>
                <td className="px-4 py-2">{q.postalCode}</td>
                <td className="px-4 py-2">{q.year} {q.brand} {q.model}</td>
                <td className="px-4 py-2">{q.service}</td>
                <td className="px-4 py-2">{q.message || '—'}</td>
                <td className="px-4 py-2">{q.garagesContacted.join(', ')}</td>
                <td className="px-4 py-2">{new Date(q.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
