'use client'
import ScrollReveal from './ScrollReveal'
import { useEffect, useRef, useState } from 'react'

const benefits = [
  {
    ico: '⚡', title: 'Blazing Fast Delivery',
    desc: 'Agile sprints with weekly milestones. We ship faster without compromising quality — because your time is your biggest asset.',
  },
  {
    ico: '🎯', title: 'Precision Engineering',
    desc: "Every line of code, every model parameter is optimized. We don't just build — we craft with obsessive attention to detail.",
  },
  {
    ico: '🔒', title: 'Enterprise-Grade Security',
    desc: 'Security-first architecture with end-to-end encryption, compliance standards, and proactive vulnerability monitoring.',
  },
  {
    ico: '📈', title: 'Scalable Architecture',
    desc: 'Systems built to grow. From startup MVP to millions of users — our infrastructure scales effortlessly with your success.',
  },
]

const stats = [
  { value: 20, suffix: '+', label: 'Projects Delivered' },
  { value: 15, suffix: '+', label: 'Happy Clients' },
  { value: 100, suffix: '%', label: 'Client Satisfaction' },
  { value: 24, suffix: '/7', label: 'Support Available' },
]

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function StatCard({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCountUp(value, 1600, start)
  return (
    <div className="stat-card">
      <div className="stat-card-num">
        {count}<span className="stat-card-suffix">{suffix}</span>
      </div>
      <div className="stat-card-label">{label}</div>
    </div>
  )
}

export default function WhyUs() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .why-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
          margin-bottom: 2px;
        }
        .stat-card {
          background: var(--card-bg);
          padding: 36px 28px;
          border: 1px solid var(--border);
          transition: border-color 0.3s, background var(--transition-theme), transform 0.2s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--red-dim), transparent);
          opacity: 0; transition: opacity 0.4s;
        }
        .stat-card:hover { border-color: var(--border2); transform: translateY(-3px); }
        .stat-card:hover::before { opacity: 1; }
        .stat-card-num {
          font-family: 'Syne', sans-serif;
          font-size: 48px; font-weight: 800;
          color: var(--text); line-height: 1;
          margin-bottom: 8px;
          transition: color var(--transition-theme);
        }
        .stat-card-suffix { color: var(--red); }
        .stat-card-label {
          font-size: 13px; font-weight: 500;
          color: var(--text2); letter-spacing: 0.4px;
          text-transform: uppercase;
          transition: color var(--transition-theme);
        }

        /* Why grid override for new layout */
        .why-grid-new {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          margin-top: 60px;
        }
        @media (max-width: 1100px) {
          .why-grid-new { grid-template-columns: 1fr; gap: 40px; }
          .why-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .stat-card-num { font-size: 36px; }
        }
      `}</style>

      <section className="why-section" id="about">
        <ScrollReveal>
          <div className="section-label">Why Choose Us</div>
          <div className="section-title">Built for the <em>Bold</em></div>
        </ScrollReveal>

        <div className="why-grid-new">
          {/* LEFT — Animated Stats */}
          <ScrollReveal>
            <div ref={statsRef}>
              <div className="why-stats-grid">
                {stats.map((s) => (
                  <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} start={started} />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* RIGHT — Benefits */}
          <ScrollReveal>
            <div className="why-benefits">
              {benefits.map((b) => (
                <div className="benefit-item" key={b.title}>
                  <div className="benefit-ico">{b.ico}</div>
                  <div>
                    <div className="benefit-title">{b.title}</div>
                    <div className="benefit-desc">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
