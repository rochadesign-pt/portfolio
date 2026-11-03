import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import MaskText from '../components/MaskText'
import MaskReveal from '../components/MaskReveal'
import { useContent } from '../content/ContentProvider'
import { stats } from '../data/site'
import Reveal from '../components/Reveal'
import Marquee from '../components/Marquee'
import Counter from '../components/Counter'
import WorkCard from '../components/WorkCard'
import Exploration from '../components/Exploration'
import ServiceColumns from '../components/ServiceColumns'
import CTASection from '../components/CTASection'
import DotField from '../components/DotField'
import DotSphere from '../components/DotSphere'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Hero as a composition of interlocking tiles: the headline lives in a "paper"
// block that steps down into a second block (joined by a concave fillet), and
// around it sit a live dot sphere, the yellow CTA tile, a location tile and the
// three service pillars. Tiles assemble in sequence once the preloader is done.
function Hero() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const ref = useRef(null)
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

  useGSAP(
    () => {
      const tiles = ref.current.querySelectorAll('[data-tile]')
      if (reduce) {
        gsap.set(tiles, { autoAlpha: 1 })
        return
      }
      if (!started) {
        gsap.set(tiles, { autoAlpha: 0, y: 24, scale: 0.96 })
        return
      }
      gsap.to(tiles, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: { each: 0.07, from: 'start' },
        delay: 0.1,
      })
    },
    { scope: ref, dependencies: [started, reduce] },
  )

  const [p1, p2, p3] = t.hero.pillars

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-28">
      {/* Full-bleed dot field behind the tiles — brightens around the cursor */}
      <DotField />

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-10">
        <div className="hero-grid">
          {/* Headline block */}
          <div data-tile className="hero-a tile-paper">
            <p className="label hero-eyebrow">{t.hero.eyebrow}</p>
            <h1 className="display hero-title">
              <MaskText as="span" text={t.hero.line1} className="block" trigger="mount" active={started} delay={0.15} />
              <MaskText as="span" text={t.hero.line2} className="block" trigger="mount" active={started} delay={0.24} />
              <MaskText as="span" text={t.hero.accent} className="block emph" trigger="mount" active={started} delay={0.34} />
            </h1>
          </div>

          {/* Step that hangs off the headline block */}
          <div data-tile className="hero-b tile-paper" aria-hidden="true">
            <span className="hero-fillet" />
          </div>

          {/* Intro copy + link, on the dark ground */}
          <div data-tile className="hero-sub">
            <p className="max-w-sm text-base text-muted md:text-lg">{t.hero.sub}</p>
            <Link to="/work" className="hero-link group">
              {t.hero.discover}
              <Arrow className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <Pillar className="hero-p1" item={p1} />

          {/* Yellow CTA tile */}
          <Link data-tile to="/contact" className="hero-cta group" aria-label={t.hero.talk}>
            <span className="label hero-cta-label">{t.hero.talk}</span>
            <Arrow className="h-9 w-9 transition-transform duration-500 ease-[var(--ease-ios)] group-hover:-translate-y-1 group-hover:translate-x-1 md:h-12 md:w-12" />
          </Link>

          {/* Live dot sphere */}
          <div data-tile className="hero-s tile-dark">
            <DotSphere />
            <span className="label hero-fig">Fig. 01</span>
          </div>

          {/* Location tile */}
          <div data-tile className="hero-d tile-paper">
            <span className="label hero-fig">{t.hero.based}</span>
            <HeroClock />
          </div>

          <Pillar className="hero-p2" item={p2} />
          <Pillar className="hero-p3" item={p3} />
        </div>
      </div>
    </section>
  )
}

function Pillar({ item, className }) {
  return (
    <div data-tile className={`hero-pillar ${className}`}>
      <span aria-hidden="true" className="hero-plus" />
      <p className="mt-4 text-sm font-medium text-text">{item.title}</p>
      <p className="mt-1.5 max-w-[15rem] text-sm leading-snug text-muted">{item.body}</p>
    </div>
  )
}

function Arrow({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className={`h-4 w-4 ${className}`}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

// Local time in Aveiro — big, tabular, ticking by the minute.
function HeroClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/Lisbon',
  }).format(now)
  return <span className="display hero-clock tabular-nums">{time}</span>
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
      gsap.set(chars, { opacity: 0.2 })
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
    <section ref={ref} className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-44">
      <Reveal className="mb-12 md:mb-16">
        <span className="label">{t.intro.label}</span>
      </Reveal>

      {/* Editorial statement — rests in a soft tone and lights up as you read
          (char-by-char scrub), left-aligned with generous leading. */}
      <p className="display max-w-4xl text-[1.7rem] leading-[1.34] md:text-[2.6rem] md:leading-[1.36]">
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

      {/* Soft metrics — quiet and understated; the numbers whisper, not shout. */}
      <div className="mt-20 flex flex-wrap gap-x-14 gap-y-8 md:mt-28 md:gap-x-20">
        {stats.map((s, i) => (
          <Reveal key={s.label.en} delay={i * 0.05}>
            <Counter
              value={s.value}
              suffix={s.suffix}
              className="display block text-2xl leading-none tabular-nums text-text/90 md:text-[1.9rem]"
            />
            <p className="label mt-2.5 text-muted">{s.label[lang]}</p>
          </Reveal>
        ))}
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
              {t.work.title} <span className="emph">{t.work.titleAccent}</span>
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
            {t.services.title} <span className="emph">{t.services.titleAccent}</span>
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
        bordered={false}
        fade
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
      {/* The lab pins (sticky in the page flow, so it stays put the whole time)
          and the spacer below is empty scroll room — the lab holds fully visible
          across it (room to see and drag the projects) before the CTA rises up
          and over the still-pinned lab. */}
      <div className="sticky top-0 z-0">
        <Exploration />
      </div>
      <div aria-hidden="true" className="h-[80vh]" />
      <div data-cta-stack className="relative z-10 h-[180vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <CTASection stacked />
        </div>
      </div>
    </PageTransition>
  )
}
