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

      {/* 4 — What we believe */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-14">
          <h2 className="label">{t.studioPage.valuesLabel}</h2>
        </Reveal>
        <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          {values.map((v) => (
            <Reveal key={v.title.en} className="border-t border-line pt-8">
              <h3 className="display text-3xl md:text-4xl">{v.title[lang]}</h3>
              <p className="mt-4 max-w-md text-muted">{v.desc[lang]}</p>
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
