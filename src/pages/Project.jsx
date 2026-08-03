import { useParams, Link, Navigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'
import Cover from '../components/Cover'
import PageTransition from '../components/PageTransition'

export default function Project() {
  const { slug } = useParams()
  const { t, lang } = useLang()

  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return <Navigate to="/work" replace />
  const p = projects[index]
  const next = projects[(index + 1) % projects.length]

  const Meta = ({ label, value }) => (
    <div>
      <p className="label mb-1">{label}</p>
      <p className="text-sm text-text">{value}</p>
    </div>
  )

  return (
    <PageTransition>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 pt-36 md:px-10 md:pt-44">
        <Reveal>
          <Link to="/work" className="link-underline text-sm text-muted hover:text-text">
            ← {t.project.back}
          </Link>
        </Reveal>
        <Reveal className="mt-8">
          <p className="label mb-4">{p.category}</p>
          <h1 className="display text-6xl leading-[0.95] md:text-8xl">{p.title}</h1>
        </Reveal>
        <Reveal className="mt-6 max-w-2xl">
          <p className="display text-2xl italic text-muted md:text-3xl">{p.tagline[lang]}</p>
        </Reveal>
      </section>

      {/* Cover */}
      <section className="mx-auto mt-14 max-w-[1400px] px-6 md:px-10">
        <Reveal y={30}>
          <Cover colors={p.cover} className="aspect-[16/9] w-full rounded-2xl" label={p.title} />
        </Reveal>
      </section>

      {/* Meta + overview */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <Reveal className="grid grid-cols-2 gap-8 self-start md:grid-cols-1">
            <Meta label={t.project.client} value={p.client} />
            <Meta label={t.project.year} value={p.year} />
            <Meta label={t.project.category} value={p.category} />
            <div>
              <p className="label mb-2">{t.project.services}</p>
              <ul className="space-y-1 text-sm text-text">
                {p.services.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal y={30}>
            <p className="label mb-6">{t.project.overview}</p>
            <p className="display text-3xl leading-[1.2] md:text-4xl">{p.overview[lang]}</p>
          </Reveal>
        </div>
      </section>

      {/* Gallery 1 */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal y={30}>
          <Cover colors={p.gallery[0]} className="aspect-[16/10] w-full rounded-2xl" />
        </Reveal>
      </section>

      {/* Challenge / Approach / Outcome */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-3xl space-y-20">
          {[
            { label: t.project.challenge, body: p.challenge[lang] },
            { label: t.project.approach, body: p.approach[lang] },
            { label: t.project.outcome, body: p.outcome[lang] },
          ].map((block) => (
            <Reveal key={block.label}>
              <p className="label mb-4">{block.label}</p>
              <p className="text-2xl leading-[1.4] md:text-3xl">{block.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery pair */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal y={30}>
            <Cover colors={p.gallery[1]} className="aspect-square w-full rounded-2xl" />
          </Reveal>
          <Reveal y={30} className="md:mt-16">
            <Cover colors={p.gallery[2]} className="aspect-square w-full rounded-2xl" />
          </Reveal>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mb-14">
          <p className="label">{t.project.outcome}</p>
        </Reveal>
        <div className="grid gap-10 border-t border-line pt-14 md:grid-cols-3">
          {p.results.map((r) => (
            <Reveal key={r.label.en}>
              <p className="display text-6xl md:text-7xl">{r.value}</p>
              <p className="mt-3 text-sm text-muted">{r.label[lang]}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Next project */}
      <section className="border-t border-line">
        <Link to={`/work/${next.slug}`} className="group block">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-6 py-24 md:flex-row md:items-center md:justify-between md:px-10 md:py-32">
            <div>
              <p className="label mb-4">{t.project.next}</p>
              <h2 className="display text-6xl transition-transform duration-500 group-hover:translate-x-3 md:text-8xl">
                {next.title}
              </h2>
              <p className="mt-3 text-sm text-muted">{next.category}</p>
            </div>
            <div className="h-40 w-full overflow-hidden rounded-2xl md:w-80">
              <Cover colors={next.cover} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </Link>
      </section>
    </PageTransition>
  )
}
