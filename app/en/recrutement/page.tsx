import GarageRecruitmentForm from '@/components/GarageRecruitmentForm'

export default function RecrutementPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-center text-3xl font-bold">
        Are you a garage owner?
      </h1>

      <p className="mb-8 text-gray-700">
        Soumissions-Auto.ca helps garages receive requests from local customers
        who are ready to book an appointment.
        <br />
        Join our network and receive opportunities with no commitment.
      </p>

      {/* ✅ PAS DE PROP lang */}
      <GarageRecruitmentForm />
    </main>
  )
}
