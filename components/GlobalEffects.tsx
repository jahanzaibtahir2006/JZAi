'use client'
import { useEffect } from 'react'

export default function GlobalEffects() {
  useEffect(() => {
    // ── Mouse glow follow ──
    const glow = document.getElementById('mouse-glow')
    const onMove = (e: MouseEvent) => {
      if (!glow) return
      glow.style.left = e.clientX + 'px'
      glow.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', onMove)

    // ── Scroll reveal ──
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(el => {
          if (el.isIntersecting) {
            el.target.classList.add('visible')
            observer.unobserve(el.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    const revealEls = document.querySelectorAll('.sr, .section-enter')
    revealEls.forEach(el => observer.observe(el))

    return () => {
      window.removeEventListener('mousemove', onMove)
      observer.disconnect()
    }
  }, [])

  return (

    <>
      {/* Mouse glow */}
      <div id="mouse-glow" className="mouse-glow" />

      {/* Background blobs */}
      <div className="glow-blob glow-blob-1" />
      <div className="glow-blob glow-blob-2" />
      <div className="glow-blob glow-blob-3" />
    </>
  )
}
