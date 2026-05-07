import ScrollReveal from './ScrollReveal'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="cta-section" id="contact">
      <ScrollReveal>
        <div className="section-label" style={{ justifyContent: 'center' }}>Ready?</div>
        <div className="section-title">
          Let&apos;s Build Something <em>Extraordinary</em>
        </div>
        <p>Have a project in mind? Let&apos;s turn your vision into a high-performing AI-powered reality.</p>
        <div className="cta-actions">
          <a href="mailto:jahanzaibtahir2006@gmail.com" className="btn-primary">
            Start a Project <span className="btn-arrow">→</span>
          </a>
          <Link href="#services" className="btn-ghost">View Services</Link>
        </div>
      </ScrollReveal>
    </section>
  )
}
