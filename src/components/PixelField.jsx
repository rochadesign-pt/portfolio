import { useEffect, useRef } from 'react'

// Pixel art on canvas, in two modes:
//  · "skyline" — columns of pixels rise from the bottom edge along a slowly
//    shifting profile (denser at the base, scattering upward). `seed` changes
//    the profile; columns ease toward it, so switching seeds reads as a swell.
//  · "text" — a word drawn in pixels (e.g. the footer wordmark), with a sandy
//    scatter thickening toward the bottom edge.
// Pixels are mostly ink with a share in the brand accent. Around the cursor they
// bloom (skyline) or get pushed aside (text). Reduced-motion: static frame +
// cursor response, no autonomous drift. Only animates while on screen.
const PITCH = 8
const SIZE = 3

// Cheap deterministic hash → [0,1)
const hash = (x, y, z = 0) => {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

const isLight = () => document.documentElement.getAttribute('data-theme') !== 'dark'

export default function PixelField({ mode = 'skyline', seed = 0, text = 'ROCHA', className = '' }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const seedRef = useRef(seed)
  seedRef.current = seed

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    let W = 0
    let H = 0
    let cols = 0
    let rows = 0
    let heights = [] // skyline: current column heights (0..1), eased
    let mask = null // text: Uint8Array of inside-glyph cells
    const mouse = { x: -9999, y: -9999, on: 0 }

    const buildMask = () => {
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const o = off.getContext('2d')
      o.fillStyle = '#000'
      o.textBaseline = 'alphabetic'
      // Fit the word to the width, leaving room for the scatter below
      let fs = rows
      o.font = `600 ${fs}px Switzer, Inter, system-ui, sans-serif`
      const w = o.measureText(text).width
      fs = Math.min(rows * 0.95, (fs * cols * 0.98) / w)
      o.font = `600 ${fs}px Switzer, Inter, system-ui, sans-serif`
      const m = o.measureText(text)
      const x = (cols - m.width) / 2
      const y = Math.round(rows * 0.08 + m.actualBoundingBoxAscent)
      o.fillText(text, x, y)
      const data = o.getImageData(0, 0, cols, rows).data
      mask = new Uint8Array(cols * rows)
      for (let i = 0; i < cols * rows; i++) mask[i] = data[i * 4 + 3] > 110 ? 1 : 0
    }

    const size = () => {
      const r = wrap.getBoundingClientRect()
      W = r.width
      H = r.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(W * dpr))
      canvas.height = Math.max(1, Math.floor(H * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(W / PITCH)
      rows = Math.ceil(H / PITCH)
      heights = Array.from({ length: cols }, () => 0)
      if (mode === 'text') buildMask()
    }

    // Target column height for the skyline profile (0..1)
    const profile = (i, t, s) => {
      const u = i / Math.max(1, cols)
      const a = 0.5 + 0.5 * Math.sin(u * (5 + s * 1.7) + t * 0.22 + s * 2.1)
      const b = 0.5 + 0.5 * Math.sin(u * (13 + s * 3.1) - t * 0.31 + s)
      const c = hash(i, 7, s) // per-column jitter
      return 0.18 + 0.5 * a * a + 0.22 * b + 0.12 * c
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, W, H)
      const light = isLight()
      const ink = light ? '23,20,15' : '242,239,233'
      const acc = light ? '232,170,0' : '255,199,0'
      const s = seedRef.current
      const step = Math.floor(t * 1.4) // twinkle tick

      if (mode === 'skyline') {
        for (let i = 0; i < cols; i++) {
          const target = profile(i, reduce ? 0 : t, s)
          heights[i] += (target - heights[i]) * 0.045
          const x = i * PITCH
          // cursor lift on this column
          let lift = 0
          if (mouse.on) {
            const dx = Math.abs(x - mouse.x)
            if (dx < 140) lift = (1 - dx / 140) ** 2 * 0.35
          }
          const h = Math.min(1, heights[i] + lift) * rows
          for (let j = 0; j < rows; j++) {
            const d = rows - 1 - j // distance from the bottom, in cells
            if (d > h) continue
            const p = (1 - d / h) ** 1.6
            const r = hash(i, j, reduce ? 0 : step + ((i * 13) % 5))
            if (r > p * 0.92) continue
            const accent = hash(i, j, 99) < 0.32
            const alpha = 0.18 + 0.62 * p
            ctx.fillStyle = `rgba(${accent ? acc : ink},${accent ? Math.min(1, alpha + 0.2) : alpha})`
            ctx.fillRect(x, j * PITCH, SIZE, SIZE)
          }
        }
        return
      }

      // text mode
      for (let j = 0; j < rows; j++) {
        const fall = Math.max(0, (j / rows - 0.62) / 0.38) // bottom scatter 0..1
        for (let i = 0; i < cols; i++) {
          const inside = mask[j * cols + i]
          const r = hash(i, j, reduce ? 0 : Math.floor(t * 0.8 + hash(i, j, 3) * 4))
          const p = inside ? 0.9 : fall * fall * 0.75
          if (r > p) continue
          let x = i * PITCH
          let y = j * PITCH
          if (mouse.on) {
            const dx = x - mouse.x
            const dy = y - mouse.y
            const dist = Math.hypot(dx, dy)
            if (dist < 110 && dist > 0.01) {
              const f = (1 - dist / 110) ** 2 * 26
              x += (dx / dist) * f
              y += (dy / dist) * f
            }
          }
          const accent = hash(i, j, 99) < 0.3
          const alpha = inside ? 0.85 : 0.25 + 0.5 * fall
          ctx.fillStyle = `rgba(${accent ? acc : ink},${alpha})`
          ctx.fillRect(x, y, SIZE, SIZE)
        }
      }
    }

    let raf = 0
    let running = false
    const loop = () => {
      draw(performance.now() / 1000)
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

    size()
    if (mode === 'skyline') heights = heights.map((_, i) => profile(i, 0, seedRef.current) * 0.2)
    draw(0)

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '100px' })
    io.observe(wrap)
    const ro = new ResizeObserver(() => size())
    ro.observe(wrap)
    // Re-render the wordmark once webfonts land (mask depends on Switzer)
    document.fonts?.ready.then(() => mode === 'text' && size())

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.on = mouse.y > -40 && mouse.y < r.height + 40 ? 1 : 0
    }
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [mode, text])

  return (
    <div ref={wrapRef} aria-hidden="true" className={`pointer-events-none relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
