'use client'

import { useEffect, useRef } from 'react'
import ScrollReveal from './ScrollReveal'

const steps = [
  { num: '01', title: 'Discovery', desc: 'Deep dive into your goals, challenges, and technical requirements to craft the perfect strategy.' },
  { num: '02', title: 'Architecture', desc: 'Design scalable system architecture, tech stack selection, and detailed project roadmap.' },
  { num: '03', title: 'Build & Iterate', desc: 'Agile development sprints with continuous delivery, testing, and feedback loops.' },
  { num: '04', title: 'Launch & Scale', desc: 'Seamless deployment, monitoring, performance optimization, and ongoing support.' },
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
      <ScrollReveal>
        <div className="section-label">How We Work</div>
        <div className="section-title">Our <em>Process</em></div>
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
