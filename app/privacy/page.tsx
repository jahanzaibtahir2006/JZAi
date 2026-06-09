'use client'
import { useTheme } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ color: muted, marginBottom: '3rem' }}>Last updated: May 2026</p>

        {[
          { title: 'Information We Collect', body: 'We collect your name, email address, and company name at signup. We also collect chatbot conversation data and leads that your chatbot captures on your website.' },
          { title: 'How We Use Your Information', body: 'Your information is used to provide and improve our service, send transactional emails (password reset, plan updates), and display analytics in your dashboard.' },
          { title: 'Data Storage', body: 'All data is stored securely using Cloudflare D1 (SQLite). Your chatbot conversation and lead data is private and accessible only to you through your dashboard.' },
          { title: 'Third-Party Services', body: 'We use OpenAI to power AI responses in your chatbots. Conversation messages are sent to OpenAI for processing. We do not sell your data to any third parties.' },
          { title: 'Cookies', body: 'We use localStorage to store your theme preference and session data. We do not use tracking cookies or third-party advertising cookies.' },
          { title: 'Data Retention', body: 'Your data is retained as long as your account is active. If you delete your account, all associated data including chatbots, conversations, and leads will be permanently deleted.' },
          { title: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. Contact us at support@jzai.store to make a request.' },
          { title: 'Security', body: 'We use industry-standard security practices including encrypted connections (HTTPS) and hashed passwords. However, no system is 100% secure.' },
          { title: 'Children\'s Privacy', body: 'JZAI is not intended for children under 13. We do not knowingly collect data from children.' },
          { title: 'Contact Us', body: 'If you have any questions about this Privacy Policy, contact us at support@jzai.store' },
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
