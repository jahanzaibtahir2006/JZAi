'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const stats = [
  { num: 120, suffix: '+', label: 'Projects Delivered' },
  { num: 98, suffix: '%', label: 'Client Satisfaction' },
  { num: 6, suffix: '+', label: 'Years of Experience' },
  { num: 40, suffix: '+', label: 'Expert Engineers' },
]

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null)
  const animatedRef = useRef(false)

  useEffect(() => {
    if (!statsRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !animatedRef.current) {
            animatedRef.current = true
            document.querySelectorAll<HTMLElement>('.stat-count').forEach((el) => {
              const target = parseInt(el.dataset.target || '0', 10)
              animateNum(el, target)
            })
          }
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  function animateNum(el: HTMLElement, target: number) {
    let start: number | null = null
    const duration = 1800
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      el.textContent = String(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  return (
    <section className="hero" id="home">
      <div className="hero-bg"></div>
      <div className="grid-overlay"></div>
      <div className="hero-content">
        <div className="hero-eyebrow">AI-Powered Solutions</div>
        <h1>
          We Build the
          <span className="line-red">Future of Web</span>
          <span className="stroke-text">&amp; Intelligence.</span>
        </h1>
        <p className="hero-desc">
          Cutting-edge AI solutions and high-performance web development — engineered to transform
          your business into a digital powerhouse.
        </p>
        <div className="hero-actions">
          <Link href="/services" className="btn-primary">
            Explore Services <span className="btn-arrow">→</span>
          </Link>
          <a href="#contact" className="btn-ghost">Start a Project</a>
        </div>
        <div className="hero-stats" ref={statsRef}>
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">
                <span className="stat-count" data-target={s.num}>{s.num}</span>
                <span>{s.suffix}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
