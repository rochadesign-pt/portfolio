import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { values } from '../data/site'
import { useContent } from '../content/ContentProvider'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import Cover from '../components/Cover'
import WorkCard from '../components/WorkCard'
import OriginGlobe from '../components/OriginGlobe'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

// B&W portrait for the founder section (in /public).
const behindPhoto = '/tiago-rocha.avif'

// Studio / place photography. Drop files in /public and set the paths here;
// until then, tasteful duotone placeholders (with captions) stand in — swapping
// to a real photo is a one-field change via Cover's `image` prop.
const photos = {
  place: null, // e.g. '/studio/ilhavo-ria.avif' — wide shot of Ílhavo / the Ria
  space: null, // e.g. '/studio/space.avif' — the studio
  detail: null, // e.g. '/studio/detail.avif' — a craft/detail or city shot
}

export default function Studio() {
  const { t, lang } = useLang()
  const { projects } = useContent()
  const featured = projects.slice(0, 3)
  useSeo(t.seo.studio)

  return (
    <PageTransition>
      {/* 1 — Identity */}
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52">
        <Reveal className="mb-4">
          <span className="label">{t.studioPage.eyebrow}</span>
        </Reveal>
        <MaskReveal>
          <h1 className="display text-6xl leading-[0.98] md:text-8xl">
            {t.studioPage.title}
            <br />
            {t.studioPage.titleLine2} <span className="ital text-accent-text">{t.studioPage.titleAccent}</span>
          </h1>
        </MaskReveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted">{t.studioPage.sub}</p>
        </Reveal>
      </section>

      {/* 2 — Roots: the globe flies from Ílhavo out to the world */}
      <OriginGlobe />

      {/* 2b — Roots made real: a small photo-essay of Ílhavo and the studio.
          Duotone placeholders with captions until real photography drops in. */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Reveal className="mb-4">
              <span className="label">{t.studioPage.placeLabel}</span>
            </Reveal>
            <MaskReveal>
              <h2 className="display text-4xl md:text-6xl">
                {t.studioPage.placeTitle} <span className="ital text-accent-text">{t.studioPage.placeAccent}</span>
              </h2>
            </MaskReveal>
          </div>
          <Reveal className="max-w-sm">
            <p className="leading-relaxed text-muted">{t.studioPage.placeBody}</p>
          </Reveal>
        </div>

        <div className="grid gap-3 md:gap-4">
          <Reveal>
            <div className="overflow-hidden rounded-2xl">
              <Cover
                colors={['#3a3630', '#0b0b0d']}
                image={photos.place || undefined}
                label={t.studioPage.placeCaption}
                className="aspect-[16/9] w-full md:aspect-[21/9]"
              />
            </div>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
            <Reveal delay={0.05}>
              <div className="overflow-hidden rounded-2xl">
                <Cover
                  colors={['#2a2e33', '#0b0b0d']}
                  image={photos.space || undefined}
                  label={t.studioPage.spaceCaption}
                  className="aspect-[4/3] w-full"
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-2xl">
                <Cover
                  colors={['#332a26', '#0b0b0d']}
                  image={photos.detail || undefined}
                  label={t.studioPage.detailCaption}
                  className="aspect-[4/3] w-full"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — Manifesto (text-led, no photo) */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-6">
          <span className="label">{t.behind.label}</span>
        </Reveal>
        <MaskReveal>
          <h2 className="display max-w-4xl text-4xl leading-[1.1] md:text-6xl">{t.behind.title}</h2>
        </MaskReveal>
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="leading-relaxed text-muted md:text-lg">{t.behind.body1}</p>
          </Reveal>
          <Reveal>
            <p className="leading-relaxed text-muted md:text-lg">{t.behind.body2}</p>
          </Reveal>
        </div>
      </section>

      {/* 4 — What we believe. Restrained cards (dark surface + a big ghosted
          index that warms to the accent on hover) — a card language shared with
          Services, but without the colour, to fit Studio's calmer register. */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-12 md:mb-14">
          <h2 className="label">{t.studioPage.valuesLabel}</h2>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
          {values.map((v, i) => (
            <Reveal key={v.title.en} delay={i * 0.06}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-8 transition-colors duration-500 hover:border-text/20 md:p-10">
                <span className="display pointer-events-none absolute -right-3 -top-6 text-8xl leading-none text-text/[0.04] transition-colors duration-500 group-hover:text-accent-text/15 md:text-9xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative">
                  <h3 className="display text-2xl md:text-3xl">{v.title[lang]}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{v.desc[lang]}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Proof — a slim strip of selected work, so the beliefs above don't hang
          in the abstract before the process below */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal className="mb-4">
              <span className="label">{t.studioPage.workLabel}</span>
            </Reveal>
            <MaskReveal>
              <h2 className="display text-4xl md:text-6xl">
                {t.studioPage.workTitle} <span className="ital text-accent-text">{t.studioPage.workTitleAccent}</span>
              </h2>
            </MaskReveal>
          </div>
          <Reveal>
            <Link
              to="/work"
              className="group inline-flex items-center gap-3 whitespace-nowrap text-sm text-muted transition-colors hover:text-text"
            >
              {t.studioPage.workCta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {featured.map((p, i) => (
            <WorkCard key={p.slug} project={p} index={i} titleAs="h3" />
          ))}
        </div>
      </section>

      {/* 5 — How we think about AI */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1fr_1.15fr] md:gap-16 md:pt-16">
          <div>
            <Reveal className="mb-4">
              <span className="label">{t.studioPage.aiLabel}</span>
            </Reveal>
            <MaskReveal>
              <h2 className="display text-4xl leading-[1.08] md:text-6xl">
                {t.studioPage.aiTitle} <span className="ital text-accent-text">{t.studioPage.aiTitleAccent}</span>
              </h2>
            </MaskReveal>
          </div>
          <div className="flex flex-col gap-6 md:pt-2">
            <Reveal>
              <p className="text-lg leading-relaxed text-muted">{t.studioPage.aiBody1}</p>
            </Reveal>
            <Reveal>
              <p className="text-lg leading-relaxed text-muted">{t.studioPage.aiBody2}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 — Who's behind it — a one-person studio, with a portrait as the human close */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 pb-24 md:px-10 md:pb-32">
        <Reveal className="mb-10">
          <h2 className="label">{t.studioPage.soloLabel}</h2>
        </Reveal>
        <div className="grid items-center gap-10 border-t border-line pt-12 md:grid-cols-[0.8fr_1fr] md:gap-16 md:pt-14">
          <Reveal>
            <div className="overflow-hidden rounded-2xl">
              <Cover
                colors={['#3a3a3d', '#0d0d0f']}
                image={behindPhoto}
                objectPosition="center 20%"
                className="aspect-[4/5] w-full grayscale"
              />
            </div>
          </Reveal>
          <div>
            <MaskReveal>
              <p className="display text-3xl leading-[1.12] md:text-5xl">{t.studioPage.soloTitle}</p>
            </MaskReveal>
            <Reveal className="mt-6">
              <p className="max-w-md leading-relaxed text-muted md:text-lg">{t.studioPage.soloBody}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
