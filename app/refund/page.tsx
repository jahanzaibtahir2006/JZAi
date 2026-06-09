'use client'
import { useTheme } from '@/components/ThemeProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
export default function RefundPage() {
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
          Refund Policy
        </h1>
        <p style={{ color: muted, marginBottom: '3rem' }}>Last updated: May 2026</p>
        {[
          { title: '1. Free Trial', body: 'All new users receive a 7-day free trial with no credit card required. We encourage you to fully explore JZAI during this period before subscribing to a paid plan.' },
          { title: '2. Subscription Payments', body: 'JZAI offers monthly subscription plans (Starter at $29/month, Pro at $79/month). All payments are processed securely through Paddle.' },
          { title: '3. Refund Eligibility', body: 'If you are not satisfied with JZAI, you may request a full refund within 7 days of your first payment. Refund requests made after 7 days of the billing date will not be eligible.' },
          { title: '4. How to Request a Refund', body: 'To request a refund, email us at support@jzai.store with your account email and reason for the refund. We will process eligible refunds within 5-7 business days.' },
          { title: '5. Non-Refundable Cases', body: 'Refunds will not be issued for: partial months of service, accounts suspended due to Terms of Service violations, or requests made after the 7-day refund window.' },
          { title: '6. Cancellation', body: 'You may cancel your subscription at any time from your dashboard settings. Cancellation stops future billing but does not automatically trigger a refund for the current billing period.' },
          { title: '7. Plan Downgrades', body: 'If you downgrade from Pro to Starter, the change takes effect at the start of your next billing cycle. No partial refunds are issued for downgrades mid-cycle.' },
          { title: '8. Contact Us', body: 'For any refund-related questions, contact us at support@jzai.store and we will respond within 24-48 hours.' },
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
