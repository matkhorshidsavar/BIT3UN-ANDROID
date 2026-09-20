import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BitSun Exchange',
  description: 'BitSun Crypto Exchange'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#050505] text-white">
        {children}
      </body>
    </html>
  )
}
