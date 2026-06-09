'use client'
import { useEffect } from 'react'
import ScrollReveal from './ScrollReveal'
import Link from 'next/link'

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-Powered Responses',
    desc: 'Trained on your business data — FAQs, descriptions, documents. Your bot answers like a real team member.',
  },
  {
    icon: '🎯',
    title: 'Automatic Lead Capture',
    desc: 'Collects visitor name, email, and phone naturally during conversations. All leads in your dashboard instantly.',
  },
  {
    icon: '⚡',
    title: '5-Minute Setup',
    desc: 'No coding needed. Fill in your business details, paste one line of code, and your bot is live.',
  },
  {
    icon: '🌐',
    title: 'Works Everywhere',
    desc: 'Embed on any website — WordPress, Shopify, Webflow, or custom HTML. One script, any platform.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    desc: 'Track conversations, leads, and messages in real time. See exactly how your chatbot is performing.',
  },
  {
    icon: '🌍',
    title: 'Multi-Language',
    desc: 'Support customers in English, Urdu, Arabic, Hindi, Spanish and more. Your bot speaks their language.',
  },
]

  export default function Features() {

  // 3D tilt on feature cards
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.feature-card')
    cards.forEach(card => {
      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        const rx = (y - r.height / 2) / (r.height / 2) * 12
        const ry = (r.width / 2 - x) / (r.width / 2) * 12
        card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`
        card.style.boxShadow = `${-ry * 0.4}px ${rx * 0.4}px 30px rgba(232,25,60,0.12)`
      }
      const onLeave = () => {
        card.style.transform = ''
        card.style.boxShadow = ''
      }
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)
    })
  }, [])

  return (
    <>
      <style>{`
        .features-section {
          padding: 100px 60px;
          background: var(--bg);
          transition: background var(--transition-theme);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-top: 60px;
          align-items: stretch;
        }
        }
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: 1fr 1fr; }
          .features-section { padding: 70px 24px; }
        }
        @media (max-width: 580px) {
          .features-grid { grid-template-columns: 1fr; }
        }
        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          padding: 36px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, transform 0.3s, background var(--transition-theme);
          cursor: default;
          height: 100%;
        }
        .feature-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--red);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }
        .feature-card:hover { border-color: var(--border2); transform: translateY(-4px); }
        .feature-card:hover::after { transform: scaleX(1); }
        .feature-icon {
          width: 52px; height: 52px;
          background: var(--red-dim);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          margin-bottom: 22px;
          transition: background 0.3s, transform 0.3s;
        }
        .feature-card:hover .feature-icon {
          background: rgba(232,25,60,0.18);
          transform: scale(1.1) rotate(-5deg);
        }
        .feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700;
          color: var(--text);
          margin-bottom: 10px;
          letter-spacing: -0.3px;
          transition: color var(--transition-theme);
        }
        .feature-desc {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.7;
          font-weight: 300;
          transition: color var(--transition-theme);
        }
        .features-cta {
          margin-top: 60px;
          padding: 40px;
          background: var(--red-dim);
          border: 1px solid var(--border2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          transition: background var(--transition-theme);
        }
        .features-cta-text {
          font-family: 'Syne', sans-serif;
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 800;
          color: var(--text);
          letter-spacing: -0.5px;
        }
        .features-cta-text span { color: var(--red); }
        .features-cta-sub {
          font-size: 14px;
          color: var(--text2);
          margin-top: 4px;
          font-weight: 300;
        }
      `}</style>

      <section className="features-section" id="features">
        <ScrollReveal animation="fadeUp" delay={0}>
          <div className="section-label">Why JZAI</div>
          <div className="section-title">Everything You Need to <em>Convert Visitors</em></div>
          <div className="section-sub">
            One platform to build, deploy, and manage AI chatbots that work for your business around the clock.
          </div>
        </ScrollReveal>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <ScrollReveal key={i} animation="fadeUp" delay={i * 0.1}>
              <div className="feature-card h-lift">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="scaleIn" delay={0.2}>
          <div className="features-cta">
            <div>
              <div className="features-cta-text">
                Start free — <span>no credit card</span> required.
              </div>
              <div className="features-cta-sub">
                7-day trial · 1 chatbot · 100 messages · Full dashboard access
              </div>
            </div>
            <Link href="/create-chatbot" className="btn-primary">
              Build Your Bot Now <span className="btn-arrow">→</span>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
