import { useLang } from '../i18n/LanguageContext'
import { values } from '../data/site'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import Cover from '../components/Cover'
import Marquee from '../components/Marquee'
import ProcessTimeline from '../components/ProcessTimeline'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

// B&W portrait for the "Behind it" section (in /public).
const behindPhoto = '/tiago-rocha.avif'

export default function Studio() {
  const { t, lang } = useLang()
  useSeo(t.seo.studio)

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52">
        <Reveal className="mb-4">
          <span className="label">{t.studioPage.eyebrow}</span>
        </Reveal>
        <MaskReveal>
          <h1 className="display text-6xl leading-[0.95] md:text-8xl">
            {t.studioPage.title} <span className="ital text-accent-text">{t.studioPage.titleAccent}</span>
          </h1>
        </MaskReveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted">{t.studioPage.sub}</p>
        </Reveal>
      </section>

      {/* Behind it — full-bleed portrait carrying the manifesto, body below */}
      <section className="py-16 md:py-24">
        <Reveal y={30} className="relative w-full overflow-hidden">
          <Cover
            colors={['#3a3a3d', '#0d0d0f']}
            image={behindPhoto}
            objectPosition="center 22%"
            className="h-[64vh] min-h-[440px] w-full grayscale md:h-[84vh]"
          />
          {/* scrim so the heading stays legible over the photo */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto max-w-[1400px] px-6 pb-10 md:px-10 md:pb-16">
              <span className="label mb-4 block text-white/60">{t.behind.label}</span>
              <MaskReveal>
                <h2 className="display max-w-4xl text-3xl leading-[1.12] text-white md:text-5xl md:leading-[1.08]">
                  {t.behind.title}
                </h2>
              </MaskReveal>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-[1400px] gap-8 px-6 md:mt-16 md:grid-cols-2 md:gap-16 md:px-10">
          <Reveal>
            <p className="leading-relaxed text-muted">{t.behind.body1}</p>
          </Reveal>
          <Reveal>
            <p className="leading-relaxed text-muted">{t.behind.body2}</p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
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

      {/* How the work gets made — the process, moved here from the home */}
      <ProcessTimeline />

      {/* Founder-led — a one-person studio, by design */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
        <Reveal className="mb-10">
          <h2 className="label">{t.studioPage.soloLabel}</h2>
        </Reveal>
        <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <MaskReveal>
            <p className="display text-3xl leading-[1.12] md:text-5xl">{t.studioPage.soloTitle}</p>
          </MaskReveal>
          <Reveal>
            <p className="max-w-md leading-relaxed text-muted md:text-lg">{t.studioPage.soloBody}</p>
          </Reveal>
        </div>
      </section>

      {/* Giant wordmark moment — outlined, scrolling */}
      <section className="py-16 md:py-24">
        <Marquee
          items={['Rocha Design Studio']}
          separator="✳"
          outline
          speed={55}
          textClass="text-[13vw] leading-none md:text-[9rem]"
        />
      </section>
    </PageTransition>
  )
}
