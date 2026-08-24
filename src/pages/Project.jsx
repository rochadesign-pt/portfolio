import { useEffect, useRef, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLang } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentProvider'
import Reveal from '../components/Reveal'
import Cover from '../components/Cover'
import ParallaxImage from '../components/ParallaxImage'
import ChapterNav from '../components/ChapterNav'
import CountUp from '../components/CountUp'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

// Per-block shapes. Half-width blocks pair up in the flex row.
const ASPECT = { wide: 'aspect-[16/10]', portrait: 'aspect-[3/4]', tall: 'aspect-[4/5]', square: 'aspect-square' }

function BlockNote({ heading, caption }) {
  if (!heading && !caption) return null
  return (
    <figcaption className="max-w-2xl">
      {heading && <span className="label mb-2 block text-accent-text">{heading}</span>}
      {caption && <p className="leading-relaxed text-text/80">{caption}</p>}
    </figcaption>
  )
}

function ImageBlock({ block, lang }) {
  return (
    <figure className="flex w-full flex-col gap-5">
      <BlockNote heading={block.heading?.[lang]} caption={block.caption?.[lang]} />
      <ParallaxImage
        colors={block.colors}
        image={block.url}
        className={`${ASPECT[block.aspect] || ASPECT.wide} w-full rounded-2xl`}
      />
    </figure>
  )
}

