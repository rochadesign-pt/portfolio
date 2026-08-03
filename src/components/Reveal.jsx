import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// GSAP-powered scroll reveal. Initial state is set synchronously (autoAlpha),
// so there is no opacity flash, and it animates once on scroll-in. Smoother on
// mobile than IntersectionObserver-based fades, and synced with Lenis.
export default function Reveal({ children, as = 'div', delay = 0, y = 24, className = '', ...rest }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        gsap.set(el, { autoAlpha: 1, y: 0 })
        return
      }
      // Less travel on small screens keeps reveals calm and flicker-free.
      const travel = window.innerWidth < 768 ? Math.min(y, 16) : y
      gsap.set(el, { autoAlpha: 0, y: travel })
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        delay,
        force3D: true,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      })
    },
    { scope: ref },
  )

  const Tag = as
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
