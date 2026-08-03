import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'

// Wraps each page. Fades content in and resets scroll on route change.
export default function PageTransition({ children }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
