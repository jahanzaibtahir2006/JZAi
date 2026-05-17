'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const nav = document.getElementById('navbar')
      if (nav && !nav.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
          <Link href="/" className="nav-logo">JZ<span>AI</span></Link>
          <ThemeToggle />
        </div>
        <div className="nav-links">
          <Link href="/services">Services</Link>
          <a href="#process">Process</a>
          <a href="#about">About</a>
          <a href="#contact" className="nav-cta">Get in Touch</a>
        </div>
        <div className="nav-right">
          <button
            className="hamburger"
            id="hamburger"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileOpen(v => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`} id="mobileNav">
        <Link href="/services" onClick={() => setMobileOpen(false)}>Services</Link>
        <a href="#process" onClick={() => setMobileOpen(false)}>Process</a>
        <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMobileOpen(false)} style={{ color: 'var(--red)', fontWeight: 600 }}>
          Get in Touch
        </a>
      </div>
    </>
  )
}
