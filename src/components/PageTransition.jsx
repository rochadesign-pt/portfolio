import { motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'

// Wraps each page. Fades content in and resets scroll on route change.
// `instant` skips the entrance (used when arriving via the zoom transition, so
// the page is already solid underneath the overlay).
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
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.main>
  )
}
