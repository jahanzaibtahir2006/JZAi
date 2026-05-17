'use client'
import { useState } from 'react'

const WA_NUMBER = '923305169839'
const WA_MESSAGE = encodeURIComponent("Hi! I visited JZAI.store and I'm interested in your services. Can we connect?")
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <style>{`
        .wa-wrap {
          position: fixed;
          bottom: 96px;
          left: 24px;
          z-index: 2147483640;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wa-btn {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9f1239, #e11d48);
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(225,29,72,0.45);
          transition: transform 0.25s, box-shadow 0.25s;
          animation: waPop 0.5s cubic-bezier(0.34,1.56,0.64,1);
          flex-shrink: 0;
          text-decoration: none;
        }
        @keyframes waPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .wa-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 28px rgba(225,29,72,0.55);
        }

        /* Pulse ring */
        .wa-btn::before {
          content: '';
          position: absolute;
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 2px solid rgba(225,29,72,0.5);
          animation: waPulse 2.2s ease-out infinite;
        }
        @keyframes waPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0; }
        }

        /* Tooltip */
        .wa-tooltip {
          background: #111;
          border: 1px solid rgba(225,29,72,0.25);
          border-radius: 10px;
          padding: 8px 14px;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          animation: waTooltipIn 0.2s ease;
          pointer-events: none;
        }
        @keyframes waTooltipIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .wa-tooltip-title {
          font-size: 13px; font-weight: 600;
          color: #f0f0f0; font-family: 'DM Sans', sans-serif;
        }
        .wa-tooltip-sub {
          font-size: 11px; color: #e11d48;
          font-family: 'DM Sans', sans-serif; margin-top: 2px;
        }

        [data-theme="light"] .wa-tooltip {
          background: #ffffff;
          border-color: rgba(208,16,46,0.2);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        [data-theme="light"] .wa-tooltip-title { color: #0f0f14; }

        @media (max-width: 480px) {
          .wa-wrap { bottom: 80px; left: 16px; }
          .wa-btn  { width: 46px; height: 46px; }
          .wa-btn::before { width: 46px; height: 46px; }
        }
      `}</style>

      <div className="wa-wrap">
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="wa-btn"
          aria-label="Chat on WhatsApp"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* WhatsApp SVG icon */}
          <svg width="26" height="26" viewBox="0 0 32 32" fill="white">
            <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.7A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.8c-2.1 0-4.1-.56-5.85-1.6l-.42-.25-4.03 1 1.02-3.93-.27-.44A10.78 10.78 0 0 1 5.2 16C5.2 9.98 10.0 5.2 16 5.2S26.8 9.98 26.8 16 22.02 26.8 16 26.8zm5.93-8.07c-.32-.16-1.9-.94-2.2-1.04-.3-.1-.51-.16-.73.16-.22.32-.84 1.04-1.03 1.26-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.58-1.6-.96-.85-1.6-1.9-1.79-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.57.16-.19.22-.32.32-.54.1-.22.05-.41-.03-.57-.08-.16-.73-1.76-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.22 0-.57.08-.87.41-.3.32-1.13 1.1-1.13 2.7s1.16 3.13 1.32 3.35c.16.22 2.28 3.48 5.52 4.88.77.33 1.37.53 1.84.68.77.24 1.47.21 2.03.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.22-.62-.38z"/>
          </svg>
        </a>

        {hovered && (
          <div className="wa-tooltip">
            <div className="wa-tooltip-title">Chat on WhatsApp</div>
            <div className="wa-tooltip-sub">Usually replies within minutes ⚡</div>
          </div>
        )}
      </div>
    </>
  )
}
