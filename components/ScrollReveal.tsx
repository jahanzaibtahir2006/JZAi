'use client'
import { useEffect, useRef, ReactNode } from 'react'

export default function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.classList.add('visible')
  }, [])

  return (
    <div className="reveal" ref={ref}>
      {children}
    </div>
  )
}
