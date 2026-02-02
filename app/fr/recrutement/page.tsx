import GarageRecruitmentForm from '@/components/GarageRecruitmentForm'

export default function RecrutementPage() {
  return (
    
	
<main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Vous êtes propriétaire d’un garage ?
      </h1>

      <p className="text-gray-700 mb-8">
        Soumissions-Auto.ca aide les garages à recevoir des demandes de clients
        locaux prêts à prendre rendez-vous.  
        Rejoignez notre réseau et recevez des opportunités sans engagement.
      </p>

      {/* ✅ PAS DE PROP lang */}
      <GarageRecruitmentForm />
    </main>
  )
}