import { useRef, useEffect } from 'react'

// A whisper-quiet dot grid, rendered on canvas so it can breathe: the dots
// twinkle slowly and a few streak into short dashes (ambient life), and around
// the cursor they bloom into a small grid of crosses — a "magnet" that pulls the
// field into lines, with the odd blue accent. Desktop gets the magnet (needs a
// cursor); the ambient motion runs everywhere. Reduced-motion keeps the static
// grid + cursor magnet but drops the autonomous twinkle/streaks.
const SPACING = 26 // grid pitch (matches the old CSS grid)
const DOT_R = 1.0
const MAGNET_R = 175 // px — cursor influence radius
const ARM_MAX = 12 // half the pitch, so arms of adjacent crosses meet into a grid
const BLUE = '90,120,255'

export default function DotField({ className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0
    let H = 0
    let dots = []
    const mouse = { x: -9999, y: -9999, on: 0 }
    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light'

    const build = () => {
      const r = wrap.getBoundingClientRect()
      W = r.width
      H = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(W * dpr))
      canvas.height = Math.max(1, Math.floor(H * dpr))
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(W / SPACING) + 1
      const rows = Math.ceil(H / SPACING) + 1
      dots = []
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          dots.push({
            x: i * SPACING,
            y: j * SPACING,
            // deterministic per-dot phase + sparse blue / streak subsets, so the
            // pattern is stable across resizes (no Math.random flicker).
            phase: (i * 1.7 + j * 2.3) % (Math.PI * 2),
            blue: (i * 7 + j * 13) % 41 === 0,
            streak: (i * 3 + j * 5) % 47 === 0,
          })
        }
      }
    }

    const render = (time) => {
      ctx.clearRect(0, 0, W, H)
      const light = isLight()
      const base = light ? '0,0,0' : '255,255,255'
      const baseA = light ? 0.06 : 0.05
      const strongA = light ? 0.5 : 0.6

      for (const d of dots) {
        // Ambient twinkle (skipped under reduced-motion)
        let a = baseA
        if (!reduce) a = baseA * (0.55 + 0.95 * (0.5 + 0.5 * Math.sin(time * 1.2 + d.phase)))

        // Cursor magnet influence
        let infl = 0
        if (mouse.on) {
          const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y)
          if (dist < MAGNET_R) infl = 1 - dist / MAGNET_R
        }

        if (infl > 0.03) {
          // Bloom into a cross whose arms grow with proximity → grid near cursor
          const arm = ARM_MAX * infl
          const col = d.blue && infl > 0.15 ? BLUE : base
          const la = Math.min(0.72, baseA + strongA * infl)
          ctx.strokeStyle = `rgba(${col},${la})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(d.x - arm, d.y)
          ctx.lineTo(d.x + arm, d.y)
          ctx.moveTo(d.x, d.y - arm)
          ctx.lineTo(d.x, d.y + arm)
          ctx.stroke()
          continue
        }

        const col = d.blue ? BLUE : base
        let a2 = d.blue && !reduce ? a * 1.7 : a

        // Occasional streak — a dot briefly elongates into a short dash
        if (d.streak && !reduce) {
          const s = Math.sin(time * 0.9 + d.phase)
          if (s > 0.55) {
            const len = ((s - 0.55) / 0.45) * 9
            ctx.strokeStyle = `rgba(${col},${Math.min(0.36, a2 + 0.12)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(d.x - len, d.y)
            ctx.lineTo(d.x + len, d.y)
            ctx.stroke()
            continue
          }
        }

        ctx.fillStyle = `rgba(${col},${a2})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // The loop is needed for ambient motion (!reduce) or the magnet (fine
    // pointer). A reduced-motion touch device gets a single static paint.
    const needsLoop = fine || !reduce
    let raf = 0
    let running = false
    const loop = () => {
      render(performance.now() / 1000)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    build()
    render(performance.now() / 1000) // correct first paint

    let io = null
    if (needsLoop) {
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '150px' })
        io.observe(wrap)
      } else {
        start()
      }
    }

    const onMove = (e) => {
      if (!fine) return
      const r = wrap.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.on = 1
    }
    const onLeave = () => (mouse.on = 0)
    const ro = new ResizeObserver(() => {
      build()
      render(performance.now() / 1000)
    })
    ro.observe(wrap)
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true })
      wrap.addEventListener('pointerleave', onLeave)
    }

    return () => {
      stop()
      io?.disconnect()
      ro.disconnect()
      if (fine) {
        window.removeEventListener('pointermove', onMove)
        wrap.removeEventListener('pointerleave', onLeave)
      }
    }
  }, [])

  return (
    <div ref={wrapRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
