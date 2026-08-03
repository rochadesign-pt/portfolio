import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Number counts up when scrolled into view.
export default function Counter({ value, suffix = '', className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const el = ref.current
      if (reduce) {
        el.textContent = `${value}${suffix}`
        return
      }
      const obj = { n: 0 }
      gsap.to(obj, {
        n: value,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.n)}${suffix}`
        },
      })
    },
    { scope: ref, dependencies: [value] },
  )

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
