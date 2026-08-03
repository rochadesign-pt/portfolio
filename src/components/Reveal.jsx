import { motion, useReducedMotion } from 'framer-motion'
import { easeSoft, viewportOnce } from '../lib/motion'

// Simple scroll-reveal wrapper. Fades + rises into view once.
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 24,
  className = '',
  ...rest
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: reduce ? 0.15 : 0.7, ease: easeSoft, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
