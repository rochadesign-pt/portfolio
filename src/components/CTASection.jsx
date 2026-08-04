import { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

const N = 14

// Vertical columns whose widths shrink left→right, revealed bottom-up on a
// per-column stagger — the "pattern of shrinking rectangles" that transitions
// the section from the page colour to the inverted (footer) colour.
function buildColumns() {
  const weights = Array.from({ length: N }, (_, i) => 1.7 - i * (1.25 / N))
  const total = weights.reduce((a, b) => a + b, 0)
  const OV = 0.5 // overlap each side so tiles never leave a sub-pixel seam
  let acc = 0
  return weights.map((w, i) => {
    const left = (acc / total) * 100 - OV
    const width = (w / total) * 100 + OV * 2
    acc += w
    const start = (i / N) * 0.55
    return { left, width, start, end: start + 0.45 }
  })
}
const COLUMNS = buildColumns()

function Headline({ line, as: Tag = 'div', ...rest }) {
  return (
    <div className="mx-auto flex h-full max-w-[1500px] items-center px-6 md:px-10">
      <Tag
        className="display w-full text-center uppercase leading-[0.9] tracking-tight text-text text-[15vw] md:text-[10.5rem]"
        {...rest}
      >
        {line}
      </Tag>
    </div>
  )
}

// A single revealing column: shows its vertical slice of the inverted-colour
// headline, wiped in from the bottom.
function Column({ progress, col, line, frozen }) {
  const clip = useTransform(
    progress,
    [col.start, col.end],
    ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
    { clamp: true },
  )
  return (
    <motion.div
      className="theme-invert absolute inset-y-0 overflow-hidden bg-bg"
      style={{ left: `${col.left}%`, width: `${col.width}%`, clipPath: frozen ? 'inset(0% 0% 0% 0%)' : clip }}
    >
      {/* full-viewport-width inner so each slice of the headline registers 1:1 */}
      <div className="absolute inset-y-0" style={{ left: `${-(col.left / col.width) * 100}%`, width: `${10000 / col.width}%` }}>
        <Headline line={line} />
      </div>
    </motion.div>
  )
}

// Closing CTA. Starts in the page colour (continuous with the section above),
// then a shrinking-rectangle pattern reveals the inverted colour, which the
// footer also uses — so page → CTA → footer reads as one continuous flow. A
// yellow pill (crisp on top) routes to the contact form.
export default function CTASection() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  // Scroll-scrubbing 14 clipped columns is too heavy on phones — freeze the
  // reveal there and show the resolved (inverted) colour, so the CTA still
  // flows continuously into the footer without the jank.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setIsMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const frozen = reduce || isMobile

  if (pathname === '/contact') return null

  const line = t.bigCta.line

  return (
    <section ref={ref} className="relative min-h-[68vh] overflow-hidden bg-bg md:min-h-[82vh]">
      {/* Base — page-colour headline */}
      <div className="absolute inset-0">
        <Headline as="h2" line={line} />
      </div>

      {/* Shrinking-rectangle reveal of the inverted colour */}
      <div aria-hidden="true" className="absolute inset-0">
        {COLUMNS.map((col, i) => (
          <Column key={i} progress={scrollYProgress} col={col} line={line} frozen={frozen} />
        ))}
      </div>

      {/* Pill CTA — centred over the type, crisp above both layers */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Link
          to="/contact"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-ink shadow-xl transition-transform duration-300 hover:scale-105 md:text-lg"
        >
          {t.bigCta.button}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  )
}
