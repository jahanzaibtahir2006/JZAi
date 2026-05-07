'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const services = [
  { num: '01', icon: '🧠', title: 'AI & Machine Learning', desc: 'Custom AI models, LLM integrations, computer vision, and intelligent automation pipelines built for production at scale.', tags: ['LLMs', 'PyTorch', 'Computer Vision'] },
  { num: '02', icon: '🌐', title: 'Web Development', desc: 'High-performance web applications using modern stacks. From landing pages to complex SaaS platforms that scale effortlessly.', tags: ['React', 'Next.js', 'Node.js'] },
  { num: '03', icon: '☁️', title: 'Cloud & DevOps', desc: 'Resilient cloud infrastructure, CI/CD pipelines, containerization, and microservices architecture for enterprise-grade reliability.', tags: ['AWS', 'Docker', 'Kubernetes'] },
  { num: '04', icon: '💬', title: 'AI Chatbots & NLP', desc: 'Intelligent conversational agents, RAG systems, and NLP solutions that understand context and deliver human-like interactions.', tags: ['Claude API', 'OpenAI', 'RAG'] },
  { num: '05', icon: '📊', title: 'Data Engineering', desc: 'End-to-end data pipelines, real-time analytics dashboards, and data warehousing solutions that turn raw data into competitive advantage.', tags: ['Python', 'Spark', 'Tableau'] },
  { num: '06', icon: '🎨', title: 'UI/UX Design', desc: 'User-centric design systems, interactive prototypes, and brand identities that captivate users and drive conversion.', tags: ['Figma', 'Framer', 'Design Systems'] },
]

const steps = [
  { num: '01', title: 'Discovery', desc: 'Deep dive into your goals, challenges, and technical requirements to craft the perfect strategy.' },
  { num: '02', title: 'Architecture', desc: 'Design scalable system architecture, tech stack selection, and detailed project roadmap.' },
  { num: '03', title: 'Build & Iterate', desc: 'Agile development sprints with continuous delivery, testing, and feedback loops.' },
  { num: '04', title: 'Launch & Scale', desc: 'Seamless deployment, monitoring, performance optimization, and ongoing support.' },
]

export default function ServicesPage() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('jzai-theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('jzai-theme', theme)
  }, [theme])

  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    reveals.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Navbar activePage="services" />

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="grid-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">Our Services</div>
          <h1>
            What We <span className="line-red">Build</span>
            <span className="stroke-text">&amp; Engineer.</span>
          </h1>
          <p className="hero-desc">
            From intelligent AI systems to high-performance web platforms — every solution is
            engineered with precision, built to scale, and designed to deliver real results.
          </p>
          <div className="hero-actions">
            <a href="#services" className="btn-primary">
              Explore Services <span className="btn-arrow">→</span>
            </a>
            <a href="#contact" className="btn-ghost">Start a Project</a>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section" id="services">
        <div className="reveal">
          <div className="section-label">What We Do</div>
          <div className="section-title">Our Core <em>Services</em></div>
          <div className="section-sub">From intelligent automation to pixel-perfect interfaces — we engineer solutions that drive real results.</div>
        </div>
        <div className="services-grid">
          {services.map((s) => (
            <div className="service-card reveal" key={s.num}>
              <div className="sc-num">{s.num}</div>
              <div className="sc-icon">{s.icon}</div>
              <div className="sc-title">{s.title}</div>
              <div className="sc-desc">{s.desc}</div>
              <div className="sc-tags">
                {s.tags.map((tag) => (
                  <span className="sc-tag" key={tag}>{tag}</span>
                ))}
              </div>
              <div className="sc-arrow">↗</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="process-section" id="process">
        <div className="reveal">
          <div className="section-label">How We Work</div>
          <div className="section-title">Our <em>Process</em></div>
        </div>
        <div className="process-steps">
          {steps.map((step, i) => (
            <div
              className="process-step reveal"
              key={step.num}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="step-num">{step.num}</div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" id="contact">
        <div className="reveal">
          <div className="section-label" style={{ justifyContent: 'center' }}>Ready?</div>
          <div className="section-title">
            Let&apos;s Build Something <em>Extraordinary</em>
          </div>
          <p>Have a project in mind? Let&apos;s turn your vision into a high-performing AI-powered reality.</p>
          <div className="cta-actions">
            <a href="mailto:jahanzaibtahir2006@gmail.com" className="btn-primary">
              Start a Project <span className="btn-arrow">→</span>
            </a>
            <Link href="/" className="btn-ghost">Back to Home</Link>
          </div>
        </div>
      </section>
      {/* ── FOOTER ── */}
      <Footer />
    </>
  )
}
