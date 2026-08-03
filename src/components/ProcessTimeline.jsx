import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { process } from '../data/site'
import Reveal from './Reveal'
import MaskReveal from './MaskReveal'

// Editorial "staircase": step cards descend diagonally across a grid; empty
// cells are hatched. As you scroll, each card fills in (turns solid) in turn.
// Desktop = diagonal grid; mobile = stacked cards.
export default function ProcessTimeline() {
  const { t, lang } = useLang()
  const ref = useRef(null)
  const [active, setActive] = useState(-1)
  const n = process.length

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 85%'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(n - 1, Math.floor(v * n - 0.0001)))
  })

  const Card = ({ step, i, activeCard }) => (
    <div className={`relative min-h-[190px] p-6 transition-colors duration-500 ${activeCard ? 'bg-white' : 'bg-bg'}`}>
      {!activeCard && <div className="hatch pointer-events-none absolute inset-0" />}
      <div className="relative">
        <p className={`text-base font-medium ${activeCard ? 'text-[#0b0b0d]' : 'text-text/45'}`}>
          {i + 1}. {step.title[lang]}
        </p>
        {activeCard && <p className="mt-3 text-sm leading-relaxed text-[#0b0b0d]/70">{step.desc[lang]}</p>}
      </div>
    </div>
  )

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
              {t.homeProcess.title} <span className="ital text-accent">{t.homeProcess.titleAccent}</span>
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
            Array.from({ length: n }).map((__, c) => {
              const step = r === c ? process[r] : null
              const activeCard = Boolean(step) && r <= active
              if (!step) {
                return (
                  <div key={`${r}-${c}`} className="relative min-h-[190px] bg-bg">
                    <div className="hatch pointer-events-none absolute inset-0" />
                  </div>
                )
              }
              return <Card key={`${r}-${c}`} step={step} i={r} activeCard={activeCard} />
            }),
          )}
        </div>

        {/* Mobile stacked */}
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:hidden">
          {process.map((step, i) => (
            <Card key={step.n} step={step} i={i} activeCard={i <= active} />
          ))}
        </div>
      </div>
    </section>
  )
}
