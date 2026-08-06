import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import MaskText from '../components/MaskText'
import MaskReveal from '../components/MaskReveal'
import { useContent } from '../content/ContentProvider'
import { services, stats } from '../data/site'
import { fadeUp } from '../lib/motion'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import Counter from '../components/Counter'
import WorkCard from '../components/WorkCard'
import Exploration from '../components/Exploration'
import DotField from '../components/DotField'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

function Hero() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [started, setStarted] = useState(false)

  // Start the hero entrance when the preloader finishes (or immediately if it
  // was skipped), with a safety fallback so content never stays hidden.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__rdsLoaded) {
      setStarted(true)
      return
    }
    const on = () => setStarted(true)
    window.addEventListener('rds:loaded', on)
    const fb = setTimeout(() => setStarted(true), 4500)
    return () => {
      window.removeEventListener('rds:loaded', on)
      clearTimeout(fb)
    }
  }, [])

  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-52">
      {/* Full-bleed dot field behind the hero — brightens around the cursor */}
      <DotField />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={started ? 'show' : 'hidden'}
          className="label mb-8"
        >
          {t.hero.eyebrow}
        </motion.p>

        <h1 className="display text-[12vw] leading-[0.92] md:text-[6rem] lg:text-[clamp(4rem,7.4vw,7.25rem)]">
          <MaskText as="span" text={t.hero.line1} className="block" trigger="mount" active={started} delay={0.05} />
          <MaskText as="span" text={t.hero.line2} className="block" trigger="mount" active={started} delay={0.14} />
          <MaskText
            as="span"
            text={t.hero.accent}
            className="block ital text-accent-text"
            trigger="mount"
            active={started}
            delay={0.24}
          />
        </h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={started ? 'show' : 'hidden'}
          transition={{ delay: 0.45 }}
          className="mt-10 flex max-w-xl flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md text-lg text-muted">{t.hero.sub}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex items-center gap-2 text-xs text-muted"
        >
          <motion.span
            animate={reduce ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
          <span className="label">{t.hero.scroll}</span>
        </motion.div>
      </div>
    </section>
  )
}

function IntroStatement() {
  const { t } = useLang()
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-8">
          <h2 className="label">{t.intro.label}</h2>
        </Reveal>
        <Reveal y={30}>
          <p className="display max-w-5xl text-3xl leading-[1.15] md:text-5xl md:leading-[1.15]">
            {t.intro.body}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function FeaturedWork() {
  const { t } = useLang()
  const { projects } = useContent()
  const featured = projects.slice(0, 4)
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <Reveal className="mb-4">
            <span className="label">{t.work.label}</span>
          </Reveal>
          <MaskReveal>
            <h2 className="display text-5xl md:text-7xl">
              {t.work.title} <span className="ital text-accent-text">{t.work.titleAccent}</span>
            </h2>
          </MaskReveal>
        </div>
        <Reveal className="hidden md:block">
          <Link to="/work" className="link-underline text-sm text-muted hover:text-text">
            {t.work.all} →
          </Link>
        </Reveal>
      </div>

      <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
        {featured.map((p, i) => (
          <div key={p.slug} className={i % 2 === 1 ? 'md:mt-16' : ''}>
            <WorkCard project={p} index={i} />
          </div>
        ))}
      </div>

      <Reveal className="mt-14 md:hidden">
        <Link to="/work" className="link-underline text-sm text-muted">
          {t.work.all} →
        </Link>
      </Reveal>
    </section>
  )
}

// Minimal line-art marks per service — abstract, on-brand, stroke = currentColor.
const serviceIcons = {
  branding: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-11 w-11">
      <circle cx="19" cy="20" r="10.5" />
      <circle cx="29" cy="20" r="10.5" />
      <circle cx="24" cy="29" r="10.5" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="h-11 w-11">
      <rect x="9" y="12" width="30" height="21" rx="1.5" />
      <path d="M9 18h30" />
      <path d="M12.5 15.2h.01M15 15.2h.01M17.5 15.2h.01" />
      <path d="M19 40h10M24 33v7" />
    </svg>
  ),
  product: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="h-11 w-11">
      <circle cx="14" cy="16" r="3" />
      <circle cx="34" cy="14" r="3" />
      <circle cx="23" cy="31" r="3" />
      <circle cx="35" cy="33" r="3" />
      <path d="M16.6 17.6l4 11M31.2 15.2l-5.6 13.2M25.8 30.6l6.4 2" />
    </svg>
  ),
}

