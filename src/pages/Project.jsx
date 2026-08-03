import { useEffect, useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { projects } from '../data/projects'
import { caseProcess } from '../data/site'
import Reveal from '../components/Reveal'
import Cover from '../components/Cover'
import ParallaxImage from '../components/ParallaxImage'
import ChapterNav from '../components/ChapterNav'
import PageTransition from '../components/PageTransition'

export default function Project() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const bodyRef = useRef(null)

  // Did we arrive via the click-to-zoom transition? If so, skip the page
  // entrance and hold the header text until the overlay has "landed".
  const [zoomEntry] = useState(() => {
    if (typeof window !== 'undefined' && window.__zoomEntry) {
      window.__zoomEntry = false
      return true
    }
    return false
  })
  const [landed, setLanded] = useState(!zoomEntry)

  useEffect(() => {
    if (!zoomEntry) return
    const on = () => setLanded(true)
    window.addEventListener('rds:zoomlanded', on)
    const fb = setTimeout(() => setLanded(true), 1400)
    return () => {
      window.removeEventListener('rds:zoomlanded', on)
      clearTimeout(fb)
    }
  }, [zoomEntry])

  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return <Navigate to="/work" replace />
  const p = projects[index]
  const moreCases = [projects[(index + 1) % projects.length], projects[(index + 2) % projects.length]]

  const meta = [
    { label: t.project.client, value: p.client },
    { label: t.project.industry, value: p.industry[lang] },
    { label: t.project.country, value: p.country },
    { label: t.project.year, value: p.year },
  ]

  const chapters = [
    { id: 'ch-context', label: t.project.context },
    { id: 'ch-challenge', label: t.project.challenge },
    { id: 'ch-approach', label: t.project.approach },
    { id: 'ch-process', label: t.project.process },
    { id: 'ch-results', label: t.project.results },
  ]

  const Para = ({ items }) => (
    <div className="flex max-w-2xl flex-col gap-4 text-lg leading-relaxed text-text/85">
      {items.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  )

  const Heading = ({ children }) => (
    <h2 className="ital text-accent text-4xl md:text-5xl">{children}</h2>
  )

  const scrollToBody = () => bodyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <PageTransition instant={zoomEntry}>
      {/* Full-bleed hero header — the zoom lands here */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        <ParallaxImage colors={p.cover} image={p.coverImage} className="absolute inset-0 h-full w-full" amount={6} />
        {/* legibility scrims */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/10" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/70 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 pb-14 pt-28 md:px-10 md:pb-16 md:pt-32">
          {/* Header text is held back until the zoom has landed, then rises in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: landed ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link to="/work" className="link-underline text-sm text-text/80 hover:text-text">
              ← {t.project.back}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={landed ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.3, 1], delay: 0.12 }}
          >
            <span className="mb-5 block text-xs font-medium uppercase tracking-[0.22em] text-text/70">
              {p.category}
            </span>
            <h1 className="display text-7xl leading-[0.88] md:text-[9rem]">{p.title}</h1>
            <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p className="ital max-w-2xl text-2xl leading-snug text-text/85 md:text-3xl">{p.tagline[lang]}</p>
              <button
                onClick={scrollToBody}
                className="link-underline flex shrink-0 items-center gap-2 text-sm text-text/80 hover:text-text"
              >
                {t.project.keepReading} ↓
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meta bar */}
      <section className="mx-auto max-w-[1400px] px-6 pt-14 md:px-10 md:pt-16">
        <Reveal className="grid grid-cols-2 gap-6 border-y border-line py-6 md:grid-cols-5">
          {meta.map((m) => (
            <div key={m.label}>
              <p className="label mb-1.5">{m.label}</p>
              <p className="text-sm text-text">{m.value}</p>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1">
            <p className="label mb-1.5">{t.project.services}</p>
            <p className="text-sm text-text">{p.services.join(', ')}</p>
          </div>
        </Reveal>
      </section>

      {/* Body: sticky chapter stepper + content */}
      <section ref={bodyRef} className="mx-auto max-w-[1400px] px-6 pt-20 md:px-10 md:pt-28">
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-[3fr_9fr]">
          {/* Chapter stepper */}
          <div className="hidden md:block">
            <div className="sticky top-28">
              <ChapterNav chapters={chapters} label={t.project.chapters} />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-16">
            {/* Context / lead */}
            <div id="ch-context" className="scroll-mt-28">
              <Reveal>
                <p className="display text-3xl leading-[1.2] md:text-4xl">{p.intro[lang]}</p>
              </Reveal>
            </div>

            {/* Full-width image */}
            <ParallaxImage colors={p.gallery[0]} className="aspect-[16/9] w-full rounded-2xl" />

            {/* Challenge */}
            <div id="ch-challenge" className="scroll-mt-28">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.challenge}</Heading>
                <Para items={p.challenge[lang]} />
              </Reveal>
            </div>

            {/* Wide image */}
            <ParallaxImage colors={p.gallery[4]} className="aspect-[2/1] w-full rounded-2xl" />

            {/* Approach */}
            <div id="ch-approach" className="scroll-mt-28">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.approach}</Heading>
                <Para items={p.approach[lang]} />
              </Reveal>
            </div>

            {/* Image pair — offset */}
            <div className="grid gap-4 md:grid-cols-2">
              <Reveal y={30}>
                <Cover colors={p.gallery[1]} className="aspect-[4/5] w-full rounded-2xl" />
              </Reveal>
              <Reveal y={30} className="md:mt-16">
                <Cover colors={p.gallery[2]} className="aspect-[4/5] w-full rounded-2xl" />
              </Reveal>
            </div>

            {/* Process */}
            <div id="ch-process" className="scroll-mt-28">
              <Reveal className="mb-8">
                <Heading>{t.project.process}</Heading>
              </Reveal>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                {caseProcess.map((step) => (
                  <Reveal key={step.n} className="bg-bg p-6 md:p-8">
                    <span className="display text-3xl text-accent">{step.n}</span>
                    <h3 className="mt-6 text-xl">{step.title[lang]}</h3>
                    <p className="mt-2 text-sm text-muted">{step.desc[lang]}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Three-up image row */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <Reveal y={30}>
                <Cover colors={p.gallery[5]} className="aspect-[3/4] w-full rounded-xl" />
              </Reveal>
              <Reveal y={30} className="md:mt-10">
                <Cover colors={p.gallery[3]} className="aspect-[3/4] w-full rounded-xl" />
              </Reveal>
              <Reveal y={30} className="col-span-2 md:col-span-1 md:mt-20">
                <Cover colors={p.gallery[6]} className="aspect-[16/10] w-full rounded-xl md:aspect-[3/4]" />
              </Reveal>
            </div>

            {/* Full-width image */}
            <ParallaxImage colors={p.gallery[7]} className="aspect-[16/9] w-full rounded-2xl" />

            {/* Results: outcome + quote + stats */}
            <div id="ch-results" className="flex scroll-mt-28 flex-col gap-12">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.outcome}</Heading>
                <Para items={p.outcome[lang]} />
              </Reveal>

              <Reveal>
                <blockquote className="border-t border-line pt-10">
                  <p className="display text-3xl leading-[1.25] md:text-4xl">“{p.quote.text[lang]}”</p>
                  <footer className="mt-6 flex items-center gap-3 text-sm">
                    <span className="h-8 w-8 rounded-full bg-accent" />
                    <span>
                      <span className="text-text">{p.quote.author}</span>
                      <span className="text-muted"> · {p.quote.role[lang]}</span>
                    </span>
                  </footer>
                </blockquote>
              </Reveal>

              <Reveal>
                <div className="border-t-2 border-accent pt-8">
                  <span className="label mb-8 block">{t.project.results}</span>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
                    {p.results.map((r) => (
                      <div key={r.label.en}>
                        <p className="display text-5xl md:text-6xl">{r.value}</p>
                        <p className="mt-2 text-sm text-muted">{r.label[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery band */}
      <section className="mx-auto max-w-[1400px] px-6 pt-24 md:px-10 md:pt-28">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[p.gallery[0], p.gallery[2], p.gallery[5], p.gallery[1]].map((g, i) => (
            <Reveal key={i} delay={(i % 4) * 0.05} className={i % 2 === 1 ? 'md:mt-10' : ''}>
              <Cover colors={g} className="aspect-[3/4] w-full rounded-xl" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* More cases */}
      <section className="mx-auto max-w-[1400px] px-6 pt-28 md:px-10 md:pt-36">
        <Reveal className="mb-12 border-t border-line pt-12">
          <h2 className="display text-5xl md:text-7xl">
            {t.project.moreCases} <span className="ital text-accent">{t.project.moreCasesAccent}</span>
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {moreCases.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link to={`/work/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-line">
                <div className="overflow-hidden">
                  <Cover colors={c.cover} className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-4 p-8">
                  <div>
                    <h3 className="display text-3xl md:text-4xl">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted">{c.category}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-ink transition-transform duration-500 group-hover:translate-x-1">
                    {t.project.readCase} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
