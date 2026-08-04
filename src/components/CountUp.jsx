import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Counts the first numeric run inside a result string (e.g. "+38%", "2.4x",
// "×5", "−45%") up from zero when it scrolls into view, keeping the surrounding
// characters (sign, unit, symbol) in place. Falls back to the static string
// when there's no number or reduced motion is on.
export default function CountUp({ value, className }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const el = ref.current
      const str = String(value)
      const m = str.match(/\d+(?:[.,]\d+)?/)
      if (!el || !m) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        el.textContent = str
        return
      }
      const target = parseFloat(m[0].replace(',', '.'))
      const decimals = (m[0].split(/[.,]/)[1] || '').length
      const pre = str.slice(0, m.index)
      const post = str.slice(m.index + m[0].length)
      const render = (n) => (el.textContent = pre + n.toFixed(decimals) + post)
      render(0)
      const obj = { v: 0 }
      gsap.to(obj, {
        v: target,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => render(obj.v),
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    },
    { scope: ref, dependencies: [value] },
  )

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
