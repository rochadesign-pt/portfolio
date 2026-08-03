import { useLang } from '../i18n/LanguageContext'
import { explorations } from '../data/site'
import Cover from './Cover'
import Reveal from './Reveal'
import MaskReveal from './MaskReveal'

// Exploration / lab — a packed masonry mosaic of off-brief experiments.
// Each tile carries a "Name / Category" caption.
export default function Exploration() {
  const { t, lang } = useLang()

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="mb-14 max-w-4xl">
        <Reveal className="mb-6">
          <span className="label">{t.exploration.label}</span>
        </Reveal>
        <MaskReveal>
          <h2 className="display text-4xl leading-[1.08] md:text-6xl">
            {t.exploration.lead1} <span className="ital text-accent">{t.exploration.acc1}</span>{' '}
            {t.exploration.lead2} <span className="ital text-accent">{t.exploration.acc2}</span>{' '}
            {t.exploration.lead3}
          </h2>
        </MaskReveal>
        <Reveal className="mt-6 max-w-md">
          <p className="text-muted">{t.exploration.sub}</p>
        </Reveal>
      </div>

      {/* Masonry mosaic */}
      <div className="gap-4 [column-gap:1rem] columns-2 sm:columns-3 lg:columns-4">
        {explorations.map((e, i) => (
          <Reveal key={i} className="mb-4 break-inside-avoid">
            <div className="group block">
              <div className="overflow-hidden rounded-xl" style={{ aspectRatio: e.ratio }}>
                <Cover
                  colors={e.colors}
                  className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-sm">
                <span className="text-text">{e.name}</span>
                <span className="text-muted">/ {e.category[lang]}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
