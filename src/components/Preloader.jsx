import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const WORD = 'Rocha Design Studio'

// Branded intro. Counts to 100 while the wordmark rises, then wipes up to
// reveal the site. Once per session; skipped for reduced-motion.
export default function Preloader() {
  const [done, setDone] = useState(false)
  const root = useRef(null)
  const countRef = useRef(null)

  const finish = () => {
    document.body.style.overflow = ''
    window.__rdsLoaded = true
    window.dispatchEvent(new Event('rds:loaded'))
    setDone(true)
  }

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const seen = sessionStorage.getItem('rds-preloaded')
      if (reduce || seen) {
        finish()
        return
      }
      sessionStorage.setItem('rds-preloaded', '1')
      document.body.style.overflow = 'hidden'

      const counter = { v: 0 }
      const tl = gsap.timeline({ onComplete: finish })

      tl.to('.pl-letter', { y: '0%', duration: 0.9, stagger: 0.03, ease: 'power3.out' }, 0.1)
        .to(
          counter,
          {
            v: 100,
            duration: 2.1,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            },
          },
          0,
        )
        .to('.pl-bar', { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, 0)
        .to('.pl-letter', { y: '-110%', duration: 0.6, stagger: 0.02, ease: 'power3.in' }, '+=0.2')
        .to('.pl-meta', { opacity: 0, duration: 0.3 }, '<')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.2')
    },
    { scope: root },
  )

  if (done) return null

  return (
    <div ref={root} className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg px-6 py-8 md:px-10 md:py-10">
      <div className="pl-meta flex items-center justify-between text-xs text-muted">
        <span className="label">Rocha Design Studio</span>
        <span className="label">Est. 2025</span>
      </div>

      <div className="flex flex-1 items-center">
        <h1 className="display text-[13vw] leading-none md:text-[8rem]" aria-label={WORD}>
          {WORD.split(' ').map((w, wi) => (
            <span key={wi} className="mr-[0.25em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span className="pl-letter inline-block translate-y-full">{w}</span>
            </span>
          ))}
        </h1>
      </div>

      <div className="pl-meta flex items-end justify-between">
        <div className="w-1/2 max-w-xs">
          <div className="h-px w-full origin-left bg-line">
            <div className="pl-bar h-px w-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>
        <span ref={countRef} className="display text-3xl tabular-nums md:text-4xl">
          000
        </span>
      </div>
    </div>
  )
}
