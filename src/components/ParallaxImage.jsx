import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cover from './Cover'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// An image (or duotone placeholder) that reveals with a clip-wipe on enter and
// drifts with a gentle parallax as it scrolls through the viewport. The inner
// layer is over-scaled so the parallax never exposes an edge; the caption sits
// outside it, so it stays put. Parallax is desktop + motion-ok only; under
// reduced motion it just fades in.
export default function ParallaxImage({ colors, image, label, className = '', speed = 7 }) {
  const ref = useRef(null)
  const innerRef = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const desktop = window.matchMedia('(min-width: 768px)').matches

      gsap.fromTo(
        ref.current,
        {
          clipPath: reduce ? 'inset(0 0 0% 0 round 1rem)' : 'inset(0 0 100% 0 round 1rem)',
          autoAlpha: reduce ? 0 : 1,
        },
        {
          clipPath: 'inset(0 0 0% 0 round 1rem)',
          autoAlpha: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        },
      )

      if (!reduce && desktop) {
        gsap.fromTo(
          innerRef.current,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      }
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div ref={innerRef} className="absolute inset-0 scale-[1.16]">
        <Cover colors={colors} image={image} className="h-full w-full" />
      </div>
      {label && (
        <span className="label absolute bottom-4 left-4 z-10 text-white/70 mix-blend-difference">{label}</span>
      )}
    </div>
  )
}
