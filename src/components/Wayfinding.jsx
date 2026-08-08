import { motion, useScroll, useSpring } from 'framer-motion'

// A quiet wayfinding layer: a hairline progress bar pinned to the top edge,
// tracking read depth. (The right-side section dot rail was removed.)
export default function Wayfinding() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent-text"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
