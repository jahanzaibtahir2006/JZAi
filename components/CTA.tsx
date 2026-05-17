'use client'
import ScrollReveal from './ScrollReveal'
import Link from 'next/link'
import { useState, useRef } from 'react'

const LEAD_URL = 'https://small-wildflower-c0d4.jahanzaibtahir2006.workers.dev/lead'

const SERVICES = [
  'AI / Machine Learning',
  'Web Development',
  'AI Chatbot',
  'Cloud / DevOps',
  'Data Engineering',
  'UI/UX Design',
]

// Har service ke liye alag budget options
const SERVICE_BUDGETS: Record<string, string[]> = {
  'AI Chatbot': [
    '💬 Simple FAQ Chatbot — $100–$300',
    '🤖 Custom AI Chatbot — $300–$800',
    '📚 RAG Based Chatbot — $500–$1,500',
    '🌐 Full NLP + Multi-language — $1,000–$3,000',
    '🏢 Enterprise Level — $3,000+',
  ],
  'AI / Machine Learning': [
    '🔬 Basic ML Model — $500–$1,500',
    '🧠 Custom ML Pipeline — $1,500–$5,000',
    '🏢 Enterprise AI System — $5,000+',
  ],
  'Web Development': [
    '🌐 Landing Page — $100–$300',
    '💼 Business Website — $300–$800',
    '🛒 E-commerce / Web App — $800–$3,000',
    '🏢 Enterprise Web Platform — $3,000+',
  ],
  'Cloud / DevOps': [
    '⚙️ Basic Setup & Config — $200–$500',
    '🚀 CI/CD Pipeline — $500–$1,500',
    '☁️ Full Cloud Infrastructure — $1,500–$5,000',
    '🏢 Enterprise DevOps — $5,000+',
  ],
  'Data Engineering': [
    '📊 Data Dashboard — $300–$800',
    '🔄 ETL Pipeline — $800–$2,500',
    '🏗️ Data Warehouse Setup — $2,500–$6,000',
    '🏢 Enterprise Data Platform — $6,000+',
  ],
  'UI/UX Design': [
    '🎨 Landing Page Design — $100–$300',
    '📱 App UI Design — $300–$800',
    '🖥️ Full Product Design — $800–$2,500',
    '🏢 Enterprise Design System — $2,500+',
  ],
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function CTA() {
  const [formState, setFormState] = useState<FormState>('idle')
  const [focused, setFocused] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedService, setSelectedService] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  // Selected service ke budget options
  const budgetOptions = selectedService ? SERVICE_BUDGETS[selectedService] ?? [] : []

  function validate(data: Record<string, string>) {
    const e: Record<string, string> = {}
    if (!data.name || data.name.trim().length < 2) e.name = 'Name is required'
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Valid email required'
    if (!data.service) e.service = 'Please select a service'
    if (!data.message || data.message.trim().length < 10) e.message = 'Tell us a bit more (min 10 chars)'
    return e
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const data: Record<string, string> = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      service: fd.get('service') as string,
      budget: fd.get('budget') as string,
      message: fd.get('message') as string,
    }
    const errs = validate(data)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setFormState('loading')
    try {
      await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setFormState('success')
      formRef.current?.reset()
    } catch {
      setFormState('error')
    }
  }

  return (
    <>
      <style>{`
        .cta-contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (max-width: 768px) {
          .cta-contact-grid { grid-template-columns: 1fr; gap: 40px; }
        }

        /* ── Left: CTA copy ── */
        .cta-left .section-label { margin-bottom: 16px; }
        .cta-left .section-title { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 20px; }
        .cta-left p { color: var(--text-muted, #888); line-height: 1.7; margin-bottom: 32px; }
        .cta-meta-list { list-style: none; padding: 0; margin: 0 0 36px; display: flex; flex-direction: column; gap: 12px; }
        .cta-meta-list li {
          display: flex; align-items: center; gap: 10px;
          font-size: 14px; color: var(--text-muted, #888);
        }
        .cta-meta-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #e11d48; flex-shrink: 0;
          animation: ctaBlink 2.2s infinite;
        }
        @keyframes ctaBlink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .cta-ghost-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #e11d48; text-decoration: none;
          border-bottom: 1px solid rgba(225,29,72,0.3);
          padding-bottom: 2px; transition: border-color 0.2s;
        }
        .cta-ghost-link:hover { border-color: #e11d48; }

        /* ── Right: Form ── */
        .contact-form-card {
          background: var(--card-bg, #111);
          border: 1px solid rgba(225,29,72,0.15);
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px rgba(225,29,72,0.05);
          position: relative;
          overflow: hidden;
        }
        .contact-form-card::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(circle, rgba(225,29,72,0.08), transparent 70%);
          pointer-events: none;
        }

        /* Light mode */
        [data-theme="light"] .contact-form-card {
          background: #ffffff;
          border-color: rgba(208,16,46,0.12);
          box-shadow: 0 8px 40px rgba(0,0,0,0.08);
        }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }

        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .form-label {
          font-size: 11.5px; font-weight: 600; letter-spacing: 0.6px;
          text-transform: uppercase; color: var(--text-muted, #666);
          transition: color 0.2s;
        }
        .form-group.focused .form-label { color: #e11d48; }

        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 11px 14px;
          background: var(--input-bg, rgba(255,255,255,0.04));
          border: 1.5px solid var(--input-border, rgba(225,29,72,0.12));
          border-radius: 10px;
          font-family: inherit; font-size: 13.5px;
          color: var(--text-primary, #f0f0f0);
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; resize: none;
          appearance: none; -webkit-appearance: none;
        }
        [data-theme="light"] .form-input,
        [data-theme="light"] .form-select,
        [data-theme="light"] .form-textarea {
          background: #f7f7f9;
          border-color: rgba(208,16,46,0.12);
          color: #0f0f14;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #e11d48;
          box-shadow: 0 0 0 3px rgba(225,29,72,0.1);
          background: var(--input-focus-bg, rgba(225,29,72,0.04));
        }
        [data-theme="light"] .form-input:focus,
        [data-theme="light"] .form-select:focus,
        [data-theme="light"] .form-textarea:focus {
          background: rgba(208,16,46,0.04);
        }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--placeholder, #555); }
        [data-theme="light"] .form-input::placeholder,
        [data-theme="light"] .form-textarea::placeholder { color: #aaa; }

        .form-select-wrap { position: relative; }
        .form-select-wrap::after {
          content: '▾'; position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          color: #e11d48; pointer-events: none; font-size: 13px;
        }
        .form-select option { background: #111; color: #f0f0f0; }
        [data-theme="light"] .form-select option { background: #fff; color: #0f0f14; }

        .form-error { font-size: 11px; color: #e11d48; margin-top: 3px; }

        .form-textarea { min-height: 90px; line-height: 1.6; }

        /* ── Submit button ── */
        .form-submit {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #9f1239, #e11d48);
          color: #fff; border: none; border-radius: 10px;
          font-family: inherit; font-size: 14px; font-weight: 600;
          letter-spacing: 0.3px; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 4px;
        }
        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(225,29,72,0.4);
        }
        .form-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Loading spinner ── */
        .form-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: formSpin 0.7s linear infinite;
        }
        @keyframes formSpin { to { transform: rotate(360deg); } }

        /* ── Success state ── */
        .form-success {
          text-align: center; padding: 48px 24px;
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          animation: formFadeIn 0.5s ease;
        }
        @keyframes formFadeIn { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        .form-success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: rgba(225,29,72,0.1); border: 2px solid rgba(225,29,72,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
        }
        .form-success h3 { font-size: 20px; font-weight: 700; color: var(--text-primary, #f0f0f0); }
        [data-theme="light"] .form-success h3 { color: #0f0f14; }
        .form-success p { font-size: 14px; color: var(--text-muted, #888); line-height: 1.6; }
        .form-success-btn {
          margin-top: 8px; padding: 9px 22px;
          background: rgba(225,29,72,0.1); border: 1.5px solid rgba(225,29,72,0.3);
          border-radius: 20px; color: #e11d48;
          font-family: inherit; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .form-success-btn:hover { background: rgba(225,29,72,0.18); }

        /* ── Error banner ── */
        .form-error-banner {
          background: rgba(225,29,72,0.08); border: 1px solid rgba(225,29,72,0.25);
          border-radius: 8px; padding: 10px 14px;
          font-size: 13px; color: #e11d48; margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
      `}</style>

      <section className="cta-section" id="contact">
        <ScrollReveal>
          <div className="cta-contact-grid">

            {/* ── LEFT: Copy ── */}
            <div className="cta-left">
              <div className="section-label" style={{ justifyContent: 'flex-start' }}>Ready?</div>
              <div className="section-title">
                Let&apos;s Build Something <em>Extraordinary</em>
              </div>
              <p>Have a project in mind? Let&apos;s turn your vision into a high-performing AI-powered reality.</p>

              <ul className="cta-meta-list">
                <li><span className="cta-meta-dot" />Response within 24 hours</li>
                <li><span className="cta-meta-dot" />Free initial consultation</li>
                <li><span className="cta-meta-dot" />No commitment required</li>
                <li><span className="cta-meta-dot" />Flexible pricing & packages</li>
              </ul>

              <a href="mailto:jahanzaibtahir2006@gmail.com" className="cta-ghost-link">
                jahanzaibtahir2006@gmail.com →
              </a>
            </div>

            {/* ── RIGHT: Form ── */}
            <div className="contact-form-card">
              {formState === 'success' ? (
                <div className="form-success">
                  <div className="form-success-icon">🚀</div>
                  <h3>Message Sent!</h3>
                  <p>Thanks for reaching out! Jahanzaib will get back to you within 24 hours.</p>
                  <button className="form-success-btn" onClick={() => setFormState('idle')}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  {formState === 'error' && (
                    <div className="form-error-banner">
                      ⚠️ Something went wrong. Please try again or email directly.
                    </div>
                  )}

                  <div className="form-row">
                    {/* Name */}
                    <div className={`form-group${focused === 'name' ? ' focused' : ''}`}>
                      <label className="form-label" htmlFor="cf-name">Your Name</label>
                      <input
                        id="cf-name" name="name" type="text"
                        className="form-input" placeholder="Your full name"
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className={`form-group${focused === 'email' ? ' focused' : ''}`}>
                      <label className="form-label" htmlFor="cf-email">Email Address</label>
                      <input
                        id="cf-email" name="email" type="email"
                        className="form-input" placeholder="you@example.com"
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    {/* Service */}
                    <div className={`form-group${focused === 'service' ? ' focused' : ''}`}>
                      <label className="form-label" htmlFor="cf-service">Service</label>
                      <div className="form-select-wrap">
                        <select
                          id="cf-service" name="service"
                          className="form-select"
                          value={selectedService}
                          onChange={e => setSelectedService(e.target.value)}
                          onFocus={() => setFocused('service')}
                          onBlur={() => setFocused(null)}
                        >
                          <option value="" disabled>Select service...</option>
                          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      {errors.service && <span className="form-error">{errors.service}</span>}
                    </div>

                    {/* Budget — service ke baad hi show hoga */}
                    <div className={`form-group${focused === 'budget' ? ' focused' : ''}`}>
                      <label className="form-label" htmlFor="cf-budget">Budget</label>
                      <div className="form-select-wrap">
                        <select
                          id="cf-budget" name="budget"
                          className="form-select"
                          defaultValue=""
                          disabled={!selectedService}
                          onFocus={() => setFocused('budget')}
                          onBlur={() => setFocused(null)}
                          style={{ opacity: selectedService ? 1 : 0.45, cursor: selectedService ? 'pointer' : 'not-allowed' }}
                        >
                          <option value="" disabled>
                            {selectedService ? 'Select budget...' : 'Select service first'}
                          </option>
                          {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className={`form-group${focused === 'message' ? ' focused' : ''}`}>
                    <label className="form-label" htmlFor="cf-message">Project Details</label>
                    <textarea
                      id="cf-message" name="message"
                      className="form-textarea"
                      placeholder="Tell us about your project, goals, or any questions..."
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="form-submit"
                    disabled={formState === 'loading'}
                  >
                    {formState === 'loading' ? (
                      <><div className="form-spinner" /> Sending...</>
                    ) : (
                      <>Send Message <span>→</span></>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
