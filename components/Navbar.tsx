'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#process' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${scrolled
            ? 'glass border-b border-[var(--border-subtle)] py-3'
            : 'bg-transparent py-5'
          }
        `}
      >
        <div className="container flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="
              w-8 h-8 rounded-lg
              bg-[var(--brand-primary)]
              flex items-center justify-center
              shadow-[0_0_16px_rgba(108,99,255,0.5)]
              group-hover:shadow-[0_0_24px_rgba(108,99,255,0.7)]
              transition-shadow duration-200
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-700 text-lg tracking-tight text-[var(--text-primary)]">
              JZ<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="
                  px-4 py-2 rounded-lg
                  text-sm font-medium
                  text-[var(--text-secondary)]
                  hover:text-[var(--text-primary)]
                  hover:bg-[var(--bg-surface)]
                  transition-all duration-150
                "
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth" className="btn-ghost text-sm py-2 px-4">
              Sign in
            </Link>
            <Link href="/auth?tab=signup" className="btn-primary text-sm py-2 px-4">
              Get started free
            </Link>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="
                w-9 h-9 rounded-xl
                border border-[var(--border-default)]
                bg-[var(--bg-surface)]
                flex items-center justify-center
                text-[var(--text-secondary)]
                hover:text-[var(--text-primary)]
                transition-colors duration-150
              "
            >
              {mobileOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-300
          ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div className={`
          absolute top-0 right-0 bottom-0 w-72
          glass border-l border-[var(--border-subtle)]
          flex flex-col
          transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)]">
            <span className="font-display font-700 text-lg text-[var(--text-primary)]">
              JZ<span className="gradient-text">AI</span>
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <nav className="flex flex-col p-4 gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="
                  px-4 py-3 rounded-xl
                  text-sm font-medium
                  text-[var(--text-secondary)]
                  hover:text-[var(--text-primary)]
                  hover:bg-[var(--bg-surface)]
                  transition-all duration-150
                "
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="btn-ghost w-full justify-center text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/auth?tab=signup"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center text-sm"
            >
              Get started free
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
