'use client'
import { useEffect, useRef, ReactNode } from 'react'

interface Props {
  children: ReactNode
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleIn'
  delay?: number
}

export default function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.opacity = '0'
    if (animation === 'fadeUp' || animation === 'fadeIn')
      el.style.transform = 'translateY(32px)'
    if (animation === 'slideLeft')
      el.style.transform = 'translateX(40px)'
    if (animation === 'slideRight')
      el.style.transform = 'translateX(-40px)'
    if (animation === 'scaleIn')
      el.style.transform = 'scale(0.92)'

    el.style.transition = `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'none'
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animation, delay])

  return <div ref={ref}>{children}</div>
}
