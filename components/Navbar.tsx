'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import Image from 'next/image'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleFaqClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === '/pricing') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/#faq')
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('jzai_user'))
  }, [pathname])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const nav = document.getElementById('navbar')
      if (nav && !nav.contains(e.target as Node)) setMobileOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      <style>{`
        .nav-cta-new {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 40px;
          background: var(--red);
          color: #fff !important;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-decoration: none !important;
          border: none;
          box-shadow: 0 0 14px rgba(232,25,60,0.45), 0 0 28px rgba(232,25,60,0.18);
          transition: box-shadow 0.3s, transform 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .nav-cta-new:hover {
          background: var(--red-dark);
          box-shadow: 0 0 22px rgba(232,25,60,0.65), 0 0 44px rgba(232,25,60,0.28);
          transform: translateY(-1px);
          color: #fff !important;
        }
      `}</style>

      <nav id="navbar" className={scrolled ? 'scrolled' : ''} style={{ opacity: 0, animation: 'fadeUp 0.6s ease 0.1s forwards' }}>
        {/* LEFT — Logo + Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <Link href="/" className="nav-logo">JZ<span>AI</span></Link>
          <div className="nav-links">
            <a href={pathname === '/' ? '#process' : '/#process'}>Process</a>
            <Link href="/pricing">Pricing</Link>
            <a href="#faq" onClick={handleFaqClick} style={{ cursor: 'pointer' }}>FAQ</a>
          </div>

        </div>

        {/* RIGHT */}
        <div className="nav-right">
          {loggedIn ? (
            <Link href="/dashboard" style={{
              color: 'var(--text2)', fontWeight: 500,
              fontSize: '14px', textDecoration: 'none'
            }}>Dashboard</Link>
          ) : (
            <Link href="/auth" style={{
              color: 'var(--text2)', fontWeight: 500,
              fontSize: '14px', textDecoration: 'none'
            }}>Login</Link>
          )}
          <Link href="/create-chatbot" className="nav-cta-new">
            ✦ Create Chatbot
          </Link>
          <ThemeToggle />
          <button
            className="hamburger"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileOpen(v => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        <a href={pathname === '/' ? '#process' : '/#process'} onClick={() => setMobileOpen(false)}>Process</a>
        <Link href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
        <a href="#faq" onClick={(e) => { handleFaqClick(e); setMobileOpen(false); }} style={{ cursor: 'pointer' }}>FAQ</a>
        {loggedIn ? (
          <Link href="/dashboard" onClick={() => setMobileOpen(false)}
            style={{ color: 'var(--text2)', fontWeight: 500 }}>
            Dashboard
          </Link>
        ) : (
          <Link href="/auth" onClick={() => setMobileOpen(false)}
            style={{ color: 'var(--text2)', fontWeight: 500 }}>
            Login
          </Link>
        )}
        <Link href="/create-chatbot" onClick={() => setMobileOpen(false)}
          className="nav-cta-new" style={{ textAlign: 'center' }}>
          ✦ Create Chatbot
        </Link>
      </div>
    </>
  )
}