function ServicesPreview() {
  const { t, lang } = useLang()
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="mb-14 max-w-3xl">
        <Reveal className="mb-4">
          <span className="label">{t.services.label}</span>
        </Reveal>
        <MaskReveal>
          <h2 className="display text-5xl md:text-7xl">
            {t.services.title} <span className="ital text-accent-text">{t.services.titleAccent}</span>
          </h2>
        </MaskReveal>
      </div>

      <div className="grid border-t border-line md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal
            key={s.key}
            delay={i * 0.06}
            className="border-b border-line md:border-b-0 md:border-l md:first:border-l-0"
          >
            <Link to="/services" className="group flex h-full flex-col py-8 md:min-h-[520px] md:px-8 md:py-10">
              <span className="label text-muted transition-colors duration-500 group-hover:text-text">{s.n}</span>
              <span className="mt-8 block text-text/60 transition-colors duration-500 group-hover:text-text" aria-hidden="true">
                {serviceIcons[s.key]}
              </span>

              {/* Title + description sit together at the bottom. On hover they
                  rise as one and the breakdown + arrow open below — kinetic height
                  (grid-rows 0fr→1fr) with an accelerating curve, plus a staggered
                  fade so items arrive one after another. Always open on touch. */}
              <div className="mt-auto">
                <h3 className="display text-2xl md:text-3xl">{s.title[lang]}</h3>
                <p className="mt-3 max-w-xs text-sm text-muted">{s.desc[lang]}</p>
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-[650ms] [transition-timing-function:cubic-bezier(0.65,0,0.1,1)] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <ul className="pt-6">
                      {s.items[lang].map((it, idx) => (
                        <li
                          key={it}
                          className="flex items-center gap-2.5 py-1 text-sm text-text/75 transition-all duration-500 md:translate-y-1.5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                          style={{ transitionDelay: `${120 + idx * 45}ms` }}
                        >
                          <span className="h-1 w-1 flex-none rounded-full bg-accent-text" />
                          {it}
                        </li>
                      ))}
                    </ul>
                    <span
                      className="mt-6 inline-flex text-xl text-muted transition-all duration-500 group-hover:text-text md:opacity-0 md:group-hover:translate-x-1 md:group-hover:opacity-100"
                      style={{ transitionDelay: `${120 + s.items[lang].length * 45}ms` }}
                    >
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function StatsBand() {
  const { t, lang } = useLang()
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <Reveal className="mb-14 max-w-md">
          <h2 className="label mb-4 block">{t.stats.label}</h2>
          <p className="text-lg text-muted">{t.stats.body}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label.en} delay={i * 0.06}>
              <div className="display text-6xl md:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-sm text-muted">{s.label[lang]}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ClientsBand() {
  const { t } = useLang()
  const { clients } = useContent()
  return (
    <section className="py-14 md:py-16">
      <Reveal className="mx-auto mb-8 max-w-[1400px] px-6 md:px-10">
        <span className="label">{t.clients.label}</span>
      </Reveal>
      <Marquee
        items={clients}
        separator={null}
        speed={40}
        gapClass="gap-12 md:gap-20"
        renderItem={(c) =>
          c.logo ? (
            <img
              src={c.logo}
              alt={c.name}
              loading="lazy"
              decoding="async"
              className="h-6 w-auto max-w-[150px] object-contain opacity-55 grayscale transition duration-300 hover:opacity-100 md:h-7"
            />
          ) : (
            <span className="display text-2xl text-text/50 md:text-3xl">{c.name}</span>
          )
        }
      />
    </section>
  )
}

function KeywordBand() {
  const { lang } = useLang()
  const words =
    lang === 'pt'
      ? ['Branding', 'Web', 'Produto', 'Estratégia', 'Identidade', 'Motion']
      : ['Branding', 'Web', 'Product', 'Strategy', 'Identity', 'Motion']
  return (
    <section className="py-8 md:py-12">
      <Marquee items={words} separator="✳" outline speed={50} textClass="text-[12vw] leading-none md:text-[7.5rem]" />
    </section>
  )
}

export default function Home() {
  const { t } = useLang()
  useSeo(t.seo.home)
  return (
    <PageTransition>
      <Hero />
      <ClientsBand />
      <FeaturedWork />
      <IntroStatement />
      <ServicesPreview />
      <StatsBand />
      <Exploration />
      <KeywordBand />
    </PageTransition>
  )
}
