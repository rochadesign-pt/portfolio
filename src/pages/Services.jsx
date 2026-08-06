import { useLang } from '../i18n/LanguageContext'
import { process } from '../data/site'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import ServiceColumns from '../components/ServiceColumns'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

export default function Services() {
  const { t, lang } = useLang()
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

      {/* Process */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-14 max-w-2xl">
          <Reveal className="mb-4">
            <span className="label">{t.servicesPage.processLabel}</span>
          </Reveal>
          <Reveal>
            <h2 className="display text-5xl md:text-7xl">{t.servicesPage.processTitle}</h2>
          </Reveal>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {process.map((step) => (
            <Reveal key={step.n} className="bg-bg p-8 md:p-10">
              <span className="display text-5xl text-muted">{step.n}</span>
              <h3 className="mt-8 text-2xl">{step.title[lang]}</h3>
              <p className="mt-3 text-sm text-muted">{step.desc[lang]}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
