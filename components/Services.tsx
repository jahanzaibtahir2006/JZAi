import ScrollReveal from './ScrollReveal'

const services = [
  {
    num: '01', icon: '🧠', title: 'AI & Machine Learning',
    desc: 'Custom AI models, LLM integrations, computer vision, and intelligent automation pipelines built for production at scale.',
    tags: ['LLMs', 'PyTorch', 'Computer Vision'],
  },
  {
    num: '02', icon: '🌐', title: 'Web Development',
    desc: 'High-performance web applications using modern stacks. From landing pages to complex SaaS platforms that scale effortlessly.',
    tags: ['React', 'Next.js', 'Node.js'],
  },
  {
    num: '03', icon: '☁️', title: 'Cloud & DevOps',
    desc: 'Resilient cloud infrastructure, CI/CD pipelines, containerization, and microservices architecture for enterprise-grade reliability.',
    tags: ['AWS', 'Docker', 'Kubernetes'],
  },
  {
    num: '04', icon: '💬', title: 'AI Chatbots & NLP',
    desc: 'Intelligent conversational agents, RAG systems, and NLP solutions that understand context and deliver human-like interactions.',
    tags: ['ChatGPT API', 'RAG', 'Claude'],
  },
  {
    num: '05', icon: '📊', title: 'Data Engineering',
    desc: 'End-to-end data pipelines, real-time analytics dashboards, and data warehousing solutions that turn raw data into competitive advantage.',
    tags: ['Python', 'Spark', 'Tableau'],
  },
  {
    num: '06', icon: '🎨', title: 'UI/UX Design',
    desc: 'User-centric design systems, interactive prototypes, and brand identities that captivate users and drive conversion.',
    tags: ['Figma', 'Framer', 'Design Systems'],
  },
]

export default function Services() {
  return (
    <section className="section" id="services">
      <ScrollReveal>
        <div className="section-label">What We Do</div>
        <div className="section-title">Our Core <em>Services</em></div>
        <div className="section-sub">
          From intelligent automation to pixel-perfect interfaces — we engineer solutions that drive real results.
        </div>
      </ScrollReveal>
      <div className="services-grid">
        {services.map((s) => (
          <ScrollReveal key={s.num}>
            <div className="service-card">
              <div className="sc-num">{s.num}</div>
              <div className="sc-icon">{s.icon}</div>
              <div className="sc-title">{s.title}</div>
              <div className="sc-desc">{s.desc}</div>
              <div className="sc-tags">
                {s.tags.map((t) => <span className="sc-tag" key={t}>{t}</span>)}
              </div>
              <div className="sc-arrow">↗</div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
