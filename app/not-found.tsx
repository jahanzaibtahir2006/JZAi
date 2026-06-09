'use client'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

export default function NotFound() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark ? '#0a0a0f' : '#ffffff',
      color: isDark ? '#ffffff' : '#0a0a0f',
      fontFamily: 'var(--font-syne)',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <div style={{ fontSize: '7rem', fontWeight: 800, lineHeight: 1, color: '#7c3aed', marginBottom: '1rem' }}>
        404
      </div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        Page not found
      </h1>
      <p style={{ fontSize: '1rem', color: isDark ? '#64748b' : '#94a3b8', marginBottom: '2rem', maxWidth: '400px' }}>
        Yeh page exist nahi karta ya move ho gaya hai.
      </p>
      <Link href="/" style={{
        background: '#7c3aed',
        color: '#ffffff',
        padding: '0.75rem 2rem',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '1rem',
      }}>
        Go Home
      </Link>
    </div>
  )
}
