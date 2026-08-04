import { useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

// Deliberate branded moment — fixed colors so it reads the same in both themes.
const INK = '#0b0b0d'
const PAPER = '#efeadf'
const CHALK = '#f2efe9'

function Headline({ line, color, as: Tag = 'div', ...rest }) {
  return (
    <div className="mx-auto flex h-full max-w-[1500px] items-center px-6 md:px-10">
      <Tag
        className="display w-full text-center uppercase leading-[0.9] tracking-tight text-[15vw] md:text-[10.5rem]"
        style={{ color }}
        {...rest}
      >
        {line}
      </Tag>
    </div>
  )
}

// Closing CTA. As the section scrolls through the viewport a paper-coloured
// panel wipes up from the bottom, turning it black → light and inverting the
// headline; a yellow pill (always crisp on top) routes to the contact form.
export default function CTASection() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const ref = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  )

  // Already on the contact page — no need to send them there again.
  if (pathname === '/contact') return null

  const line = t.bigCta.line

  return (
    <section ref={ref} className="relative min-h-[82vh] overflow-hidden" style={{ backgroundColor: INK }}>
      {/* Base — light headline on ink */}
      <div className="absolute inset-0">
        <Headline as="h2" line={line} color={CHALK} />
      </div>

      {/* Paper layer wipes up, inverting the headline to ink */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: PAPER, clipPath: reduce ? 'inset(0% 0% 0% 0%)' : clipPath }}
      >
        <Headline line={line} color={INK} />
      </motion.div>

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
