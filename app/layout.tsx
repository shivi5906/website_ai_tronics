import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'AI-TRONICS | Enter The Society',
  description: 'AI-TRONICS - A movement of minds building the future. AI, Robotics, ML, Embedded Systems, Neural Networks & Automation. JIIT, Noida.',
  keywords: ['AI', 'Robotics', 'Machine Learning', 'JIIT', 'Tech Hub', 'AI-TRONICS'],
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} bg-[#0a0a0a]`}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-[#f5f5dc] overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
