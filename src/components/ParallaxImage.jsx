import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cover from './Cover'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Image frame with a scroll-driven parallax on the inner fill. The inner is
// oversized so it always covers the frame as it translates.
export default function ParallaxImage({ colors, image, className = '', amount = 8, label, objectPosition }) {
  const frame = useRef(null)
  const inner = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      gsap.fromTo(
        inner.current,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: frame.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    },
    { scope: frame },
  )

  return (
    <div ref={frame} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="h-[118%] w-full" style={{ marginTop: `-${amount + 1}%` }}>
        <Cover colors={colors} image={image} className="h-full w-full" label={label} objectPosition={objectPosition} />
      </div>
    </div>
  )
}
