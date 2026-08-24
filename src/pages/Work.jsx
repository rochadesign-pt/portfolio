import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { disciplines } from '../data/projects'
import { useContent } from '../content/ContentProvider'
import { easeSoft } from '../lib/motion'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import WorkCard from '../components/WorkCard'
import WorkShowreel from '../components/WorkShowreel'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

export default function Work() {
  const { t } = useLang()
  const { projects } = useContent()
  useSeo(t.seo.work)
  const [filter, setFilter] = useState('All')

  const filtered =
    filter === 'All' ? projects : projects.filter((p) => (p.disciplines || []).includes(filter))

  const filters = ['All', ...disciplines]
  const featured = projects.slice(0, 5)

  return (
    <PageTransition>
      {/* Title hero */}
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52 md:pb-20">
        <Reveal className="mb-4">
          <span className="label">{t.workPage.eyebrow}</span>
        </Reveal>
        <MaskReveal>
          <h1 className="display text-6xl md:text-8xl">
            {t.workPage.title} <span className="emph">{t.workPage.titleAccent}</span>
          </h1>
        </MaskReveal>
        <Reveal className="mt-8 max-w-3xl md:mt-10">
          <p className="display text-2xl leading-[1.28] text-text md:text-[2rem] md:leading-[1.25]">
            {t.workPage.lead}
          </p>
        </Reveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-sm text-muted">{t.workPage.sub}</p>
        </Reveal>
      </section>

      {/* Featured — horizontal showreel */}
      {featured.length > 1 && (
        <>
          <div className="mx-auto max-w-[1400px] px-6 pb-8 md:px-10">
            <Reveal>
              <span className="label text-muted">{t.workPage.featuredLabel}</span>
            </Reveal>
          </div>
          <WorkShowreel projects={featured} />
        </>
      )}

      {/* Archive — filterable grid */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 md:px-10 md:pt-32">
        <Reveal className="mb-10 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <span className="label text-muted">{t.workPage.archiveLabel}</span>
          <div className="flex flex-wrap gap-2">
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
          </div>
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
                <WorkCard project={p} index={i} titleAs="h2" eager={i < 2} immediate={i < 2} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </PageTransition>
  )
}
