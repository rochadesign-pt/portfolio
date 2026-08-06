import { useRef, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

// Vertical columns whose widths shrink left→right, revealed bottom-up on a
// per-column stagger — the "pattern of shrinking rectangles" that transitions
// the section from the page colour to the inverted (footer) colour.
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
const COLUMNS = buildColumns(12)

// Scattered positions for the service tags, tuned per breakpoint. Pills sit
// upright (no rotation) and stay out of the central band where the headline and
// the CTA button live, so nothing overlaps the type or the button.
const TAG_POS_DESKTOP = [
  { top: '18%', left: '12%' },
  { top: '15%', left: '67%' },
  { top: '45%', left: '6%' },
  { top: '43%', left: '80%' },
  { top: '76%', left: '20%' },
  { top: '73%', left: '70%' },
]
// Mobile: the headline + centred button fill the vertical middle, so the pills
// live only in the top and bottom thirds, spread across the width.
const TAG_POS_MOBILE = [
  { top: '12%', left: '8%' },
  { top: '22%', left: '46%' },
  { top: '66%', left: '6%' },
  { top: '80%', left: '50%' },
  { top: '82%', left: '8%' },
  { top: '68%', left: '58%' },
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

// Service tags read as quiet, secondary chips so the single yellow CTA keeps
// the emphasis: fill matches the (revealed) background via the inverted tokens,
// so they adapt to light/dark on their own, defined only by a hairline border.
const tagClass =
  'theme-invert absolute inline-block rounded-full border border-line bg-bg px-3 py-1.5 text-sm font-medium text-text md:px-3.5'

const HIDDEN = 'inset(100% 0% 0% 0%)'
const SHOWN = 'inset(0% 0% 0% 0%)'

// Closing CTA. Starts in the page colour (continuous with the section above),
// then a shrinking-rectangle pattern reveals the inverted colour, which the
// footer also uses — so page → CTA → footer reads as one continuous flow.
//
// The reveal is driven by a plain scroll listener that reads the section's live
// position and writes clip-path (+ -webkit-clip-path) straight onto the column
// nodes. No framer scroll/inView hooks: it tracks native touch scroll and Lenis
// alike, on every browser, and can't get stuck on a stale measurement.
// `stacked` (homepage): the CTA is the second half of a sticky stack — it slides
// up and over the pinned "lab", so the slide itself is the reveal. Running the
// columnar clip-path on top of that motion reads as a blocky staircase, so in
// this mode the CTA arrives already solid (fully inverted) and just glides up.
export default function CTASection({ stacked = false }) {
  const { t } = useLang()
  const { pathname } = useLocation()
  const ref = useRef(null)
  const colRefs = useRef([])
  const reduce = useReducedMotion()
  const isContact = pathname === '/contact'
  const [isMobile, setIsMobile] = useState(false)
  const initialClip = stacked ? SHOWN : HIDDEN

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setIsMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    // In stacked mode the columns stay fully shown (solid), so there's no reveal
    // loop to run — the rise over the lab carries the motion instead.
    if (isContact || stacked) return
    const section = ref.current
    if (!section) return

    // Read the section's live position every animation frame while it's near
    // the viewport and write clip-path straight onto the columns. A rAF loop
    // (not scroll events) is the reliable driver on iOS Safari, where scroll
    // events are throttled/suppressed during momentum scrolling — and it needs
    // no reduced-motion branch, since the reveal is tied to the user's own
    // scroll rather than being autonomous motion.
    const apply = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 0 as the section enters from the bottom → 1 as its top nears the top.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.9)))
      for (let i = 0; i < COLUMNS.length; i++) {
        const col = COLUMNS[i]
        const node = colRefs.current[i]
        if (!node) continue
        const cp = Math.min(1, Math.max(0, (p - col.start) / (col.end - col.start)))
        const clip = `inset(${((1 - cp) * 100).toFixed(2)}% 0% 0% 0%)`
        node.style.clipPath = clip
        node.style.webkitClipPath = clip
      }
    }

    // A single always-on rAF loop while the section is mounted. One rect read +
    // 12 style writes per frame is trivial, and it removes every point of
    // failure (scroll events, observers) that could leave the reveal stuck.
    let rafId = requestAnimationFrame(function loop() {
      apply()
      rafId = requestAnimationFrame(loop)
    })

    return () => cancelAnimationFrame(rafId)
  }, [isContact, pathname, stacked])

  if (isContact) return null

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
        {COLUMNS.map((col, i) => (
          <div
            key={i}
            ref={(el) => (colRefs.current[i] = el)}
            className="theme-invert absolute inset-y-0 overflow-hidden bg-bg"
            style={{ left: `${col.left}%`, width: `${col.width}%`, clipPath: initialClip, WebkitClipPath: initialClip }}
          >
            <div
              className="absolute inset-y-0"
              style={{ left: `${-(col.left / col.width) * 100}%`, width: `${10000 / col.width}%` }}
            >
              <Headline line={line} />
            </div>
          </div>
        ))}
      </div>

      {/* Service tags — scattered / floating over the type */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {tags.map((tag, i) => {
          const positions = isMobile ? TAG_POS_MOBILE : TAG_POS_DESKTOP
          const p = positions[i % positions.length]
          return (
            <motion.span
              key={i}
              initial={reduce ? false : { opacity: 0, scale: 0.85, y: 10 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: [0.34, 1.4, 0.64, 1] }}
              className={tagClass}
              style={{ top: p.top, left: p.left }}
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
