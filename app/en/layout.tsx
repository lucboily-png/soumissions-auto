import '../globals.css'
import Image from 'next/image'

export default function EnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <header className="p-4">
          <Image
            src="/images/logo-en.jpg"
            alt="Auto Quotes"
            width={200}
            height={60}
          />
        </header>

        {children}
      </body>
    </html>
  )
}
