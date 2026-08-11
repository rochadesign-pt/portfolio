import { useLang } from '../i18n/LanguageContext'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import ServiceColumns from '../components/ServiceColumns'
import ProcessScroll from '../components/ProcessScroll'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

export default function Services() {
  const { t } = useLang()
  const s = t.servicesPage
  useSeo(t.seo.services)

  return (
    <PageTransition>
      {/* The promise — title and supporting line side by side, so the header
          reads as one big statement + a caption, not a stack of big texts. */}
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-20 md:px-10 md:pt-52 md:pb-28">
        <Reveal className="mb-6 md:mb-8">
          <span className="label">{s.eyebrow}</span>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-[1.35fr_1fr] md:items-end md:gap-16">
          <MaskReveal>
            <h1 className="display text-6xl md:text-8xl">
              {s.title} <span className="ital text-accent-text">{s.titleAccent}</span>
            </h1>
          </MaskReveal>
          <Reveal className="md:pb-3">
            <p className="max-w-md text-lg leading-relaxed text-muted md:text-xl">{s.lead}</p>
          </Reveal>
        </div>
      </section>

      {/* What we do — just a quiet label, then the columns speak */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10">
        <Reveal className="mb-8 border-t border-line pt-8 md:mb-10">
          <span className="label text-muted">{s.capLabel}</span>
        </Reveal>
        <ServiceColumns headingAs="h2" />
      </section>

      {/* How we work — a pinned, scroll-scrubbed process */}
      <ProcessScroll />
    </PageTransition>
  )
}
