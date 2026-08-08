import { useLang } from '../i18n/LanguageContext'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import ServicesBento from '../components/ServicesBento'
import ProcessTimeline from '../components/ProcessTimeline'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

export default function Services() {
  const { t } = useLang()
  const s = t.servicesPage
  useSeo(t.seo.services)

  return (
    <PageTransition>
      {/* The promise */}
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-20 md:px-10 md:pt-52 md:pb-24">
        <Reveal className="mb-4">
          <span className="label">{s.eyebrow}</span>
        </Reveal>
        <MaskReveal>
          <h1 className="display text-6xl md:text-8xl">
            {s.title} <span className="ital text-accent-text">{s.titleAccent}</span>
          </h1>
        </MaskReveal>
        <Reveal className="mt-8 max-w-3xl md:mt-10">
          <p className="display text-2xl leading-[1.28] text-text md:text-[2rem] md:leading-[1.25]">{s.lead}</p>
        </Reveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-muted">{s.sub}</p>
        </Reveal>
      </section>

      {/* What we do — the capabilities */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10">
        <div className="mb-12 md:mb-14">
          <Reveal className="mb-4">
            <span className="label">{s.capLabel}</span>
          </Reveal>
          <MaskReveal>
            <h2 className="display max-w-3xl text-4xl md:text-6xl">{s.capLine}</h2>
          </MaskReveal>
        </div>
        <ServicesBento />
      </section>

      {/* How we work — the process (lives here, the commercial page) */}
      <ProcessTimeline />
    </PageTransition>
  )
}
