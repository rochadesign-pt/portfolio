import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import MaskText from '../components/MaskText'
import MaskReveal from '../components/MaskReveal'
import { useContent } from '../content/ContentProvider'
import { services, stats, clients } from '../data/site'
import { fadeUp } from '../lib/motion'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import Counter from '../components/Counter'
import Cover from '../components/Cover'
import WorkCard from '../components/WorkCard'
import Magnetic from '../components/Magnetic'
import Exploration from '../components/Exploration'
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
    <section className="relative mx-auto max-w-[1400px] px-6 pt-40 pb-24 md:px-10 md:pt-52">
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

      <div className="border-t border-line">
        {services.map((s) => (
          <Reveal key={s.key}>
            <Link
              to="/services"
              className="group grid grid-cols-[auto_1fr] items-center gap-6 border-b border-line py-8 transition-colors md:grid-cols-[80px_1fr_auto] md:py-10"
            >
              <span className="display text-2xl text-muted transition-colors group-hover:text-accent-text md:text-3xl">
                {s.n}
              </span>
              <div>
                <h3 className="display text-3xl transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                  {s.title[lang]}
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted md:text-base">{s.desc[lang]}</p>
              </div>
              <span className="hidden text-2xl text-muted transition-all duration-500 group-hover:translate-x-2 group-hover:text-text md:block">
                →
              </span>
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
  return (
    <section className="py-12">
      <Marquee items={clients} separator="✳" speed={40} />
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

function StudioTeaser() {
  const { t } = useLang()
  const { projects } = useContent()
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
        <Reveal>
          <h2 className="label mb-6 block">{t.studioTeaser.label}</h2>
          <p className="display text-4xl leading-[1.1] md:text-6xl">{t.studioTeaser.body}</p>
          <Magnetic className="mt-10 inline-block">
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm transition-colors hover:border-text"
            >
              {t.studioTeaser.cta} →
            </Link>
          </Magnetic>
        </Reveal>
        <Reveal y={30} className="grid grid-cols-2 gap-4">
          <Cover
            colors={projects[1 % projects.length]?.cover}
            image={projects[1 % projects.length]?.coverImage}
            className="aspect-[3/4] rounded-xl"
          />
          <Cover
            colors={projects[4 % projects.length]?.cover}
            image={projects[4 % projects.length]?.coverImage}
            className="mt-10 aspect-[3/4] rounded-xl"
          />
        </Reveal>
      </div>
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
      <StudioTeaser />
    </PageTransition>
  )
}
