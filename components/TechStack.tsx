import ScrollReveal from './ScrollReveal'

const techs = [
  { ico: '⚛️', name: 'React' },
  { ico: '▲', name: 'Next.js' },
  { ico: '🟨', name: 'JavaScript' },
  { ico: '🐍', name: 'Python' },
  { ico: '🔷', name: 'TypeScript' },
  { ico: '🟢', name: 'Node.js' },
  { ico: '☁️', name: 'AWS' },
  { ico: '🐳', name: 'Docker' },
  { ico: '☸️', name: 'Kubernetes' },
  { ico: '🧠', name: 'PyTorch' },
  { ico: '🔴', name: 'Redis' },
  { ico: '🍃', name: 'MongoDB' },
  { ico: '🐘', name: 'PostgreSQL' },
  { ico: '🌊', name: 'Kafka' },
  { ico: '🎨', name: 'Figma' },
  { ico: '🔥', name: 'Firebase' },
]

export default function TechStack() {
  return (
    <section className="tech-section" id="tech">
      <ScrollReveal>
        <div className="section-label">Technology</div>
        <div className="section-title">Our <em>Tech Stack</em></div>
        <div className="section-sub">We work with the best modern technologies to deliver future-proof solutions.</div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="tech-grid">
          {techs.map((t) => (
            <div className="tech-item" key={t.name}>
              <div className="tech-ico">{t.ico}</div>
              {t.name}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
