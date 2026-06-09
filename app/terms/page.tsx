'use client'
import { useTheme } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const text = isDark ? '#e2e8f0' : '#1e293b'
  const muted = isDark ? '#94a3b8' : '#64748b'
  const bg = isDark ? '#0a0a0f' : '#ffffff'

  return (
    <div style={{ background: bg, minHeight: '100vh', color: text, fontFamily: 'var(--font-dm-sans)' }}>
      <Navbar />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '8rem 2rem 4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-syne)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Terms of Service
        </h1>
        <p style={{ color: muted, marginBottom: '3rem' }}>Last updated: May 2026</p>

        {[
          { title: '1. Acceptance of Terms', body: 'By accessing or using JZAI, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.' },
          { title: '2. Description of Service', body: 'JZAI provides an AI-powered chatbot builder that allows businesses to create, deploy, and manage chatbots on their websites for lead capture and customer support.' },
          { title: '3. Account Responsibility', body: 'You are responsible for maintaining the confidentiality of your account credentials. You are fully responsible for all activities that occur under your account.' },
          { title: '4. Free Trial', body: 'New users receive a 7-day free trial with 1 chatbot and 100 messages. After the trial period, the chatbot will be paused until you upgrade to a paid plan.' },
          { title: '5. Payment & Plans', body: 'Paid plans (Starter at $29/month, Pro at $79/month) are billed monthly. All payments are final. Refunds are not provided for partial months.' },
          { title: '6. Acceptable Use', body: 'You may not use JZAI for illegal activities, spamming, or any purpose that violates applicable laws. We reserve the right to suspend accounts that violate this policy.' },
          { title: '7. Data & Privacy', body: 'We collect only the data necessary to provide our service. Conversation data and leads collected through your chatbot are stored securely and accessible only to you.' },
          { title: '8. Service Availability', body: 'We aim for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for any losses resulting from service downtime.' },
          { title: '9. Termination', body: 'We reserve the right to terminate accounts that violate these terms. You may cancel your account at any time from your dashboard settings.' },
          { title: '10. Changes to Terms', body: 'We may update these terms at any time. Continued use of JZAI after changes constitutes acceptance of the new terms.' },
          { title: '11. Contact', body: 'For any questions about these terms, contact us at support@jzai.store' },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {section.title}
            </h2>
            <p style={{ color: muted, lineHeight: 1.8 }}>{section.body}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}
