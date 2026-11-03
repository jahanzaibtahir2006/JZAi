'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CHAT_MESSAGES = [
  { role: 'bot',  text: '👋 Hi! I\'m JZAI — What can I help you with?', delay: 500 },
  { role: 'user', text: 'I need a chatbot for my online store', delay: 1800 },
  { role: 'bot',  text: '🛍️ Perfect! I\'ll handle customer queries, returns & orders 24/7', delay: 3200 },
  { role: 'user', text: 'Can it capture customer leads too?', delay: 5000 },
  { role: 'bot',  text: '✅ Yes! Name, email & phone — all saved to your dashboard instantly', delay: 6400 },
  { role: 'user', text: 'How smart is it really?', delay: 8000 },
  { role: 'bot',  text: '🧠 Trained on YOUR business data — FAQs, products, policies. It answers like you!', delay: 9400 },
  { role: 'user', text: 'Sounds complex to set up...', delay: 11200 },
  { role: 'bot',  text: '⚡ Nope! 5 minutes. Fill details → copy 1 line of code → go live!', delay: 12600 },
  { role: 'user', text: 'What if I need it in Urdu?', delay: 14200 },
  { role: 'bot',  text: '🌍 Supports 50+ languages including Urdu, Arabic & Hindi!', delay: 15600 },
  { role: 'user', text: 'How much does it cost?', delay: 17200 },
  { role: 'bot',  text: '🎉 Start FREE for 7 days — no credit card. Plans from just $29/mo!', delay: 18600 },
  { role: 'user', text: 'Okay I\'m convinced. Let\'s go! 🚀', delay: 20200 },
  { role: 'bot',  text: '🔥 Amazing! Click "Create Your Chatbot" — your AI goes live today!', delay: 21400 },
]

