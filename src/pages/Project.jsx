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
  // Gallery item (from Sanity) for slot i: { url, heading, caption } — or
  // undefined, in which case the duotone fallback colour shows.
  const gi = (i) => p.galleryImages?.[i]

  // An image with its editorial note. The caption is where the decision behind
  // the image gets explained — so the case study reads as a story, not a
  // slideshow. Note shows only when there's something to say.
  const Figure = ({ i, className }) => {
    const g = gi(i)
    const heading = g?.heading?.[lang]
    const caption = g?.caption?.[lang]
    // The note leads INTO the image — "here's the decision" then "here's the
    // result" — so the page reads text → image → text → image, a light rhythm
    // rather than a stack of silent pictures.
    return (
      <figure className="flex flex-col gap-6">
        {(heading || caption) && (
          <figcaption className="max-w-2xl">
            {heading && <span className="label mb-3 block text-accent-text">{heading}</span>}
            {caption && <p className="text-lg leading-relaxed text-text/80">{caption}</p>}
          </figcaption>
        )}
        <ParallaxImage colors={p.gallery[i % p.gallery.length]} image={g?.url} className={className} />
      </figure>
    )
  }

  // Showcase after the Approach: every real gallery image beyond the two anchors,
  // each with its note. With no real images yet, a few duotone slots keep the
  // layout full so the placeholder state still reads.
  const realCount = p.galleryImages?.length || 0
  const showcase =
    realCount > 2 ? Array.from({ length: realCount - 2 }, (_, k) => 2 + k) : realCount === 0 ? [2, 3, 4] : []
  const ratios = ['aspect-[3/2]', 'aspect-[16/9]', 'aspect-[2/1]', 'aspect-[21/9]']

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
            <Figure i={0} className="aspect-[16/9] w-full rounded-2xl" />

            {/* Challenge */}
            <div id="ch-challenge" className="scroll-mt-28">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.challenge}</Heading>
                <Para items={p.challenge[lang]} />
              </Reveal>
            </div>

            {/* Figure */}
            <Figure i={1} className="aspect-[2/1] w-full rounded-2xl" />

            {/* Approach */}
            <div id="ch-approach" className="scroll-mt-28">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.approach}</Heading>
                <Para items={p.approach[lang]} />
              </Reveal>
            </div>

            {/* Showcase — each image with the decision behind it */}
            {showcase.map((i, k) => (
              <Figure key={i} i={i} className={`${ratios[k % ratios.length]} w-full rounded-2xl`} />
            ))}

            {/* Results: outcome + quote + stats */}
            <div id="ch-results" className="flex scroll-mt-28 flex-col gap-12">
              <Reveal className="flex flex-col gap-6">
                <Heading>{t.project.outcome}</Heading>
                <Para items={p.outcome[lang]} />
              </Reveal>

              {p.quote && (p.quote.text?.[lang] || p.quote.author) && (
                <Reveal>
                  <blockquote className="border-t border-line pt-10">
                    <p className="display text-3xl leading-[1.25] md:text-4xl">“{p.quote.text?.[lang]}”</p>
                    <footer className="mt-6 flex items-center gap-3 text-sm">
                      <span className="h-8 w-8 rounded-full bg-accent" />
                      <span>
                        <span className="text-text">{p.quote.author}</span>
                        <span className="text-muted"> · {p.quote.role?.[lang]}</span>
                      </span>
                    </footer>
                  </blockquote>
                </Reveal>
              )}

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
