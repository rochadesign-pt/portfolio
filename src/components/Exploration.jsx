import { useLang } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentProvider'
import Cover from './Cover'
import Reveal from './Reveal'
import MaskReveal from './MaskReveal'
import SectionNumeral from './SectionNumeral'

// Scattered widths + vertical offsets give the row an editorial, dynamic
// baseline (each tile sits at a different height), à la the reference.
const WIDTHS = [220, 168, 244, 280, 190, 208, 164, 200]
const OFFSETS = [64, 20, 88, 4, 48, 28, 72, 12]

export default function Exploration() {
  const { t, lang } = useLang()
  const { explorations } = useContent()

  return (
    <section className="overflow-hidden py-24 md:py-32">
      {/* Header — heading left, intro right */}
      <div className="relative mx-auto mb-16 max-w-[1400px] px-6 md:px-10">
        <SectionNumeral className="right-6 top-0 md:right-10">06</SectionNumeral>
        <Reveal className="mb-6">
          <span className="label">{t.exploration.label}</span>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <MaskReveal>
            <h2 className="display text-4xl leading-[1.08] md:text-6xl">
              {t.exploration.lead1} <span className="ital text-accent-text">{t.exploration.acc1}</span>{' '}
              {t.exploration.lead2} <span className="ital text-accent-text">{t.exploration.acc2}</span>{' '}
              {t.exploration.lead3}
            </h2>
          </MaskReveal>
          <Reveal>
            <p className="max-w-md text-muted md:pb-2">{t.exploration.sub}</p>
          </Reveal>
        </div>
      </div>

      {/* Scattered horizontal band */}
      <Reveal>
        <div className="overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-end gap-8 px-6 md:px-10">
            {explorations.map((e, i) => (
              <div
                key={i}
                className="flex-none"
                style={{ width: WIDTHS[i % WIDTHS.length], marginBottom: OFFSETS[i % OFFSETS.length] }}
              >
                <p className="mb-3 text-sm leading-snug">
                  <span className="text-text">{e.name}</span>
                  <span className="text-muted"> / {e.category[lang]}</span>
                </p>
                <div
                  className="group overflow-hidden rounded-lg"
                  style={{ aspectRatio: e.ratio }}
                >
                  <Cover
                    colors={e.colors}
                    image={e.image}
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
