import { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

// Vertical columns whose widths shrink left→right, revealed bottom-up on a
// per-column stagger — the "pattern of shrinking rectangles" that transitions
// the section from the page colour to the inverted (footer) colour. Fewer
// columns on mobile so the scrubbed reveal stays cheap.
function buildColumns(n) {
  const weights = Array.from({ length: n }, (_, i) => 1.7 - i * (1.25 / n))
  const total = weights.reduce((a, b) => a + b, 0)
  const OV = 0.5 // overlap each side so tiles never leave a sub-pixel seam
  let acc = 0
  return weights.map((w, i) => {
    const left = (acc / total) * 100 - OV
    const width = (w / total) * 100 + OV * 2
    acc += w
    const start = (i / n) * 0.55
    return { left, width, start, end: start + 0.45 }
  })
}
const COLUMNS_DESKTOP = buildColumns(14)
const COLUMNS_MOBILE = buildColumns(6)

// Scattered positions for the service tags, tuned per breakpoint (kept clear of
// the centre where the CTA sits).
const TAG_POS_DESKTOP = [
  { top: '24%', left: '17%', rot: -4 },
  { top: '20%', left: '63%', rot: 3 },
  { top: '42%', left: '10%', rot: -2 },
  { top: '40%', left: '76%', rot: 4 },
  { top: '68%', left: '22%', rot: 3 },
  { top: '65%', left: '66%', rot: -3 },
]
// Mobile: keep the pills at the left/right margins and out of the central
// vertical band, where the (centred) CTA button sits — otherwise they cluster
// on top of it.
const TAG_POS_MOBILE = [
  { top: '16%', left: '8%', rot: -4 },
  { top: '28%', left: '45%', rot: 3 },
  { top: '63%', left: '6%', rot: -3 },
  { top: '38%', left: '4%', rot: 3 },
  { top: '76%', left: '43%', rot: -3 },
  { top: '88%', left: '20%', rot: 4 },
]

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

// Service tags read as quiet, secondary chips so the single yellow CTA keeps
// the emphasis: fill matches the (revealed) background via the inverted tokens,
// so they adapt to light/dark on their own, defined only by a hairline border.
const tagClass =
  'theme-invert absolute inline-block rounded-full border border-line bg-bg px-3 py-1.5 text-sm font-medium text-text md:px-3.5'

// Closing CTA. Starts in the page colour (continuous with the section above),
// then a shrinking-rectangle pattern reveals the inverted colour, which the
// footer also uses — so page → CTA → footer reads as one continuous flow.
// Scattered, floating service tags make the moment self-explanatory; a yellow
// pill routes to the contact form. Same effect on mobile, just fewer columns.
export default function CTASection() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setIsMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })

  if (pathname === '/contact') return null

  const columns = isMobile ? COLUMNS_MOBILE : COLUMNS_DESKTOP
  const positions = isMobile ? TAG_POS_MOBILE : TAG_POS_DESKTOP
  const line = t.bigCta.line
  const tags = t.bigCta.tags || []

  return (
    <section ref={ref} className="relative min-h-[82vh] overflow-hidden bg-bg md:min-h-[86vh]">
      {/* Base — page-colour headline */}
      <div className="absolute inset-0">
        <Headline as="h2" line={line} />
      </div>

      {/* Shrinking-rectangle reveal of the inverted colour */}
      <div aria-hidden="true" className="absolute inset-0">
        {columns.map((col, i) => (
          <Column key={i} progress={scrollYProgress} col={col} line={line} frozen={reduce} />
        ))}
      </div>

      {/* Service tags — scattered / floating over the type */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {tags.map((tag, i) => {
          const p = positions[i % positions.length]
          return (
            <motion.span
              key={i}
              initial={reduce ? false : { opacity: 0, scale: 0.8, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07, ease: [0.34, 1.4, 0.64, 1] }}
              className={tagClass}
              style={{ top: p.top, left: p.left, rotate: `${p.rot}deg` }}
            >
              {tag}
            </motion.span>
          )
        })}
      </div>

      {/* Pill CTA — centred over the type, crisp above every layer */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Link
          to="/contact"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-ink shadow-xl ring-4 ring-accent/20 transition-transform duration-300 hover:scale-105 md:text-lg"
        >
          {t.bigCta.button}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {/* Signature tagline — sits in the revealed (inverted) zone */}
      <div className="theme-invert pointer-events-none absolute inset-x-0 bottom-6 text-center">
        <span className="label text-muted">{t.bigCta.tagline}</span>
      </div>
    </section>
  )
}
