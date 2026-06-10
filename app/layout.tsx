import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'JZAI — AI-Powered Business Automation',
  description: 'Unify your customer conversations, automate workflows, and grow your business with JZAI — the AI platform built for modern teams.',
  keywords: ['AI chatbot', 'omnichannel inbox', 'business automation', 'WhatsApp AI', 'customer support AI'],
  authors: [{ name: 'JZAI' }],
  openGraph: {
    title: 'JZAI — AI-Powered Business Automation',
    description: 'Unify customer conversations across WhatsApp, Instagram, Email & more. One AI-powered inbox.',
    url: 'https://jzai.store',
    siteName: 'JZAI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JZAI — AI-Powered Business Automation',
    description: 'Unify customer conversations across WhatsApp, Instagram, Email & more.',
  },
  metadataBase: new URL('https://jzai.store'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
