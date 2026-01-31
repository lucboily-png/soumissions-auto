import '../globals.css'

export default function FrLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  )
}
