import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { process } from '../data/site'
import Reveal from './Reveal'
import MaskReveal from './MaskReveal'

// The studio's way of working, as a calm editorial list: big index, title and
// description on a single baseline, separated by hairlines. The number warms to
// the accent on hover.
export default function ProcessTimeline() {
  const { t, lang } = useLang()

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="mb-12 flex flex-col gap-8 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Reveal className="mb-4">
            <span className="label">{t.homeProcess.label}</span>
          </Reveal>
          <MaskReveal>
            <h2 className="display text-5xl md:text-7xl">
              {t.homeProcess.title} <span className="ital text-accent-text">{t.homeProcess.titleAccent}</span>
            </h2>
          </MaskReveal>
        </div>
        <Reveal>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 text-sm text-muted transition-colors hover:text-text"
          >
            {t.homeProcess.cta}
            <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
          </Link>
        </Reveal>
      </div>

      <div>
        {process.map((step, i) => (
          <Reveal key={step.n} delay={i * 0.05}>
            <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-t border-line py-8 md:grid-cols-[7rem_1fr_1.5fr] md:gap-x-12 md:py-10">
              <span className="display text-4xl leading-none text-muted transition-colors duration-500 group-hover:text-accent-text md:text-6xl">
                {step.n}
              </span>
              <h3 className="display text-2xl md:text-3xl">{step.title[lang]}</h3>
              <p className="col-start-2 max-w-xl leading-relaxed text-muted md:col-start-3">{step.desc[lang]}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
