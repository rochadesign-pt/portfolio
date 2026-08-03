import { useRef, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { process } from '../data/site'
import Reveal from './Reveal'
import MaskReveal from './MaskReveal'

// Scroll-driven process timeline. On desktop the steps sit in a row and a
// horizontal line fills left→right as you scroll; on mobile they stack and a
// vertical line fills top→bottom. Each step lights up as the fill reaches it.
export default function ProcessTimeline() {
  const { t, lang } = useLang()
  const ref = useRef(null)
  const [active, setActive] = useState(-1)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 62%', 'end 78%'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(process.length - 1, Math.floor(v * process.length - 0.0001)))
  })

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="mb-16 max-w-2xl">
        <Reveal className="mb-4">
          <span className="label">{t.homeProcess.label}</span>
        </Reveal>
        <MaskReveal>
          <h2 className="display text-5xl md:text-7xl">
            {t.homeProcess.title} <span className="ital text-accent">{t.homeProcess.titleAccent}</span>
          </h2>
        </MaskReveal>
        <Reveal className="mt-5">
          <p className="text-muted">{t.homeProcess.sub}</p>
        </Reveal>
      </div>

      <div ref={ref} className="relative">
        {/* Desktop horizontal rail */}
        <div className="absolute inset-x-0 top-[23px] hidden h-px bg-line md:block">
          <motion.div className="h-full origin-left bg-accent" style={{ scaleX: scrollYProgress }} />
        </div>
        {/* Mobile vertical rail */}
        <div className="absolute bottom-6 left-[23px] top-6 w-px bg-line md:hidden">
          <motion.div className="h-full w-full origin-top bg-accent" style={{ scaleY: scrollYProgress }} />
        </div>

        <div className="flex flex-col gap-12 md:flex-row md:gap-6">
          {process.map((step, i) => {
            const on = i <= active
            return (
              <div key={step.n} className="relative flex gap-6 md:block md:flex-1">
                <div
                  className={`relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full border transition-colors duration-500 ${
                    on ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-bg text-muted'
                  }`}
                >
                  <span className="display text-lg">{step.n}</span>
                </div>
                <div className={`transition-opacity duration-500 md:mt-7 ${on ? 'opacity-100' : 'opacity-40'}`}>
                  <h3 className="text-2xl">{step.title[lang]}</h3>
                  <p className="mt-2 max-w-xs text-sm text-muted">{step.desc[lang]}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
