'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    const saved = (localStorage.getItem('jzai-theme') as 'dark' | 'light') || 'dark'
    setTheme(saved)
    applyTheme(saved)
  }, [])

  function applyTheme(t: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', t)
    updateFavicon(t)
  }

  function updateFavicon(t: 'dark' | 'light') {
    const jColor = t === 'dark' ? '#ffffff' : '#050507'
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <text y="87" font-size="75" font-family="Palatino, serif" font-weight="900">
        <tspan fill="${jColor}">J</tspan><tspan fill="#E8001E">Z</tspan>
      </text>
    </svg>`
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (favicon) favicon.href = 'data:image/svg+xml,' + encodeURIComponent(svg)
  }

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setFlashing(true)
    setTimeout(() => setFlashing(false), 300)
    setTheme(next)
    applyTheme(next)
    localStorage.setItem('jzai-theme', next)
  }

  return (
    <>
      <div className={`theme-flash${flashing ? ' active' : ''}`}></div>
      <button
        className="theme-toggle"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        title="Toggle theme"
      >
        <span className="toggle-icon-dark">🌙</span>
        <div className="toggle-thumb" id="toggleThumb">
          <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
        </div>
        <span className="toggle-icon-light">☀️</span>
      </button>
    </>
  )
}
