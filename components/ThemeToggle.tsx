'use client'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [flashing, setFlashing] = useState(false)

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
    setFlashing(true)
    setTimeout(() => setFlashing(false), 300)
    updateFavicon(theme === 'dark' ? 'light' : 'dark')
    toggleTheme()
  }

  return (
    <>
      <div className={`theme-flash${flashing ? ' active' : ''}`}></div>
      <button
        className="theme-toggle"
        onClick={toggle}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark mode'}
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
