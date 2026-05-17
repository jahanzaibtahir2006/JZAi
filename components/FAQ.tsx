'use client'
import { useState } from 'react'
import ScrollReveal from './ScrollReveal'

const FAQS = [
  {
    q: 'What services does JZAI offer?',
    a: 'JZAI specializes in AI-powered solutions including custom chatbots, RAG-based systems, machine learning models, full-stack web development, cloud/DevOps infrastructure, data engineering pipelines, and UI/UX design.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'Project timelines vary based on complexity. A simple FAQ chatbot can be delivered in 3–5 days, a custom AI chatbot in 1–2 weeks, and a full enterprise-grade system in 4–8 weeks. We provide a detailed timeline before starting any project.',
  },
  {
    q: 'What is your minimum project budget?',
    a: 'Our minimum engagement starts at $100 for simple FAQ chatbots. Custom AI solutions, web applications, and enterprise systems are priced based on scope. We offer flexible payment arrangements and can work within most budgets.',
  },
  {
    q: 'Do you offer post-launch support?',
    a: 'Yes. Every project includes a free support window after launch. We also offer ongoing maintenance packages for bug fixes, performance optimization, and feature additions on a monthly retainer basis.',
  },
  {
    q: 'What technologies does JZAI use?',
    a: 'We work with a modern stack including Next.js, React, Node.js, Python, FastAPI, OpenAI, LangChain, Pinecone, PostgreSQL, Supabase, AWS, Cloudflare, and more — chosen based on what best fits your project requirements.',
  },
  {
    q: 'Can you build a chatbot for my existing website?',
    a: 'Absolutely. We build chatbots that integrate seamlessly with any website — whether it\'s built on WordPress, Shopify, Webflow, or a custom stack. The chatbot is delivered as a lightweight embeddable script.',
  },
  {
    q: 'How do I get started?',
    a: 'Simply fill out the contact form on this page or reach out via WhatsApp or email. We\'ll schedule a free consultation call to understand your requirements and provide a detailed proposal within 24 hours.',
  },
  {
    q: 'Is my data and project information kept confidential?',
    a: 'Absolutely. We sign NDAs upon request and follow strict confidentiality practices. Your project details, business logic, and data are never shared with third parties.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <style>{`
        .faq-section {
          padding: 100px 60px;
          background: var(--bg2);
          transition: background var(--transition-theme);
        }
        .faq-layout {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 80px;
          align-items: start;
          margin-top: 60px;
        }
        @media (max-width: 1024px) {
          .faq-layout { grid-template-columns: 1fr; gap: 40px; }
          .faq-section { padding: 70px 24px; }
        }

        /* Left sticky panel */
        .faq-left { position: sticky; top: 100px; }
        .faq-left-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 3vw, 42px);
          font-weight: 800; letter-spacing: -1px;
          line-height: 1.1; color: var(--text);
          margin-bottom: 16px;
          transition: color var(--transition-theme);
        }
        .faq-left-title em { color: var(--red); font-style: normal; }
        .faq-left-sub {
          font-size: 14px; color: var(--text2); line-height: 1.7;
          font-weight: 300; margin-bottom: 32px;
          transition: color var(--transition-theme);
        }
        .faq-contact-nudge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--red-dim); border: 1px solid var(--border2);
          border-radius: 8px; padding: 12px 16px;
          font-size: 13px; color: var(--text2); line-height: 1.5;
          transition: background var(--transition-theme), border-color var(--transition-theme);
        }
        .faq-contact-nudge strong { color: var(--red); font-weight: 600; }
        .faq-contact-nudge a { color: var(--red); text-decoration: none; font-weight: 500; }
        .faq-contact-nudge a:hover { text-decoration: underline; }

        /* Accordion */
        .faq-list { display: flex; flex-direction: column; gap: 2px; }
        .faq-item {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 0;
          overflow: hidden;
          transition: border-color 0.3s, background var(--transition-theme);
        }
        .faq-item:first-child { border-radius: 12px 12px 0 0; }
        .faq-item:last-child  { border-radius: 0 0 12px 12px; }
        .faq-item:only-child  { border-radius: 12px; }
        .faq-item.active { border-color: var(--border2); }

        .faq-question {
          width: 100%; background: none; border: none;
          padding: 20px 24px;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          cursor: pointer; text-align: left;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 500;
          color: var(--text); line-height: 1.5;
          transition: color 0.2s, background 0.2s;
        }
        .faq-question:hover { background: var(--red-dim); }
        .faq-item.active .faq-question { color: var(--red); }

        .faq-icon {
          width: 28px; height: 28px; min-width: 28px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text2); font-size: 16px; font-weight: 300;
          transition: all 0.3s; line-height: 1;
        }
        .faq-item.active .faq-icon {
          background: var(--red); border-color: var(--red);
          color: #fff; transform: rotate(45deg);
        }

        .faq-answer {
          max-height: 0; overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.3s;
          padding: 0 24px;
        }
        .faq-item.active .faq-answer {
          max-height: 300px;
          padding: 0 24px 20px;
        }
        .faq-answer p {
          font-size: 14px; color: var(--text2);
          line-height: 1.75; font-weight: 300;
          border-top: 1px solid var(--border);
          padding-top: 16px;
          transition: color var(--transition-theme), border-color var(--transition-theme);
        }
      `}</style>

      <section className="faq-section" id="faq">
        <ScrollReveal>
          <div className="section-label">FAQ</div>
        </ScrollReveal>

        <div className="faq-layout">
          {/* Left */}
          <ScrollReveal>
            <div className="faq-left">
              <div className="faq-left-title">
                Frequently Asked<br /><em>Questions</em>
              </div>
              <p className="faq-left-sub">
                Everything you need to know about working with JZAI. Can't find an answer?
              </p>
              <div className="faq-contact-nudge">
                <span>💬</span>
                <span>
                  Still have questions?{' '}
                  <a href="#contact"><strong>Get in touch</strong></a>
                  {' '}— we reply within 24 hours.
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right — Accordion */}
          <ScrollReveal>
            <div className="faq-list">
              {FAQS.map((faq, i) => (
                <div key={i} className={`faq-item${open === i ? ' active' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
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
