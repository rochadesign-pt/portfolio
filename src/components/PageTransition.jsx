import { motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'

// Wraps each page. On normal navigation the pages hand off with an upward
// motion — the outgoing page lifts and fades, the incoming one rises in and
// settles — matching the site's upward-reveal language (hero, CTA, timelines).
// `instant` skips the entrance (used when arriving via the click-to-zoom, so the
// page is already solid underneath the growing overlay) and MUST stay as-is.
const EASE_OUT = [0.16, 1, 0.3, 1] // expo-out — smooth, confident
const EASE_IN = [0.4, 0, 0.2, 1]

export default function PageTransition({ children, instant = false }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    // Reset Lenis' own scroll target, not just the window — otherwise Lenis
    // re-applies the previous page's scroll offset on the next frame and the new
    // page jumps down to it (e.g. arriving at a case study via the zoom).
    const lenis = window.__lenis
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }, [])

  if (instant) {
    return (
      <motion.main initial={false} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        {children}
      </motion.main>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: reduce ? 0 : 34, scale: reduce ? 1 : 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: reduce ? 0 : -22,
        scale: reduce ? 1 : 0.992,
        transition: { duration: reduce ? 0.15 : 0.4, ease: EASE_IN },
      }}
      transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE_OUT }}
      style={{ transformOrigin: 'center top', willChange: 'transform, opacity' }}
    >
      {children}
    </motion.main>
  )
}
