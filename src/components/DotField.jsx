import { useRef, useEffect } from 'react'

// A whisper-quiet dot grid that gains presence in a soft circle around the
// cursor — a spotlight that raises the dots' opacity where the pointer is.
// Desktop only (no cursor on touch); the faint base grid still shows everywhere.
export default function DotField({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    let nx = 0
    let ny = 0
    const flush = () => {
      raf = 0
      el.style.setProperty('--mx', `${nx}px`)
      el.style.setProperty('--my', `${ny}px`)
    }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      nx = e.clientX - r.left
      ny = e.clientY - r.top
      el.style.setProperty('--on', '1')
      if (!raf) raf = requestAnimationFrame(flush)
    }
    const onLeave = () => el.style.setProperty('--on', '0')

    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className={`dotfield pointer-events-none absolute inset-0 ${className}`} />
}
