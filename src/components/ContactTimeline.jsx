import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Vertical timeline whose connecting line fills on scroll (scrubbed), lighting
// each dot and revealing each step as the fill reaches it. Colours are written
// as tokens with CSS transitions, so light/dark and the accent all follow the
// theme, and reduced-motion just shows everything filled.
export default function ContactTimeline({ steps }) {
  const root = useRef(null)
  const track = useRef(null)
  const fill = useRef(null)
  const stepEls = useRef([])
  const dotEls = useRef([])
  const contentEls = useRef([])

  useGSAP(
    () => {
      const dots = dotEls.current.filter(Boolean)
      const contents = contentEls.current.filter(Boolean)
      if (dots.length < 2) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      let first = 0
      let span = 1
      let centers = []
      const measure = () => {
        const cTop = root.current.getBoundingClientRect().top
        centers = dots.map((d) => {
          const r = d.getBoundingClientRect()
          return r.top - cTop + r.height / 2
        })
        first = centers[0]
        span = Math.max(1, centers[centers.length - 1] - first)
        gsap.set([track.current, fill.current], { top: first })
        gsap.set(track.current, { height: span })
      }

      const apply = (p) => {
        fill.current.style.height = `${span * p}px`
        dots.forEach((dot, i) => {
          const dp = (centers[i] - first) / span
          const on = p + 0.001 >= dp - 0.03
          dot.style.backgroundColor = on ? 'var(--color-accent)' : 'var(--color-bg)'
          dot.style.borderColor = on ? 'var(--color-accent)' : 'var(--color-line)'
          const content = contents[i]
          if (content) {
            content.style.opacity = on ? '1' : '0.28'
            content.style.transform = on ? 'translateY(0)' : 'translateY(12px)'
          }
        })
      }

      measure()
      if (reduce) {
        apply(1)
        return
      }
      apply(0)

      const state = { p: 0 }
      const tween = gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: () => apply(state.p),
        scrollTrigger: {
          trigger: root.current,
          start: 'top 72%',
          end: 'bottom 80%',
          scrub: 0.5,
          onRefresh: measure,
        },
      })
      return () => tween.scrollTrigger?.kill()
    },
    { scope: root, dependencies: [steps.length] },
  )

  return (
    <div ref={root} className="relative">
      <div
        ref={track}
        aria-hidden="true"
        className="absolute left-[15px] w-0.5 -translate-x-1/2 rounded-full bg-line md:left-[23px]"
        style={{ top: 0, height: 0 }}
      />
      <div
        ref={fill}
        aria-hidden="true"
        className="absolute left-[15px] w-0.5 -translate-x-1/2 rounded-full bg-accent md:left-[23px]"
        style={{ top: 0, height: 0 }}
      />

      {steps.map((step, i) => (
        <div key={step.n} ref={(el) => (stepEls.current[i] = el)} className="relative pl-12 pb-14 last:pb-0 md:pl-16">
          <span
            ref={(el) => (dotEls.current[i] = el)}
            aria-hidden="true"
            className="absolute left-[15px] top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border transition-colors duration-500 md:left-[23px]"
            style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-bg)' }}
          />
          <div
            ref={(el) => (contentEls.current[i] = el)}
            className="transition-all duration-700 ease-out"
            style={{ opacity: 0.28, transform: 'translateY(12px)' }}
          >
            <span className="label text-muted">{step.n}</span>
            <h3 className="display mt-6 text-2xl md:text-3xl">{step.title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
