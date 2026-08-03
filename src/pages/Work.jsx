import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { projects, disciplines } from '../data/projects'
import { easeSoft } from '../lib/motion'
import Reveal from '../components/Reveal'
import WorkCard from '../components/WorkCard'
import WorkStrip from '../components/WorkStrip'
import PageTransition from '../components/PageTransition'

export default function Work() {
  const { t } = useLang()
  const [filter, setFilter] = useState('All')

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.disciplines.includes(filter))

  const filters = ['All', ...disciplines]

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52">
        <Reveal className="mb-4">
          <span className="label">{t.workPage.eyebrow}</span>
        </Reveal>
        <Reveal>
          <h1 className="display text-6xl md:text-8xl">
            {t.workPage.title} <span className="ital text-accent">{t.workPage.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted">{t.workPage.sub}</p>
        </Reveal>
      </section>

      {/* Full-bleed work showcase strip */}
      <section className="mb-8 pl-6 md:pl-10">
        <Reveal>
          <WorkStrip projects={projects} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10">
        <Reveal className="mb-12 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                filter === f
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-line text-muted hover:border-text hover:text-text'
              }`}
            >
              {f === 'All' ? t.workPage.filterAll : f}
            </button>
          ))}
        </Reveal>
        <motion.div layout className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: easeSoft }}
                className={i % 2 === 1 ? 'md:mt-16' : ''}
              >
                <WorkCard project={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </PageTransition>
  )
}
