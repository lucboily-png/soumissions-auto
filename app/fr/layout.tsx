import '../globals.css'
import Image from 'next/image'

export default function FrLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-100">
        <header className="p-4">
          <Image
            src="/images/logo-fr.png"
            alt="Soumissions Auto"
            width={200}
            height={60}
          />
        </header>

        {children}
      </body>
    </html>
  )
}