// A colour palette — swatches with names + hex, for branding case studies.
function PaletteBlock({ block, lang }) {
  return (
    <figure className="flex w-full flex-col gap-6">
      <BlockNote heading={block.heading?.[lang]} caption={block.caption?.[lang]} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {block.swatches.map((s, i) => (
          <div key={i} className="flex flex-col gap-2.5">
            <div className="aspect-square rounded-xl border border-line" style={{ background: s.hex }} />
            <div className="text-xs leading-tight">
              {s.name && <span className="block text-text">{s.name}</span>}
              <span className="font-mono uppercase text-muted">{s.hex}</span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}

// The case-study visual body: a flex flow where full blocks span the row and
// two consecutive half blocks pair side by side (stacking on mobile).
function BlockFlow({ blocks, lang }) {
  if (!blocks?.length) return null
  return (
    <div className="flex flex-wrap gap-4 md:gap-6">
      {blocks.map((b, i) => (
        <Reveal key={i} className={b.kind === 'image' && b.width === 'half' ? 'w-full md:w-[calc(50%-0.75rem)]' : 'w-full'}>
          {b.kind === 'palette' ? <PaletteBlock block={b} lang={lang} /> : <ImageBlock block={b} lang={lang} />}
        </Reveal>
      ))}
    </div>
  )
}

// Client quote as a full-bleed split panel: a tessellated brand motif on one
// side, the quote on the other — colour-on-colour, an unusual, branded break
// from the reading column (à la ANGIA). Falls back to nothing without a quote.
function QuoteFeature({ quote, lang }) {
  const text = quote?.text?.[lang]
  if (!text && !quote?.author) return null
  const role = quote?.role?.[lang]
  return (
    <section className="mt-24 bg-accent text-accent-ink md:mt-32">
      <div className="mx-auto grid max-w-[1600px] md:grid-cols-[0.82fr_1.18fr]">
        {/* Left — tessellated triangular brand pattern, with one solid mark */}
        <div className="relative min-h-[240px] overflow-hidden border-b border-accent-ink/10 md:min-h-full md:border-b-0 md:border-r">
          <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-accent-ink/[0.10]">
            <defs>
              <pattern id="rds-quote-tess" width="72" height="62" patternUnits="userSpaceOnUse">
                <path d="M36 6 L67 58 L5 58 Z" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rds-quote-tess)" />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 100 90"
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-accent-ink md:h-32 md:w-32"
            fill="currentColor"
          >
            <path d="M50 6 L94 84 L6 84 Z" />
          </svg>
        </div>
        {/* Right — the quote */}
        <Reveal className="flex flex-col justify-center px-6 py-16 md:px-16 md:py-24">
          <p className="display text-2xl leading-[1.14] md:text-4xl lg:text-5xl">“{text}”</p>
          {(quote.author || role) && (
            <p className="label mt-8 text-accent-ink/70 md:mt-10">
              {quote.author}
              {role ? ` — ${role}` : ''}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default function Project() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const { projects } = useContent()
  const bodyRef = useRef(null)
  const heroTextRef = useRef(null)

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

  // Once the zoom image has landed, choreograph the header text in as one
  // continuous, kinetic sequence (GSAP timeline) — kicker → title → tagline →
  // cue, each rising a touch after the last so it reads as a single move rather
  // than a page load. Held hidden (opacity-0) until then.
  useGSAP(
    () => {
      if (!landed) return
      const els = heroTextRef.current?.querySelectorAll('[data-hero]')
      if (!els?.length) return
      // Plays regardless of reduced motion, to match the zoom (both are part of
      // the one continuous open sequence).
      gsap.fromTo(
        els,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 },
      )
    },
    { dependencies: [landed], scope: heroTextRef },
  )

  const index = projects.findIndex((p) => p.slug === slug)
  const p = index === -1 ? null : projects[index]

  useSeo({
    title: p ? `${p.title} — Rocha Design Studio` : 'Rocha Design Studio',
    description: p ? `${p.category} · ${p.tagline[lang]}` : undefined,
    image: p?.coverImage,
  })

  if (index === -1) return <Navigate to="/work" replace />
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
    <h2 className="ital text-accent-text text-4xl md:text-5xl">{children}</h2>
  )

  const scrollToBody = () => bodyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // Case-study blocks come from Sanity (each with its own layout). When a
  // project has none yet, derive a varied placeholder flow from any legacy
  // gallery notes + the duotone fallback colours, so the layout still reads.
  const legacyBlocks = () => {
    const imgs = p.galleryImages || []
    const cols = p.gallery?.length ? p.gallery : [['#1d1d20', '#0b0b0d']]
    const count = imgs.length || 3
    const W = ['full', 'half', 'half', 'full', 'full']
    const A = ['wide', 'portrait', 'portrait', 'square', 'wide']
    return Array.from({ length: count }, (_, i) => ({
      kind: 'image',
      url: imgs[i]?.url,
      heading: imgs[i]?.heading || null,
      caption: imgs[i]?.caption || null,
      width: W[i % W.length],
      aspect: A[i % A.length],
      colors: cols[i % cols.length],
    }))
  }
  const blocks = p.blocks?.length ? p.blocks : legacyBlocks()
  // The first block leads in full-width as the establishing shot; the rest flow.
  const establishing = blocks[0]
    ? { ...blocks[0], ...(blocks[0].kind === 'image' ? { width: 'full', aspect: 'wide' } : {}) }
    : null
  const showcase = blocks.slice(1)

  return (
    <PageTransition instant={zoomEntry}>
      {/* Full-bleed hero header — the zoom lands here */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        {/* Plain Cover (not ParallaxImage) so the hero renders the image
            identically to the zoom overlay — same object-cover framing, no
            parallax scale/offset — so the overlay fades over an identical image
            (no position jump, no flash). Same src as the overlay, so it paints
            from cache. Wrapped in an absolute layer because Cover sets its own
            `relative` (which would otherwise take it out of full-bleed). */}
        <div className="absolute inset-0">
          <Cover colors={p.cover} image={p.coverImage} className="h-full w-full" objectPosition="center 22%" />
        </div>
        {/* bottom scrim keeps the title legible; the top is left clean so the nav
            sits over open space in the image, no gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/10" />

        <div
          ref={heroTextRef}
          className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-14 pt-28 md:px-10 md:pb-16 md:pt-32"
        >
          {/* Held hidden until the zoom lands; the GSAP timeline above staggers
              these in as one continuous, kinetic move. */}
          <span
            data-hero
            className="mb-5 block text-xs font-medium uppercase tracking-[0.22em] text-text/70 opacity-0"
          >
            {p.category}
          </span>
          <h1 data-hero className="display text-7xl leading-[0.88] opacity-0 md:text-[9rem]">
            {p.title}
          </h1>
          <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p
              data-hero
              className="ital max-w-2xl text-2xl leading-snug text-text/85 opacity-0 md:text-3xl"
            >
              {p.tagline[lang]}
            </p>
            <button
              data-hero
              onClick={scrollToBody}
              className="link-underline flex shrink-0 items-center gap-2 text-sm text-text/80 opacity-0 hover:text-text"
            >
              {t.project.keepReading} ↓
            </button>
          </div>
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

            {/* Establishing image */}
            {establishing && <BlockFlow blocks={[establishing]} lang={lang} />}

            {/* Challenge */}
            <div id="ch-challenge" className="scroll-mt-28">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.challenge}</Heading>
                <Para items={p.challenge[lang]} />
              </Reveal>
            </div>

            {/* Approach */}
            <div id="ch-approach" className="scroll-mt-28">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.approach}</Heading>
                <Para items={p.approach[lang]} />
              </Reveal>
            </div>

            {/* Showcase — the flexible block flow (each block with its layout) */}
            <BlockFlow blocks={showcase} lang={lang} />

            {/* Results: outcome + quote + stats */}
            <div id="ch-results" className="flex scroll-mt-28 flex-col gap-12">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.outcome}</Heading>
                <Para items={p.outcome[lang]} />
              </Reveal>

              <Reveal>
                <div className="border-t border-line pt-8">
                  <span className="label mb-8 block">{t.project.results}</span>
                  <div className="flex flex-wrap gap-x-14 gap-y-8">
                    {p.results.map((r) => (
                      <div key={r.label.en}>
                        <CountUp value={r.value} className="display block text-3xl md:text-4xl" />
                        <p className="mt-1.5 text-sm text-muted">{r.label[lang]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Client quote — full-bleed branded split panel */}
      <QuoteFeature quote={p.quote} lang={lang} />

      {/* Next project — full-bleed, cinematic hand-off that keeps the reading
          flowing straight into the next case. */}
      <section className="mt-28 md:mt-36">
        <Link
          to={`/work/${moreCases[0].slug}`}
          className="group relative block h-[76svh] min-h-[460px] w-full overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <Cover
              colors={moreCases[0].cover}
              image={moreCases[0].coverImage}
              objectPosition="center 22%"
              className="h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/10" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 pb-16 md:px-10 md:pb-20">
            <span className="label mb-4 flex items-center gap-2">
              {t.project.next}
              <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
            <h2 className="display text-6xl leading-[0.9] md:text-8xl">{moreCases[0].title}</h2>
            <p className="ital mt-4 max-w-xl text-xl text-text/85 md:text-2xl">
              {moreCases[0].tagline[lang]}
            </p>
          </div>
        </Link>
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
          <Link
            to="/work"
            className="link-underline inline-flex items-center gap-2 text-sm text-muted hover:text-text"
          >
            {t.project.moreCases} {t.project.moreCasesAccent} →
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
