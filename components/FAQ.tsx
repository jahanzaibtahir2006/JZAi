'use client'
import { useState } from 'react'
import ScrollReveal from './ScrollReveal'

const FAQS = [
  {
    q: 'What is JZAI?',
    a: 'JZAI is an AI chatbot platform that lets you build, train, and deploy custom chatbots for your business — no coding required. Your bot learns from your business data and works 24/7.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most users deploy their first chatbot in under 5 minutes. Just fill in your business details, customize the behavior, and copy one line of code to your website.',
  },
  {
    q: 'Do I need coding skills?',
    a: 'No. JZAI is 100% no-code. You fill out a form, and we handle everything — AI training, hosting, and deployment.',
  },
  {
    q: 'What is the free trial?',
    a: 'You get a 7-day free trial with 1 chatbot and 100 messages. No credit card required. After the trial, upgrade to Starter or Pro to keep your bot running.',
  },
  {
    q: 'How does lead capture work?',
    a: 'Your chatbot naturally collects visitor information — name, email, phone — during conversations. All leads appear in your dashboard instantly.',
  },
  {
    q: 'Can I add the chatbot to any website?',
    a: 'Yes. JZAI works with any website — WordPress, Shopify, Webflow, or custom HTML. Just paste one line of code and your bot is live.',
  },
  {
    q: 'What happens when I hit my message limit?',
    a: 'Your chatbot will pause until you upgrade your plan. You can upgrade anytime from your dashboard — it takes effect immediately.',
  },
  {
    q: 'Can I train the bot on my own data?',
    a: 'Yes. You can add your business description, FAQs, and documents. The AI uses all of this to answer questions accurately on your behalf.',
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
        .faq-contact-nudge a { color: var(--red); text-decoration: none; font-weight: 500; }
        .faq-contact-nudge a:hover { text-decoration: underline; }
        .faq-list { display: flex; flex-direction: column; gap: 2px; }
        .faq-item {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 0; overflow: hidden;
          transition: border-color 0.3s, background var(--transition-theme);
        }
        .faq-item:first-child { border-radius: 12px 12px 0 0; }
        .faq-item:last-child  { border-radius: 0 0 12px 12px; }
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
          border-radius: 50%; border: 1.5px solid var(--border);
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
        .faq-item.active .faq-answer { max-height: 300px; padding: 0 24px 20px; }
        .faq-answer p {
          font-size: 14px; color: var(--text2);
          line-height: 1.75; font-weight: 300;
          border-top: 1px solid var(--border);
          padding-top: 16px;
          transition: color var(--transition-theme), border-color var(--transition-theme);
        }
      `}</style>

      <section className="faq-section" id="faq">
        <ScrollReveal animation="fadeUp" delay={0}>
          <div className="section-label">FAQ</div>
        </ScrollReveal>

        <div className="faq-layout">
          <ScrollReveal animation="slideRight" delay={0.1}>
            <div className="faq-left">
              <div className="faq-left-title">
                Frequently Asked<br /><em>Questions</em>
              </div>
              <p className="faq-left-sub">
                Everything you need to know about JZAI. Can't find an answer?
              </p>
              <div className="faq-contact-nudge">
                <span>💬</span>
                <span>
                  Still have questions?{' '}
                  <a href="mailto:hello@jzai.store">Get in touch →</a>
                </span>
              </div>
            </div>
          </ScrollReveal>

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
