import { useEffect, useRef } from 'react'

// A slowly rotating sphere made of dots (Fibonacci lattice), drawn on canvas.
// Depth drives each dot's size + opacity so it reads as a volume, and the
// pointer tilts it gently when hovered. Reduced-motion: a single static frame.
const N = 900

export default function DotSphere({ className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    // Unit-sphere points, evenly spread
    const pts = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const t = golden * i
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r])
    }

    let W = 0
    let H = 0
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 }
    const isLight = () => document.documentElement.getAttribute('data-theme') === 'light'

    const size = () => {
      const r = wrap.getBoundingClientRect()
      W = r.width
      H = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(W * dpr))
      canvas.height = Math.max(1, Math.floor(H * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, W, H)
      const base = isLight() ? '23,20,15' : '242,239,233'
      const R = Math.min(W, H) * 0.42
      const cx = W / 2
      const cy = H / 2
      tilt.x += (tilt.tx - tilt.x) * 0.06
      tilt.y += (tilt.ty - tilt.y) * 0.06
      const ay = time * 0.25 + tilt.x * 0.9
      const ax = -0.35 + tilt.y * 0.6
      const sy = Math.sin(ay)
      const cyR = Math.cos(ay)
      const sx = Math.sin(ax)
      const cxR = Math.cos(ax)
      for (const [x, y, z] of pts) {
        // rotate around Y, then X
        const x1 = x * cyR + z * sy
        const z1 = -x * sy + z * cyR
        const y2 = y * cxR - z1 * sx
        const z2 = y * sx + z1 * cxR
        const depth = (z2 + 1) / 2 // 0 back → 1 front
        const persp = 1 / (1.9 - z2 * 0.5)
        const px = cx + x1 * R * persp * 1.45
        const py = cy + y2 * R * persp * 1.45
        ctx.fillStyle = `rgba(${base},${0.08 + depth * 0.82})`
        ctx.beginPath()
        ctx.arc(px, py, 0.35 + depth * 1.05, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let raf = 0
    let running = false
    const loop = () => {
      draw(performance.now() / 1000)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running || reduce) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    size()
    draw(0)

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()))
    io.observe(wrap)
    const ro = new ResizeObserver(() => {
      size()
      draw(performance.now() / 1000)
    })
    ro.observe(wrap)

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      tilt.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      tilt.ty = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const onLeave = () => {
      tilt.tx = 0
      tilt.ty = 0
    }
    if (fine) {
      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerleave', onLeave)
    }

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrapRef} aria-hidden="true" className={`absolute inset-0 ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
