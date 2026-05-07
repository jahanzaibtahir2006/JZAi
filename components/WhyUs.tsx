import ScrollReveal from './ScrollReveal'

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

export default function WhyUs() {
  return (
    <section className="why-section" id="about">
      <ScrollReveal>
        <div className="section-label">Why Choose Us</div>
        <div className="section-title">Built for the <em>Bold</em></div>
      </ScrollReveal>
      <div className="why-grid">
        <ScrollReveal>
          <div className="why-visual">
            <div className="why-visual-inner">
              <div className="circle-anim">
                <div className="orbit-dot"></div>
                <div className="orbit-dot"></div>
                <div className="orbit-dot"></div>
                <div className="orbit-dot"></div>
                <div className="circle-core">🤖</div>
              </div>
            </div>
          </div>
        </ScrollReveal>
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
  )
}
