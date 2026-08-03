import { useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { projects } from '../data/projects'
import Reveal from '../components/Reveal'
import Cover from '../components/Cover'
import PageTransition from '../components/PageTransition'

export default function Project() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const bodyRef = useRef(null)

  const index = projects.findIndex((p) => p.slug === slug)
  if (index === -1) return <Navigate to="/work" replace />
  const p = projects[index]
  const moreCases = [projects[(index + 1) % projects.length], projects[(index + 2) % projects.length]]

  const sections = [
    { title: t.project.challenge, body: p.challenge[lang] },
    { title: t.project.approach, body: p.approach[lang] },
    { title: t.project.outcome, body: p.outcome[lang] },
  ]

  const meta = [
    { label: t.project.client, value: p.client },
    { label: t.project.industry, value: p.industry[lang] },
    { label: t.project.country, value: p.country },
    { label: t.project.year, value: p.year },
  ]

  const scrollToBody = () => bodyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <PageTransition>
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 pt-36 md:px-10 md:pt-44">
        <Reveal>
          <Link to="/work" className="link-underline text-sm text-muted hover:text-text">
            ← {t.project.back}
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <Reveal>
              <p className="label mb-4">{p.category}</p>
              <h1 className="display text-6xl leading-[0.95] md:text-8xl">{p.title}</h1>
            </Reveal>
            <Reveal className="mt-6 max-w-2xl">
              <p className="display text-2xl italic text-muted md:text-3xl">{p.tagline[lang]}</p>
            </Reveal>
          </div>
          <Reveal>
            <button
              onClick={scrollToBody}
              className="link-underline flex items-center gap-2 text-sm text-muted hover:text-text"
            >
              {t.project.keepReading} ↓
            </button>
          </Reveal>
        </div>
      </section>

      {/* Cover with fade into bg */}
      <section className="mx-auto mt-14 max-w-[1400px] px-6 md:px-10">
        <Reveal y={30} className="relative">
          <Cover colors={p.cover} className="aspect-[16/9] w-full rounded-2xl" label={p.title} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 rounded-b-2xl bg-gradient-to-t from-bg to-transparent" />
        </Reveal>
      </section>

      {/* Body: sticky meta sidebar + wide content */}
      <section ref={bodyRef} className="mx-auto max-w-[1400px] px-6 pt-24 md:px-10 md:pt-32">
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-[3fr_8fr]">
          {/* Sidebar */}
          <Reveal className="self-start md:sticky md:top-28">
            <div className="border-t border-line">
              {meta.map((m) => (
                <div key={m.label} className="flex items-center justify-between gap-4 border-b border-line py-4">
                  <span className="label">{m.label}</span>
                  <span className="text-sm text-text">{m.value}</span>
                </div>
              ))}
              <div className="border-b border-line py-4">
                <span className="label mb-3 block">{t.project.services}</span>
                <ul className="space-y-1.5">
                  {p.services.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-text">
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <div className="flex flex-col gap-14">
            {/* Lead */}
            <Reveal>
              <p className="display text-3xl leading-[1.2] md:text-4xl">{p.intro[lang]}</p>
            </Reveal>

            <div className="h-px w-full bg-line" />

            {/* Narrative sections */}
            {sections.map((s) => (
              <Reveal key={s.title}>
                <div className="flex flex-col gap-6">
                  <h2 className="display text-4xl italic text-accent md:text-5xl">{s.title}</h2>
                  <div className="flex max-w-2xl flex-col gap-4 text-lg leading-relaxed text-text/85">
                    {s.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Gallery 2×2 */}
            <Reveal y={30} className="grid grid-cols-2 gap-4">
              {p.gallery.map((g, i) => (
                <Cover key={i} colors={g} className="aspect-[4/3] w-full rounded-xl" />
              ))}
            </Reveal>

            {/* Pull quote */}
            <Reveal>
              <blockquote className="border-t border-line pt-10">
                <p className="display text-3xl leading-[1.25] md:text-4xl">“{p.quote.text[lang]}”</p>
                <footer className="mt-6 flex items-center gap-3 text-sm">
                  <span className="h-8 w-8 rounded-full bg-accent" />
                  <span>
                    <span className="text-text">{p.quote.author}</span>
                    <span className="text-muted"> · {p.quote.role[lang]}</span>
                  </span>
                </footer>
              </blockquote>
            </Reveal>

            {/* Results */}
            <Reveal>
              <div className="border-t-2 border-accent pt-8">
                <span className="label mb-8 block">{t.project.results}</span>
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
                  {p.results.map((r) => (
                    <div key={r.label.en}>
                      <p className="display text-5xl md:text-6xl">{r.value}</p>
                      <p className="mt-2 text-sm text-muted">{r.label[lang]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* More cases */}
      <section className="mx-auto max-w-[1400px] px-6 pt-28 md:px-10 md:pt-36">
        <Reveal className="mb-12 border-t border-line pt-12">
          <h2 className="display text-5xl md:text-7xl">
            {t.project.moreCases} <span className="italic text-accent">{t.project.moreCasesAccent}</span>
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {moreCases.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link to={`/work/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-line">
                <div className="overflow-hidden">
                  <Cover colors={c.cover} className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-4 p-8">
                  <div>
                    <h3 className="display text-3xl md:text-4xl">{c.title}</h3>
                    <p className="mt-1 text-sm text-muted">{c.category}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-accent-ink transition-transform duration-500 group-hover:translate-x-1">
                    {t.project.readCase} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
