import { motion, useReducedMotion } from 'framer-motion'

// Masked word reveal — words rise from behind a clip. The premium alternative
// to a plain fade. `trigger` = 'view' (on scroll) or 'mount' (immediately).
export default function MaskText({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.055,
  trigger = 'view',
  active = true,
  as = 'span',
}) {
  const reduce = useReducedMotion()
  const words = String(text).split(' ')
  const Tag = motion[as] || motion.span

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay } },
  }
  const word = {
    hidden: { y: reduce ? 0 : '115%' },
    show: { y: 0, transition: { duration: reduce ? 0.2 : 0.85, ease: [0.22, 1, 0.3, 1] } },
  }

  const viewProps =
    trigger === 'view'
      ? { whileInView: 'show', viewport: { once: true, margin: '-8%' } }
      : { animate: active ? 'show' : 'hidden' }

  return (
    <Tag variants={container} initial="hidden" {...viewProps} className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-flex overflow-hidden pb-[0.12em] align-bottom">
          <motion.span variants={word} className={`inline-block ${wordClassName}`}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
