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
import PixelField from '../components/PixelField'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Hero in a "blueprint" frame: headline left, intro + actions right, then a
// full-bleed pixel skyline and three service tabs. The tabs auto-advance (a
// progress line runs along the active one) and each reshapes the skyline.
const TAB_MS = 6000

function Hero() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [started, setStarted] = useState(false)
  const [tab, setTab] = useState(0)
  const [paused, setPaused] = useState(false)

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

  // Auto-advance the tabs (paused on hover / focus, off under reduced motion)
  useEffect(() => {
    if (!started || paused || reduce) return
    const id = setTimeout(() => setTab((i) => (i + 1) % t.hero.tabs.length), TAB_MS)
    return () => clearTimeout(id)
  }, [tab, started, paused, reduce, t.hero.tabs.length])

  return (
    <section className="bp-row relative !border-t-0">
      <div className="bp-inner grid gap-10 pt-36 pb-16 md:grid-cols-12 md:pt-44 md:pb-20">
        <h1 className="display text-[2.3rem] leading-[1.04] md:col-span-7 md:text-[clamp(3rem,5vw,4.75rem)]">
          <MaskText as="span" text={t.hero.line1} className="block" trigger="mount" active={started} delay={0.05} />
          <MaskText as="span" text={t.hero.line2} className="block" trigger="mount" active={started} delay={0.12} />
          <MaskText as="span" text={t.hero.accent} className="block emph" trigger="mount" active={started} delay={0.2} />
        </h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={started ? 'show' : 'hidden'}
          transition={{ delay: 0.4 }}
          className="md:col-span-4 md:col-start-9 md:pt-3"
        >
          <p className="max-w-sm text-[15px] leading-relaxed text-muted">{t.hero.sub}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link to="/contact" className="pill pill-solid">
              {t.hero.talk}
            </Link>
            <Link to="/work" className="pill">
              {t.hero.discover} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </motion.div>
      </div>

      <PixelField seed={tab} className="h-[220px] w-full md:h-[300px]" />

      <div className="bp-row">
        <div
          className="bp-inner grid md:grid-cols-3"
          role="tablist"
          aria-label={t.services.label}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {t.hero.tabs.map((item, i) => {
            const active = i === tab
            return (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(i)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                className={`hero-tab ${active ? 'is-active' : ''}`}
              >
                <span className="hero-tab-bar" aria-hidden="true">
                  <span
                    key={`${tab}-${paused}`}
                    className="hero-tab-fill"
                    style={{ animationDuration: `${TAB_MS}ms`, animationPlayState: paused || reduce ? 'paused' : 'running' }}
                  />
                </span>
                <span className="text-sm">
                  <span className="tabular-nums text-muted">0{i + 1} — </span>
                  {item.title}
                </span>
                <span className="hero-tab-body mt-2 block max-w-xs text-sm leading-snug text-muted">{item.body}</span>
              </button>
            )
          })}
        </div>
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
      {/* Blueprint frame: hairline rails down the content edges, a hairline
          between sections and a "+" where they cross. */}
      <div className="bp">
        <span className="bp-rails" aria-hidden="true" />
        <Hero />
        <div className="bp-row">
          <ClientsBand />
        </div>
        <div className="bp-row">
          <FeaturedWork />
        </div>
        <div className="bp-row">
          <ManifestoStats />
        </div>
        <div className="bp-row">
          <ServicesPreview />
        </div>
      </div>

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
