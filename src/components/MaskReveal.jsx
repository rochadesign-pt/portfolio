import { motion, useReducedMotion } from 'framer-motion'

// Block-level masked reveal — the whole element rises from behind a clip on
// scroll-in. Works with any inline content (keeps serif-italic accents intact).
export default function MaskReveal({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div

  return (
    <div className={`overflow-hidden ${className}`} style={{ paddingBottom: '0.12em' }}>
      <Tag
        initial={{ y: reduce ? 0 : '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.22, 1, 0.3, 1], delay }}
      >
        {children}
      </Tag>
    </div>
  )
}
