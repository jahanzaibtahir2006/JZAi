'use client'
import ScrollReveal from './ScrollReveal'

const TESTIMONIALS = [
  {
    name: "Ahmed Raza",
    role: "E-commerce Store Owner",
    company: "ShopPakistan",
    avatar: "AR",
    color: "#e8193c",
    rating: 5,
    text: "JZAI transformed our customer support completely. The bot handles inquiries 24/7 and captures leads automatically — we saw a 3x increase in qualified leads within the first week.",
  },
  {
    name: "Sarah Khan",
    role: "Digital Marketing Agency",
    company: "GrowthLab",
    avatar: "SK",
    color: "#6366f1",
    rating: 5,
    text: "Setup took less than 5 minutes and we had our first lead on day one. We now recommend JZAI to every client — it's the easiest AI chatbot solution we've used.",
  },
  {
    name: "Usman Ali",
    role: "Real Estate Consultant",
    company: "PropFinder",
    avatar: "UA",
    color: "#0ea5e9",
    rating: 5,
    text: "Website visitors now engage directly through the bot instead of calling. Lead quality has improved significantly and I save hours every week on manual follow-ups.",
  },
  {
    name: "Fatima Malik",
    role: "SaaS Founder",
    company: "EduTrack",
    avatar: "FM",
    color: "#10b981",
    rating: 5,
    text: "We deployed our FAQ bot in 10 minutes and it instantly started answering student questions around the clock. JZAI is the no-code solution that actually delivers results.",
  },
  {
    name: "Hassan Sheikh",
    role: "Freelance Web Developer",
    company: "HassanDev",
    avatar: "HS",
    color: "#f59e0b",
    rating: 5,
    text: "I build JZAI bots for my clients and every single one is impressed. The embed process is seamless — one line of code and it works on any website, any platform.",
  },
  {
    name: "Zara Hussain",
    role: "Healthcare Clinic Manager",
    company: "CareFirst Clinic",
    avatar: "ZH",
    color: "#ec4899",
    rating: 5,
    text: "Patients used to call for appointment questions constantly. Now the bot handles everything automatically. Staff time is freed up and patient satisfaction has improved.",
  },
]

export default function Testimonials() {
  return (
    <>
      <style>{`
        .testi-section {
          padding: 100px 60px;
          background: var(--bg);
          overflow: hidden;
          transition: background var(--transition-theme);
        }
        @media(max-width: 768px) {
          .testi-section { padding: 70px 24px; }
        }
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 60px;
          align-items: start;
        }
        
        @media(max-width: 1024px) {
          .testi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media(max-width: 600px) {
          .testi-grid { grid-template-columns: 1fr; }
        }
        .testi-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: border-color 0.3s, transform 0.3s;
          position: relative;
          overflow: hidden;
          height: 100%;
          justify-content: space-between;
        }
        
        .testi-card::before {
          content: '"';
          position: absolute;
          top: -10px; right: 20px;
          font-size: 120px;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: var(--border);
          line-height: 1;
          pointer-events: none;
          transition: color var(--transition-theme);
        }
        .testi-card:hover {
          border-color: var(--border2);
          transform: translateY(-4px);
        }
        .testi-stars {
          display: flex;
          gap: 3px;
        }
        .testi-star { color: #f59e0b; font-size: 14px; }
        .testi-text {
          font-size: 14px;
          color: var(--text2);
          line-height: 1.8;
          font-weight: 300;
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .testi-author {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
        .testi-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 800;
          color: #fff; flex-shrink: 0;
        }
        .testi-name {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          color: var(--text);
        }
        .testi-role {
          font-size: 12px;
          color: var(--text2);
          margin-top: 2px;
        }
        .testi-company {
          margin-left: auto;
          font-size: 11px;
          font-weight: 700;
          color: var(--text3);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
      `}</style>

      <section className="testi-section">
        <ScrollReveal animation="fadeUp" delay={0}>
          <div className="section-label">Testimonials</div>
          <div className="section-title">Businesses <em>Love JZAI</em></div>
          <div className="section-sub">
            Join hundreds of businesses using JZAI to automate support and capture leads 24/7.
          </div>
        </ScrollReveal>

        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={i} animation="fadeUp" delay={i * 0.1}>
              <div className="testi-card">
                <div className="testi-stars">
                  {[...Array(t.rating)].map((_, si) => (
                    <span key={si} className="testi-star">★</span>
                  ))}
                </div>
                <div className="testi-text">"{t.text}"</div>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                  <div className="testi-company">{t.company}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  )
}
