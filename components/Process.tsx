'use client'
import { useEffect, useRef } from 'react'
import ScrollReveal from './ScrollReveal'

const steps = [
  {
    num: '01',
    title: 'Create Your Bot',
    desc: 'Give your chatbot a name, pick your industry, set brand colors — done in under 2 minutes.',
  },
  {
    num: '02',
    title: 'Train It',
    desc: 'Add your business description, FAQs, and documents. Your bot learns everything about your business.',
  },
  {
    num: '03',
    title: 'Customize Behavior',
    desc: 'Set the tone, role, greeting message, and lead capture fields — make it truly yours.',
  },
  {
    num: '04',
    title: 'Deploy & Capture',
    desc: 'Copy one line of code, paste on your website. Your bot goes live and starts capturing leads instantly.',
  },
]

export default function Process() {
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!stepsRef.current) return
    const stepEls = stepsRef.current.querySelectorAll<HTMLElement>('.process-step')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            stepEls.forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120)
            })
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(stepsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="process-section" id="process">
      <ScrollReveal animation="fadeUp" delay={0}>
          <div className="section-label">How It Works</div>
        <div className="section-title" style={{ textAlign: 'center' }}>Deploy in <em>4 Simple Steps</em></div>
        <div className="section-sub" style={{ maxWidth: 500, margin: '16px auto 48px', textAlign: 'center' }}>
          No coding, no complex setup — just fill in your business details and go live.
        </div>
      </ScrollReveal>
      <div className="process-steps" ref={stepsRef}>
        {steps.map((s) => (
          <div className="process-step" key={s.num}>
            <div className="step-num">{s.num}</div>
            <div className="step-title">{s.title}</div>
            <div className="step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
