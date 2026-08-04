import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Soft, scroll-driven background wash for a section. A tint (paper by default,
// so it warms in dark and stays light-neutral in light) swells in and back out
// as the section passes through the viewport — the CTA colour-transition idea,
// dialled right down. Theme-aware via the token class; cheap enough for mobile.
export default function ScrollBg({ children, className = '', tint = 'bg-paper', peak = 0.07 }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, peak, 0])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${tint}`} style={{ opacity }} />
      <div className="relative">{children}</div>
    </div>
  )
}
