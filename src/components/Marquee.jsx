import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

// Continuous horizontal marquee driven by GSAP. Duplicates content for a seamless loop.
export default function Marquee({ items, speed = 30, separator = '·' }) {
  const track = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      const half = track.current.scrollWidth / 2
      gsap.to(track.current, {
        x: -half,
        duration: half / speed,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: track },
  )

  const content = [...items, ...items]

  return (
    <div className="overflow-hidden py-6 border-y border-line">
      <div ref={track} className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform">
        {content.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="display text-4xl md:text-6xl text-text/90">{item}</span>
            <span className="text-accent text-3xl md:text-5xl">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
