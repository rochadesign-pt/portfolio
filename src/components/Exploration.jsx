import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import { useContent } from '../content/ContentProvider'
import Cover from './Cover'
import Reveal from './Reveal'
import MaskReveal from './MaskReveal'
import DotField from './DotField'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Scattered widths + vertical offsets give the row an editorial baseline (each
// tile sits at a different height).
const WIDTHS = [220, 168, 244, 280, 190, 208, 164, 200]
const OFFSETS = [64, 20, 88, 4, 48, 28, 72, 12]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

function Tile({ e, i, lang }) {
  return (
    <div
      className="flex-none"
      style={{ width: WIDTHS[i % WIDTHS.length], marginBottom: OFFSETS[i % OFFSETS.length] }}
    >
      <p className="mb-3 text-sm leading-snug">
        <span className="text-text">{e.name}</span>
        <span className="text-muted"> / {e.category[lang]}</span>
      </p>
      <div className="group overflow-hidden rounded-lg" style={{ aspectRatio: e.ratio }}>
        <Cover
          colors={e.colors}
          image={e.image}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
    </div>
  )
}

export default function Exploration() {
  const { t, lang } = useLang()
  const { explorations } = useContent()
  const track = useRef(null)
  const SPEED = 55 // px/s base drift

  useGSAP(
    () => {
      const el = track.current
      if (!el) return
      const half = el.scrollWidth / 2
      if (!half) return

      // Seamless infinite marquee: x drifts left and wraps within one set width.
      const loop = gsap.to(el, {
        x: `-=${half}`,
        ease: 'none',
        duration: half / SPEED,
        repeat: -1,
        modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(-half, 0)) },
      })

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        loop.progress(0.08).pause()
        return
      }

      // Scroll controls: the marquee surges with scroll velocity, then eases
      // back to its calm base drift when scrolling stops.
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const boost = clamp(Math.abs(self.getVelocity()) / 130, 0, 9)
          loop.timeScale(1 + boost)
          gsap.to(loop, { timeScale: 1, duration: 1, ease: 'power2.out', overwrite: true })
        },
      })
      return () => {
        st.kill()
        loop.kill()
      }
    },
    { scope: track, dependencies: [explorations.length] },
  )

  const content = [...explorations, ...explorations]

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <DotField />

      <div className="relative">
        {/* Header — heading left, intro right */}
        <div className="mx-auto mb-16 max-w-[1400px] px-6 md:px-10">
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

        {/* Scroll-driven marquee band */}
        <div className="overflow-hidden">
          <div ref={track} className="flex w-max items-end gap-8 px-6 will-change-transform md:px-10">
            {content.map((e, i) => (
              <Tile key={i} e={e} i={i % explorations.length} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
