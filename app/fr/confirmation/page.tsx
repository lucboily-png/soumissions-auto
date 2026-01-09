export default function ConfirmationFR() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-14 text-center">

        {/* ICÔNE */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 text-green-600 rounded-full w-20 h-20 flex items-center justify-center text-4xl">
            ✓
          </div>
        </div>

        {/* TITRE */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Demande envoyée avec succès
        </h1>

        {/* TEXTE */}
        <p className="text-gray-600 text-lg mb-8">
          Votre demande de soumission a été transmise aux garages situés près de
          votre code postal.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 text-left text-gray-700 mb-10">
          <ul className="space-y-3">
            <li>✔️ Des garages locaux analyseront votre demande</li>
            <li>✔️ Vous pourriez recevoir une ou plusieurs soumissions</li>
            <li>✔️ Délai habituel : <strong>24 à 48 heures</strong></li>
          </ul>
        </div>

        {/* CTA */}
        <a
          href="/fr"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-4 rounded-xl transition shadow-md"
        >
          Faire une autre demande
        </a>

      </div>
    </main>
  )
}
