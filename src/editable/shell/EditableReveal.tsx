'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  /** Position in a stagger sequence — later items pause slightly longer. */
  index?: number
  /** Per-item delay in ms; defaults to 90ms × index. */
  delayMs?: number
  /** Override tag; defaults to `div`. */
  as?: 'div' | 'section' | 'header' | 'article' | 'li' | 'span'
  className?: string
  style?: CSSProperties
}

/*
  Intersection-observer driven fade + slide-up on scroll.

  - JS-off / SSR: content is fully visible (no hidden state until mounted).
  - Reduced motion: EditableReveal CSS falls back to `opacity: 1` immediately.
  - Stagger: sequential `index` produces cascading appearance.
*/
export function EditableReveal({
  children,
  index = 0,
  delayMs,
  as = 'div',
  className,
  style,
}: EditableRevealProps) {
  const nodeRef = useRef<HTMLElement | null>(null)
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = nodeRef.current
    if (!el) return
    setArmed(true)
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setVisible(true)
              observer.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      observer.observe(el)
      return () => observer.disconnect()
    }
    setVisible(true)
  }, [])

  const delay = typeof delayMs === 'number' ? delayMs : index * 90
  const composedStyle: CSSProperties = {
    ...style,
    transitionDelay: armed && !visible ? `${delay}ms` : undefined,
  }
  const composedClassName = [
    'editable-reveal',
    armed ? 'editable-reveal-armed' : '',
    visible ? 'is-visible' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  const Tag = as as any
  return (
    <Tag ref={nodeRef as any} className={composedClassName} style={composedStyle}>
      {children}
    </Tag>
  )
}

export default EditableReveal
