import { useLang } from '../i18n/LanguageContext'
import { values, team } from '../data/site'
import Reveal from '../components/Reveal'
import Cover from '../components/Cover'
import PageTransition from '../components/PageTransition'
import { projects } from '../data/projects'

export default function Studio() {
  const { t, lang } = useLang()

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52">
        <Reveal className="mb-4">
          <span className="label">{t.studioPage.eyebrow}</span>
        </Reveal>
        <Reveal>
          <h1 className="display text-6xl leading-[0.95] md:text-8xl">
            {t.studioPage.title} <span className="italic">{t.studioPage.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted">{t.studioPage.sub}</p>
        </Reveal>
      </section>

      {/* Imagery band */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal y={30} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {projects.slice(0, 4).map((p, i) => (
            <Cover
              key={p.slug}
              colors={p.cover}
              className={`aspect-[3/4] rounded-xl ${i % 2 === 1 ? 'md:mt-10' : ''}`}
            />
          ))}
        </Reveal>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-14">
          <span className="label">{t.studioPage.valuesLabel}</span>
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

      {/* Team */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
        <Reveal className="mb-14">
          <span className="label">{t.studioPage.teamLabel}</span>
        </Reveal>
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={i}>
              <Cover colors={projects[i % projects.length].cover} className="aspect-[4/5] rounded-xl" />
              <h3 className="mt-4 text-lg">{m.name}</h3>
              <p className="text-sm text-muted">{m.role[lang]}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Giant wordmark moment */}
      <section className="overflow-hidden px-6 py-24 md:px-10">
        <Reveal>
          <p className="display whitespace-nowrap text-center text-[18vw] leading-none tracking-tight text-text/90">
            Rocha<span className="italic">·</span>Studio
          </p>
        </Reveal>
      </section>
    </PageTransition>
  )
}
