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

// Uniform card; the 3D fan is applied to it per-frame in the parent.
function Tile({ e }) {
  return (
    <div className="w-[190px] flex-none [backface-visibility:hidden] will-change-transform md:w-[230px]">
      <div className="aspect-[4/5] overflow-hidden rounded-xl shadow-2xl shadow-black/50">
        <Cover colors={e.colors} image={e.image} className="h-full w-full" />
      </div>
    </div>
  )
}

// The Lab: a draggable, scroll-nudged marquee whose tiles fan into perspective —
// small and receding at centre, larger and angled toward the edges, converging
// on a vanishing point (à la the reference). Behind it, the cursor-lit dot field.
export default function Exploration() {
  const { t, lang } = useLang()
  const { explorations } = useContent()
  const track = useRef(null)

  useGSAP(
    () => {
      const el = track.current
      if (!el) return
      const tiles = Array.from(el.children)
      if (!tiles.length) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const use3D = window.matchMedia('(min-width: 768px)').matches
      const DRIFT = 0.4

      // Geometry captured pre-transform, so per-frame work is pure math (no
      // layout reads, no transform feedback loop).
      let half = 0
      let baseLeft = 0
      let bases = []
      let wrap = (x) => x
      const measure = () => {
        // clear transforms to read clean layout
        tiles.forEach((tl) => (tl.style.transform = ''))
        el.style.transform = ''
        half = el.scrollWidth / 2
        wrap = gsap.utils.wrap(-half, 0)
        baseLeft = el.getBoundingClientRect().left
        bases = tiles.map((tl) => {
          const r = tl.getBoundingClientRect()
          return r.left + r.width / 2 - baseLeft
        })
      }
      measure()
      if (!half) return

      const state = { pos: 0 }
      let vel = 0
      let dragging = false
      let lastX = 0
      let lastDX = 0
      let flick = null

      const apply3D = (tx) => {
        const c = window.innerWidth / 2
        for (let i = 0; i < tiles.length; i++) {
          const cx = baseLeft + tx + bases[i]
          const d = clamp((cx - c) / c, -1.25, 1.25)
          const ad = Math.abs(d)
          const rotY = -d * 40
          const tz = ad * ad * 120
          const scale = 0.72 + ad * 0.72 // centre recedes, edges swell → vanishing point
          tiles[i].style.transform = `translateZ(${tz}px) rotateY(${rotY}deg) scale(${scale})`
          tiles[i].style.zIndex = `${200 - Math.round(ad * 120)}`
        }
      }
      const render = () => {
        const tx = wrap(state.pos)
        el.style.transform = `translate3d(${tx}px,0,0)`
        if (use3D) apply3D(tx)
      }
      render()

      const tick = () => {
        if (dragging || flick?.isActive()) return
        vel += (-DRIFT - vel) * 0.05
        state.pos += vel
        render()
      }
      if (!reduce) gsap.ticker.add(tick)

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          if (reduce || dragging || flick?.isActive()) return
          vel += clamp(self.getVelocity() / -2600, -5, 5)
        },
      })

      // Drag to move; flick to throw with a gentle bouncy overshoot.
      const onDown = (e) => {
        dragging = true
        lastX = e.clientX
        lastDX = 0
        flick?.kill()
        el.style.cursor = 'grabbing'
        try {
          el.setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
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
          ease: 'back.out(1.1)',
          onUpdate: render,
          onComplete: () => {
            vel = -DRIFT
          },
        })
      }

      const onResize = () => {
        const p = state.pos
        measure()
        state.pos = p
        render()
      }

      el.style.cursor = 'grab'
      el.style.touchAction = 'pan-y'
      el.addEventListener('pointerdown', onDown)
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('resize', onResize)

      return () => {
        gsap.ticker.remove(tick)
        st.kill()
        flick?.kill()
        el.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('resize', onResize)
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

        {/* Perspective marquee — draggable, scroll-nudged */}
        <div className="overflow-hidden py-10 [perspective-origin:50%_50%] [perspective:1600px]">
          <div
            ref={track}
            className="flex w-max items-center gap-5 px-6 [transform-style:preserve-3d] will-change-transform md:gap-8 md:px-10"
          >
            {content.map((e, i) => (
              <Tile key={i} e={e} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
