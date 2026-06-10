import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import GlobalEffects from '@/components/GlobalEffects'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: "JZAI — AI Chatbot Builder",
  description: "Build custom AI chatbots for your business in minutes. Capture leads automatically, support customers 24/7.",
  keywords: ["AI chatbot", "chatbot builder", "lead capture", "customer support", "AI assistant", "chatbot for website", "Pakistan"],
  metadataBase: new URL("https://jzai.store"),
  alternates: {
    canonical: "https://jzai.store",
  },
  openGraph: {
    type: "website",
    url: "https://jzai.store",
    siteName: "JZAI",
    title: "JZAI — AI Chatbot Builder",
    description: "Build custom AI chatbots for your business in minutes. Capture leads automatically, support customers 24/7.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JZAI — AI Chatbot Builder",
    description: "Build custom AI chatbots for your business in minutes. Capture leads automatically, support customers 24/7.",
  },
  robots: { index: true, follow: true },
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" id="favicon" />
      </head>
      <body className={`${syne.variable} ${dmSans.variable}`}>
        <ThemeProvider>
          <GlobalEffects />
          {children}
        </ThemeProvider>
        <Script id="chatbot-config" strategy="afterInteractive">
          {`var BACKEND_URL = 'https://small-wildflower-c0d4.jahanzaibtahir2006.workers.dev';`}
        </Script>
        <Script src="/Jzaichatbot.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