export default function Hero() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])
  const [scrollY, setScrollY] = useState(0)
  const [typing, setTyping] = useState(false)
  const [loopKey, setLoopKey] = useState(0)

  // Chat loop
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    CHAT_MESSAGES.forEach((msg, i) => {
      if (msg.role === 'bot') {
        timers.push(setTimeout(() => setTyping(true), msg.delay - 800))
      } else {
        timers.push(setTimeout(() => setTyping(false), msg.delay - 200))
      }
      timers.push(setTimeout(() => {
        setTyping(false)
        setVisibleMessages(prev => {
          const next = [...prev, i]
          setTimeout(() => {
            const chatWindow = document.getElementById('chat-messages-window')
            if (chatWindow) chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' })
          }, 100)
          return next
        })
      }, msg.delay))
    })

    timers.push(setTimeout(() => {
      setVisibleMessages([])
      setTyping(false)
      setLoopKey(k => k + 1)
    }, 27000))

    return () => timers.forEach(clearTimeout)
  }, [loopKey])

  // Scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Card tilt
  useEffect(() => {
    const card = document.getElementById('hero-mockup-card')
    if (!card) return
    const onMove = (e: MouseEvent) => {
      const rx = (e.clientY / window.innerHeight - 0.5) * 20
      const ry = (e.clientX / window.innerWidth - 0.5) * -20
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    const onLeave = () => { card.style.transform = '' }
    window.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      <style>{`
        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .hero-heading-wrap { margin-bottom: 48px; }
        .hero-bottom {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .hero-bottom { grid-template-columns: 1fr; }
          .hero-right { display: none; }
        }

        /* ── Particles ── */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: var(--red);
          opacity: 0;
          animation: floatParticle var(--dur) ease-in-out var(--delay) infinite;
        }
        @keyframes floatParticle {
          0%   { opacity: 0; transform: translateY(0) scale(0); }
          20%  { opacity: 0.5; }
          80%  { opacity: 0.15; }
          100% { opacity: 0; transform: translateY(-100px) scale(1.4); }
        }

        /* ── Chat Demo ── */
        .chat-demo {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 32px 64px rgba(0,0,0,0.25), 0 0 0 1px var(--border2);
          animation: floatCard 6s ease-in-out infinite;
          width: 100%;
        }
        @keyframes floatCard {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        .chat-demo-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; gap: 10px;
          background: var(--bg2);
        }
        .chat-demo-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--red);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: #fff;
          font-family: 'Syne', sans-serif; flex-shrink: 0;
        }
        .chat-demo-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .chat-demo-status {
          font-size: 11px; color: #22c55e;
          display: flex; align-items: center; gap: 4px; margin-top: 1px;
        }
        .chat-demo-status::before {
          content: ''; width: 5px; height: 5px;
          background: #22c55e; border-radius: 50%;
          animation: pulseDot 2s infinite;
        }
        .chat-demo-dots { display: flex; gap: 5px; margin-left: auto; }
        .chat-demo-dots span { width: 9px; height: 9px; border-radius: 50%; }
        .chat-messages {
          height: 220px; overflow-y: auto;
          padding: 14px; display: flex;
          flex-direction: column; gap: 8px;
          scrollbar-width: none; scroll-behavior: smooth;
        }
        .chat-messages::-webkit-scrollbar { display: none; }
        .chat-msg {
          max-width: 82%; padding: 8px 12px;
          border-radius: 10px; font-size: 12px; line-height: 1.5;
          animation: msgPop 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes msgPop {
          from { opacity: 0; transform: scale(0.88) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .chat-msg-bot {
          background: var(--bg2); border: 1px solid var(--border);
          color: var(--text); align-self: flex-start;
          border-radius: 4px 10px 10px 10px;
        }
        .chat-msg-user {
          background: var(--red); color: #fff;
          align-self: flex-end; border-radius: 10px 4px 10px 10px;
        }
        .chat-typing {
          display: flex; gap: 4px; align-items: center;
          padding: 8px 12px; background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 4px 10px 10px 10px;
          align-self: flex-start; animation: msgPop 0.3s ease;
        }
        .chat-typing span {
          width: 5px; height: 5px; background: var(--text3);
          border-radius: 50%; animation: typingBounce 1.2s infinite;
        }
        .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
          0%,60%,100% { transform: translateY(0); }
          30%          { transform: translateY(-5px); }
        }
        .chat-input-bar {
          padding: 10px 14px; border-top: 1px solid var(--border);
          display: flex; gap: 8px; align-items: center;
          background: var(--bg2);
        }
        .chat-input-mock {
          flex: 1; background: var(--card-bg);
          border: 1px solid var(--border); border-radius: 8px;
          padding: 7px 12px; font-size: 11px; color: var(--text3);
        }
        .chat-send-mock {
          width: 28px; height: 28px; background: var(--red);
          border-radius: 8px; display: flex;
          align-items: center; justify-content: center;
          color: #fff; font-size: 13px; flex-shrink: 0;
        }
        .hero-right {
          position: relative;
          animation: fadeUp 1s ease 0.8s both;
        }
        .hero-right::before {
          content: ''; position: absolute; inset: -40px;
          background: radial-gradient(ellipse 80% 80% at 50% 50%, var(--red-glow), transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .hero-right > * { position: relative; z-index: 1; }
        .chat-badges {
          display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;
        }
        .chat-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--card-bg); border: 1px solid var(--border);
          border-radius: 20px; padding: 4px 10px;
          font-size: 11px; font-weight: 600; color: var(--text2);
          animation: fadeUp 0.5s ease both;
        }
        .chat-badge:nth-child(1) { animation-delay: 1.4s; }
        .chat-badge:nth-child(2) { animation-delay: 1.6s; }
        .chat-badge:nth-child(3) { animation-delay: 1.8s; }
        .chat-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; }
        .hero-stats {
          display: flex; gap: 0; margin-top: 40px;
          padding-top: 36px; border-top: 1px solid var(--border);
          opacity: 0; animation: fadeIn 1s ease 1.2s forwards;
        }
        .stat-item { flex: 1; padding-right: 28px; border-right: 1px solid var(--border); }
        .stat-item:last-child { border-right: none; padding-right: 0; padding-left: 28px; }
        .stat-item:not(:first-child):not(:last-child) { padding-left: 28px; }
      `}</style>

      <section className="hero" id="home" style={{ position: 'relative', overflow: 'hidden' }}>

        <div className="hero-bg" style={{ transform: `translateY(${scrollY * 0.4}px)` }} />
        <div className="grid-overlay" style={{ transform: `translateY(${scrollY * 0.2}px)` }} />

        {[...Array(10)].map((_, i) => (
          <div key={i} className="particle" style={{
            width: `${Math.random() * 3 + 2}px`,
            height: `${Math.random() * 3 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '--dur': `${Math.random() * 4 + 3}s`,
            '--delay': `${Math.random() * 4}s`,
          } as React.CSSProperties} />
        ))}

        <div className="hero-inner">
          <div className="hero-heading-wrap" style={{ transform: `translateY(${scrollY * 0.15}px)`, transition: 'transform 0.1s linear' }}>
            <div className="hero-eyebrow">AI Chatbot Platform</div>
            <h1>
              Build Your Own
              <span className="line-red">AI Chatbot</span>
              <span className="stroke-text">In Minutes.</span>
            </h1>
          </div>

          <div className="hero-bottom" style={{ gridTemplateColumns: '1fr 320px' }}>
            <div>
              <p className="hero-desc">
                Train a custom AI chatbot on your business data — deploy it anywhere,
                capture leads automatically, and let it work 24/7 while you focus on
                what matters.
              </p>
              <div className="hero-actions">
                <Link href="/create-chatbot" className="btn-primary">
                  Create Your Chatbot <span className="btn-arrow">→</span>
                </Link>
                <Link href="/pricing" className="btn-ghost">View Pricing</Link>
              </div>
              <div className="hero-stats">
                {[
                  { num: '7', suffix: ' days', label: 'Free Trial' },
                  { num: '5 min', suffix: '', label: 'Setup Time' },
                  { num: '24/7', suffix: '', label: 'Always Online' },
                ].map((s) => (
                  <div className="stat-item" key={s.label}>
                    <div className="stat-num">
                      <span>{s.num}</span>
                      {s.suffix && <span style={{ color: 'var(--text2)', fontSize: 18 }}>{s.suffix}</span>}
                    </div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-right" style={{ transform: `translateY(${scrollY * -0.08}px)`, transition: 'transform 0.1s linear' }}>
              <div className="chat-demo" id="hero-mockup-card" style={{ transition: 'transform 0.1s ease' }}>
                <div className="chat-demo-header">
                  <div className="chat-demo-avatar">JZ</div>
                  <div>
                    <div className="chat-demo-name">JZAI Assistant</div>
                    <div className="chat-demo-status">Online</div>
                  </div>
                  <div className="chat-demo-dots">
                    <span style={{ background: '#ff5f57' }} />
                    <span style={{ background: '#febc2e' }} />
                    <span style={{ background: '#28c840' }} />
                  </div>
                </div>
                <div className="chat-messages" id="chat-messages-window">
                  {CHAT_MESSAGES.map((msg, i) =>
                    visibleMessages.includes(i) ? (
                      <div key={i} className={`chat-msg ${msg.role === 'bot' ? 'chat-msg-bot' : 'chat-msg-user'}`}>
                        {msg.text}
                      </div>
                    ) : null
                  )}
                  {typing && (
                    <div className="chat-typing">
                      <span /><span /><span />
                    </div>
                  )}
                </div>
                <div className="chat-input-bar">
                  <div className="chat-input-mock">Type a message…</div>
                  <div className="chat-send-mock">→</div>
                </div>
              </div>
              <div className="chat-badges">
                <div className="chat-badge"><span className="chat-badge-dot" />Lead Capture</div>
                <div className="chat-badge"><span className="chat-badge-dot" />AI Powered</div>
                <div className="chat-badge"><span className="chat-badge-dot" />No Code</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
