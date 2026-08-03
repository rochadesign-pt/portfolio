import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { explorations } from '../data/site'
import Cover from './Cover'
import Reveal from './Reveal'

// Draggable "lab" strip — off-brief experiments. Tactile, playful counterpoint
// to the polished case studies. Drag on desktop; native scroll on touch.
export default function Exploration() {
  const { t, lang } = useLang()
  const container = useRef(null)

  return (
    <section className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <Reveal className="mb-4">
              <span className="label">{t.exploration.label}</span>
            </Reveal>
            <Reveal>
              <h2 className="display text-5xl md:text-7xl">
                {t.exploration.title} <span className="ital text-accent">{t.exploration.titleAccent}</span>
              </h2>
            </Reveal>
            <Reveal className="mt-5 max-w-md">
              <p className="text-muted">{t.exploration.sub}</p>
            </Reveal>
          </div>
          <Reveal className="hidden shrink-0 items-center gap-2 text-sm text-muted md:flex">
            <span className="label">{t.exploration.hint}</span>
            <span aria-hidden>⇽ ⇾</span>
          </Reveal>
        </div>
      </div>

      {/* Draggable track (full-bleed) */}
      <div ref={container} className="cursor-grab overflow-hidden active:cursor-grabbing">
        <motion.div
          drag="x"
          dragConstraints={container}
          dragElastic={0.06}
          className="flex w-max gap-4 px-6 md:px-10"
        >
          {explorations.map((e, i) => (
            <div key={i} className="w-[220px] flex-none select-none md:w-[300px]">
              <Cover colors={e.colors} className="pointer-events-none aspect-[3/4] w-full rounded-2xl" />
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-text">{e.tag[lang]}</span>
                <span className="tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
