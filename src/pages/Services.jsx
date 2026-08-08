import { useLang } from '../i18n/LanguageContext'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import ServiceColumns from '../components/ServiceColumns'
import ProcessTimeline from '../components/ProcessTimeline'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

export default function Services() {
  const { t } = useLang()
  useSeo(t.seo.services)

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52">
        <Reveal className="mb-4">
          <span className="label">{t.servicesPage.eyebrow}</span>
        </Reveal>
        <MaskReveal>
          <h1 className="display text-6xl md:text-8xl">
            {t.servicesPage.title} <span className="ital text-accent-text">{t.servicesPage.titleAccent}</span>
          </h1>
        </MaskReveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted">{t.servicesPage.sub}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10">
        <ServiceColumns headingAs="h2" />
      </section>

      {/* Process — how an engagement actually runs. Lives here (the commercial
          page where a prospect evaluates "how will this go"), not on Studio. */}
      <ProcessTimeline />
    </PageTransition>
  )
}
