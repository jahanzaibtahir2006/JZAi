import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JZAI — Engineering Intelligence',
  description: 'Cutting-edge AI solutions and high-performance web development — engineered to transform your business into a digital powerhouse.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" id="favicon" />
      </head>
      <body className={`${syne.variable} ${dmSans.variable}`}>
        {children}
        <Script src="/Jzaichatbot.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
