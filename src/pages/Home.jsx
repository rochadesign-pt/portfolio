import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import MaskText from '../components/MaskText'
import MaskReveal from '../components/MaskReveal'
import { useContent } from '../content/ContentProvider'
import { stats } from '../data/site'
import { fadeUp } from '../lib/motion'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import Counter from '../components/Counter'
import WorkCard from '../components/WorkCard'
import Exploration from '../components/Exploration'
import ServiceColumns from '../components/ServiceColumns'
import CTASection from '../components/CTASection'
import DotField from '../components/DotField'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

gsap.registerPlugin(useGSAP, ScrollTrigger)

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

// Manifesto + metrics in one section: the statement illuminates character by
// character as you scroll (GSAP scrub over the section), while the numbers count
// up as they enter view. Each word is kept whole for wrapping and real spaces
// are preserved between them, so the copy stays intact for SEO / screen readers.
function ManifestoStats() {
  const { t, lang } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const words = t.intro.body.split(' ')

  useGSAP(
    () => {
      const chars = ref.current.querySelectorAll('.mf-char')
      if (reduce) {
        gsap.set(chars, { opacity: 1 })
        return
      }
      gsap.set(chars, { opacity: 0.16 })
      gsap.to(chars, {
        opacity: 1,
        ease: 'none',
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'top 30%', scrub: 0.4 },
      })
    },
    { scope: ref, dependencies: [t.intro.body, reduce] },
  )

  return (
    <section ref={ref} className="border-y border-line bg-surface/40">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-10">
          <span className="label">{t.intro.label}</span>
        </Reveal>

        <p className="display max-w-5xl text-3xl leading-[1.22] md:text-5xl md:leading-[1.25]">
          {words.map((w, wi) => (
            <Fragment key={wi}>
              <span className="inline-block">
                {[...w].map((ch, ci) => (
                  <span key={ci} className="mf-char">
                    {ch}
                  </span>
                ))}
              </span>
              {wi < words.length - 1 ? ' ' : ''}
            </Fragment>
          ))}
        </p>

        <div className="mt-16 grid grid-cols-2 border-t border-line md:mt-24 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label.en}
              delay={i * 0.06}
              className="border-b border-line py-8 md:border-b-0 md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0"
            >
              <Counter
                value={s.value}
                suffix={s.suffix}
                className="display block text-6xl leading-[0.85] tabular-nums md:text-[5.5rem]"
              />
              <p className="mt-6 flex items-center gap-2">
                <span className="h-1 w-1 flex-none rounded-full bg-accent-text" />
                <span className="label">{s.label[lang]}</span>
              </p>
            </Reveal>
          ))}
        </div>
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
  const { t } = useLang()
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

      <ServiceColumns to="/services" />
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

export default function Home() {
  const { t } = useLang()
  useSeo(t.seo.home)
  return (
    <PageTransition>
      <Hero />
      <ClientsBand />
      <FeaturedWork />
      <ManifestoStats />
      <ServicesPreview />

      {/* Closing sticky stack, in two sequenced stages:
          1. The "lab" pins to the viewport (z-0).
          2. The CTA — a tall wrapper (z-10) whose inner layer is itself sticky —
             rises as a solid dark block up and over the pinned lab, then pins at
             the top. Only while it's pinned do the curtains open (the reveal is
             gated on this wrapper's progress inside CTASection). The extra
             wrapper height beyond one viewport is the scroll room the curtains
             sweep across, so the block-rise and the reveal never overlap. */}
      <div className="sticky top-0 z-0">
        <Exploration />
      </div>
      <div data-cta-stack className="relative z-10 h-[180vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <CTASection stacked />
        </div>
      </div>
    </PageTransition>
  )
}
