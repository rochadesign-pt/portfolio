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
}) {
  const track = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      const half = track.current.scrollWidth / 2
      gsap.to(track.current, { x: -half, duration: half / speed, ease: 'none', repeat: -1 })

      // Scroll-velocity skew
      const skewTo = gsap.quickTo(track.current, 'skewX', { duration: 0.5, ease: 'power3' })
      const st = ScrollTrigger.create({
        onUpdate: (self) => skewTo(clamp(self.getVelocity() / -220, -14, 14)),
      })
      return () => st.kill()
    },
    { scope: track },
  )

  const content = [...items, ...items]
  const render =
    renderItem ||
    ((item) => (
      <span className={`display ${textClass} ${outline ? 'text-outline' : 'text-text/90'}`}>{item}</span>
    ))

  return (
    <div className="overflow-hidden py-6 border-y border-line">
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
