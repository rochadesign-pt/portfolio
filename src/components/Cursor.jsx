import { useEffect, useRef, useState } from 'react'

// A subtle custom cursor. Off by default (the OS cursor shows). Over any element
// marked `data-cursor="…"` it morphs into a filled accent circle with that label
// inside ("Ver", "Arrastar", "↗") and the OS cursor hides there (see the
// `.rds-cursor [data-cursor]` rule in index.css). Fine-pointer only; it follows
// with a light lerp (instant under reduced motion).
export default function Cursor() {
  const outer = useRef(null)
  const [active, setActive] = useState(false)
  const [label, setLabel] = useState('')
  const activeRef = useRef(false)
  const labelRef = useRef('')

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    root.classList.add('rds-cursor')

    let cx = window.innerWidth / 2
    let cy = window.innerHeight / 2
    let tx = cx
    let ty = cy
    let raf = 0

    const loop = () => {
      const k = reduce ? 1 : 0.2
      cx += (tx - cx) * k
      cy += (ty - cy) * k
      if (outer.current) outer.current.style.transform = `translate3d(${cx}px,${cy}px,0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      const zone = e.target?.closest?.('[data-cursor]')
      const nextActive = !!zone
      const nextLabel = zone?.dataset.cursor || ''
      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive
        setActive(nextActive)
      }
      if (nextLabel !== labelRef.current) {
        labelRef.current = nextLabel
        setLabel(nextLabel)
      }
    }
    const onLeave = () => {
      if (activeRef.current) {
        activeRef.current = false
        setActive(false)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      root.classList.remove('rds-cursor')
    }
  }, [])

  return (
    <div ref={outer} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block">
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-ink transition-[width,height,opacity] duration-300 ease-out ${
          active ? 'h-[68px] w-[68px] opacity-100' : 'h-2 w-2 opacity-0'
        }`}
      >
        <span
          className={`text-[10px] font-medium uppercase tracking-[0.12em] transition-opacity duration-200 ${
            active ? 'opacity-100 delay-100' : 'opacity-0'
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
