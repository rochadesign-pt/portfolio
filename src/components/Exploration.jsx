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

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

// Uniform card — every tile is the same width and aspect ratio for a clean,
// even row (à la the reference), caption sitting quietly beneath.
function Tile({ e, lang }) {
  return (
    <div className="w-[240px] flex-none md:w-[280px]">
      <div className="group aspect-[4/5] overflow-hidden rounded-xl">
        <Cover
          colors={e.colors}
          image={e.image}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <p className="mt-3 truncate text-sm leading-snug">
        <span className="text-text">{e.name}</span>
        <span className="text-muted"> / {e.category[lang]}</span>
      </p>
    </div>
  )
}

export default function Exploration() {
  const { t, lang } = useLang()
  const { explorations } = useContent()
  const track = useRef(null)

  useGSAP(
    () => {
      const el = track.current
      if (!el) return
      const half = el.scrollWidth / 2
      if (!half) return

      const wrap = gsap.utils.wrap(-half, 0)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const DRIFT = 0.4 // px/frame base drift (≈24px/s) — slow and calm

      const state = { pos: 0 }
      let vel = 0
      let dragging = false
      let lastX = 0
      let lastDX = 0
      let flick = null

      const render = () => {
        el.style.transform = `translate3d(${wrap(state.pos)}px,0,0)`
      }
      render()

      // Per-frame integrator: eases velocity back to the calm leftward drift.
      const tick = () => {
        if (dragging || flick?.isActive()) return
        vel += (-DRIFT - vel) * 0.05
        state.pos += vel
        render()
      }
      if (!reduce) gsap.ticker.add(tick)

      // Scroll surge — nudges velocity with scroll, then the tick settles it.
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          if (reduce || dragging || flick?.isActive()) return
          vel += clamp(self.getVelocity() / -2600, -5, 5)
        },
      })

      // Drag to move; on release, throw with a slightly bouncy overshoot.
      const onDown = (e) => {
        dragging = true
        lastX = e.clientX
        lastDX = 0
        flick?.kill()
        el.style.cursor = 'grabbing'
        try {
          el.setPointerCapture(e.pointerId)
        } catch {
          /* not all pointers are capturable */
        }
      }
      const onMove = (e) => {
        if (!dragging) return
        const dx = e.clientX - lastX
        lastX = e.clientX
        lastDX = dx
        state.pos += dx
        render()
      }
      const onUp = () => {
        if (!dragging) return
        dragging = false
        el.style.cursor = 'grab'
        vel = 0
        const dist = clamp(lastDX * 16, -1400, 1400)
        flick = gsap.to(state, {
          pos: state.pos + dist,
          duration: 1.15,
          ease: 'back.out(1.1)', // overshoots then settles — a gentle bounce
          onUpdate: render,
          onComplete: () => {
            vel = -DRIFT
          },
        })
      }

      el.style.cursor = 'grab'
      el.style.touchAction = 'pan-y' // let the page scroll vertically; we take horizontal drags
      el.addEventListener('pointerdown', onDown)
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)

      return () => {
        gsap.ticker.remove(tick)
        st.kill()
        flick?.kill()
        el.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
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

        {/* Scroll-driven, draggable marquee band */}
        <div className="overflow-hidden">
          <div ref={track} className="flex w-max items-start gap-6 px-6 will-change-transform md:gap-8 md:px-10">
            {content.map((e, i) => (
              <Tile key={i} e={e} lang={lang} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
