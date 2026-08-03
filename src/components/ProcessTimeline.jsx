import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { process } from '../data/site'
import Reveal from './Reveal'
import MaskReveal from './MaskReveal'

// A single step cell: hatched base with a "paper" fill that wipes down as the
// scroll percentage moves through this step's slice.
function StepCard({ progress, i, n, step, lang, cellClass }) {
  const height = useTransform(progress, [i / n, (i + 0.85) / n], ['0%', '100%'], { clamp: true })
  return (
    <div className={`relative bg-bg ${cellClass}`}>
      <div className="hatch pointer-events-none absolute inset-0" />
      <motion.div style={{ height }} className="absolute inset-x-0 top-0 overflow-hidden bg-paper">
        <div className="w-full p-6">
          <p className="text-base font-medium text-[#0b0b0d]">
            {i + 1}. {step.title[lang]}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#0b0b0d]/70">{step.desc[lang]}</p>
        </div>
      </motion.div>
    </div>
  )
}

// Editorial staircase: step cards descend diagonally; each fills in continuously
// as you scroll. Desktop = diagonal grid, mobile = stacked cards.
export default function ProcessTimeline() {
  const { t, lang } = useLang()
  const ref = useRef(null)
  const n = process.length

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 90%'] })

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      {/* Header + CTA */}
      <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <Reveal className="mb-4">
            <span className="label">{t.homeProcess.label}</span>
          </Reveal>
          <MaskReveal>
            <h2 className="display text-5xl md:text-7xl">
              {t.homeProcess.title} <span className="ital text-accent-text">{t.homeProcess.titleAccent}</span>
            </h2>
          </MaskReveal>
        </div>
        <Reveal>
          <Link
            to="/contact"
            className="group inline-flex items-center justify-between gap-10 rounded-xl border border-line px-6 py-5 text-sm transition-colors hover:border-text/40 md:w-72"
          >
            {t.homeProcess.cta}
            <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
          </Link>
        </Reveal>
      </div>

      <div ref={ref}>
        {/* Desktop staircase */}
        <div
          className="hidden gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid"
          style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
        >
          {Array.from({ length: n }).map((_, r) =>
            Array.from({ length: n }).map((__, c) =>
              r === c ? (
                <StepCard
                  key={`${r}-${c}`}
                  progress={scrollYProgress}
                  i={r}
                  n={n}
                  step={process[r]}
                  lang={lang}
                  cellClass="min-h-[156px]"
                />
              ) : (
                <div key={`${r}-${c}`} className="relative min-h-[156px] bg-bg">
                  <div className="hatch pointer-events-none absolute inset-0" />
                </div>
              ),
            ),
          )}
        </div>

        {/* Mobile stacked */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:hidden">
          {process.map((step, i) => (
            <StepCard
              key={step.n}
              progress={scrollYProgress}
              i={i}
              n={n}
              step={step}
              lang={lang}
              cellClass="min-h-[132px]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
