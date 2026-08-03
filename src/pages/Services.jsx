import { useLang } from '../i18n/LanguageContext'
import { services, process } from '../data/site'
import Reveal from '../components/Reveal'
import PageTransition from '../components/PageTransition'

export default function Services() {
  const { t, lang } = useLang()

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52">
        <Reveal className="mb-4">
          <span className="label">{t.servicesPage.eyebrow}</span>
        </Reveal>
        <Reveal>
          <h1 className="display text-6xl md:text-8xl">
            {t.servicesPage.title} <span className="italic">{t.servicesPage.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted">{t.servicesPage.sub}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10">
        {services.map((s) => (
          <Reveal key={s.key}>
            <div className="grid gap-8 border-t border-line py-14 md:grid-cols-[80px_1.2fr_1fr] md:py-20">
              <span className="display text-3xl text-text/30">{s.n}</span>
              <div>
                <h2 className="display text-4xl md:text-6xl">{s.title[lang]}</h2>
                <p className="mt-6 max-w-md text-lg text-muted">{s.desc[lang]}</p>
              </div>
              <ul className="space-y-3 self-center border-l border-line pl-8">
                {s.items[lang].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent ring-1 ring-line" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
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
