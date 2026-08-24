import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))

// Continuous horizontal marquee. Loops seamlessly and leans (skews) with scroll
// velocity — a small signature touch.
export default function Marquee({
  items,
  speed = 30,
  separator = '·',
  outline = false,
  textClass = 'text-4xl md:text-6xl',
  renderItem,
  gapClass = 'gap-8',
  bordered = true,
  fade = false,
}) {
  const track = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      const el = track.current

      // Seamless loop: travel exactly ONE copy's period, not scrollWidth/2.
      // The content is rendered twice, so the first child of the second copy
      // sits precisely one period in — its offsetLeft is the exact distance at
      // which the two copies overlap with no seam. (scrollWidth/2 is off by
      // half a gap and makes the loop visibly jump.)
      let tween = null
      const play = () => {
        const second = el.children[items.length]
        const period = second ? second.offsetLeft : el.scrollWidth / 2
        if (!period) return
        tween?.kill()
        gsap.set(el, { x: 0 })
        tween = gsap.to(el, { x: -period, duration: period / speed, ease: 'none', repeat: -1 })
      }
      play()
      // Re-measure once webfonts have swapped in (they change item widths and
      // would otherwise desync the loop).
      document.fonts?.ready?.then(play)

      // Scroll-velocity skew
      const skewTo = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' })
      const st = ScrollTrigger.create({
        onUpdate: (self) => skewTo(clamp(self.getVelocity() / -220, -14, 14)),
      })
      return () => {
        tween?.kill()
        st.kill()
      }
    },
    { scope: track, dependencies: [items.length, speed] },
  )

  const content = [...items, ...items]
  const render =
    renderItem ||
    ((item) => (
      <span className={`display ${textClass} ${outline ? 'text-outline' : 'text-text/90'}`}>{item}</span>
    ))

  // A soft fade at each end, so items dissolve into the background instead of
  // being hard-clipped by the overflow edge.
  const fadeMask = 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)'

  return (
    <div
      className={`overflow-hidden py-6 ${bordered ? 'border-y border-line' : ''}`}
      style={fade ? { maskImage: fadeMask, WebkitMaskImage: fadeMask } : undefined}
    >
      <div ref={track} className={`flex w-max items-center ${gapClass} whitespace-nowrap will-change-transform`}>
        {content.map((item, i) => (
          <span key={i} className={`flex items-center ${gapClass}`}>
            {render(item, i)}
            {separator ? <span className="text-accent-text text-3xl md:text-5xl">{separator}</span> : null}
          </span>
        ))}
      </div>
    </div>
  )
}
