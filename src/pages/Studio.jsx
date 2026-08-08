import { useLang } from '../i18n/LanguageContext'
import { values } from '../data/site'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import Cover from '../components/Cover'
import ProcessTimeline from '../components/ProcessTimeline'
import OriginGlobe from '../components/OriginGlobe'
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

      {/* Behind it — full-bleed portrait. On desktop, a lateral gradient darkens
          the side opposite the subject and the manifesto (heading + body) sits
          there. On mobile, the text drops below the photo. */}
      <section className="py-16 md:py-24">
        <div className="relative w-full overflow-hidden">
          <Cover
            colors={['#3a3a3d', '#0d0d0f']}
            image={behindPhoto}
            objectPosition="center 22%"
            className="h-[62vh] min-h-[420px] w-full grayscale md:h-[88vh]"
          />
          {/* lateral gradient (desktop) — dark on the right, clear by mid-frame */}
          <div className="pointer-events-none absolute inset-0 hidden md:block [background-image:linear-gradient(to_left,rgba(0,0,0,0.92),rgba(0,0,0,0.5)_30%,transparent_62%)]" />
          {/* text over the photo, right side (opposite the subject), centered */}
          <div className="absolute inset-0 hidden items-center md:flex">
            <div className="mx-auto flex w-full max-w-[1400px] justify-end px-10">
              <div className="w-[46%] max-w-xl">
                <span className="label mb-4 block text-white/60">{t.behind.label}</span>
                <MaskReveal>
                  <h2 className="display text-4xl leading-[1.1] text-white lg:text-5xl">{t.behind.title}</h2>
                </MaskReveal>
                <div className="mt-8 space-y-5">
                  <p className="leading-relaxed text-white/75">{t.behind.body1}</p>
                  <p className="leading-relaxed text-white/75">{t.behind.body2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* mobile — text below the photo */}
        <div className="mx-auto max-w-[1400px] px-6 pt-10 md:hidden">
          <span className="label mb-4 block text-muted">{t.behind.label}</span>
          <MaskReveal>
            <h2 className="display text-3xl leading-[1.14]">{t.behind.title}</h2>
          </MaskReveal>
          <div className="mt-8 space-y-5">
            <p className="leading-relaxed text-muted">{t.behind.body1}</p>
            <p className="leading-relaxed text-muted">{t.behind.body2}</p>
          </div>
        </div>
      </section>

      {/* Roots — an immersive globe that flies home to Ílhavo on scroll */}
      <OriginGlobe />

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

      {/* AI-native — the studio's point of view on AI */}
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

      {/* How the work gets made — the process, moved here from the home */}
      <ProcessTimeline />

      {/* Founder-led — a one-person studio, by design */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 pb-24 md:px-10 md:pb-32">
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
    </PageTransition>
  )
}
