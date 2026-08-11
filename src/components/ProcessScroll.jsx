import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { process } from '../data/site'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const EASE = [0.32, 0.72, 0, 1]
const N = process.length

// A cinematic, scroll-scrubbed take on the process. On desktop the section
// pins (via a tall wrapper + sticky inner — the same Lenis-friendly pattern as
// the home CTA and the globe, so it never touches the page-transition transforms
// or the click-to-zoom): a huge index morphs 01→04 as you scroll, a progress
// rail fills, and each step lights up and opens in turn. On mobile it degrades
// to a plain editorial list (no scrub — GPU-cheap).
export default function ProcessScroll() {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  const p = t.homeProcess

  const rootRef = useRef(null)
  const barRef = useRef(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const [desktop, setDesktop] = useState(true)

  useGSAP(
    () => {
      const mm = window.matchMedia('(min-width: 768px)')
      setDesktop(mm.matches)
      if (!mm.matches) return

      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const prog = self.progress
          if (barRef.current) barRef.current.style.transform = `scaleX(${prog})`
          const idx = Math.min(N - 1, Math.floor(prog * N))
          if (idx !== activeRef.current) {
            activeRef.current = idx
            setActive(idx)
          }
        },
      })
      return () => st.kill()
    },
    { scope: rootRef },
  )

  const showAll = !desktop
  const cur = process[active]

  return (
    <section ref={rootRef} className="relative md:h-[360vh]">
      <div className="flex items-center overflow-hidden py-24 md:sticky md:top-0 md:h-screen md:py-0">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 md:grid-cols-2 md:items-center md:gap-20 md:px-10">
          {/* Left — label, title, morphing index, progress, CTA */}
          <div>
            <span className="label">{p.label}</span>
            <h2 className="display mt-3 text-5xl md:text-7xl">
              {p.title} <span className="ital text-accent-text">{p.titleAccent}</span>
            </h2>

            {/* Huge morphing index — desktop only (needs the scrub) */}
            <div className="relative mt-10 hidden h-[13rem] md:block">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={cur.n}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: '45%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: '-45%' }}
                  transition={{ duration: reduce ? 0.2 : 0.6, ease: EASE }}
                  className="display absolute left-0 top-0 text-[13rem] leading-[0.8] text-accent-text"
                >
                  {cur.n}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="mt-8 hidden items-center gap-4 md:flex">
              <div className="h-px w-40 overflow-hidden bg-line">
                <div ref={barRef} className="h-px origin-left bg-accent-text" style={{ transform: 'scaleX(0)' }} />
              </div>
              <span className="font-mono text-xs text-muted">
                {cur.n} <span className="text-muted/50">/ {String(N).padStart(2, '0')}</span>
              </span>
            </div>

            <Link
              to="/contact"
              className="group mt-10 inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-text"
            >
              {p.cta}
              <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
            </Link>
          </div>

          {/* Right — the steps; active one lights up and opens */}
          <ul className="flex flex-col">
            {process.map((step, i) => {
              const on = showAll || i === active
              return (
                <li
                  key={step.n}
                  className={`border-t border-line py-6 transition-opacity duration-500 last:border-b md:py-7 ${
                    on ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`label transition-colors duration-500 ${on ? 'text-accent-text' : 'text-muted'}`}>
                      {step.n}
                    </span>
                    <h3 className="display text-2xl md:text-3xl">{step.title[lang]}</h3>
                  </div>
                  <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      on ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-md leading-relaxed text-muted">{step.desc[lang]}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
