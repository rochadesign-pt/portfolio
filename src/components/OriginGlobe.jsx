import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import { landDots } from '../data/landDots'

gsap.registerPlugin(ScrollTrigger)

// Ílhavo, Portugal — the home coordinate the globe flies to.
const TARGET = { lat: 40.6035, lon: -8.6704 }
const D2R = Math.PI / 180
const SWING = 2.15 // radians the globe rotates in before homing to the target
const ZOOM = 3.15 // how far we push in by the end

const hexToRgb = (hex) => {
  const h = hex.trim().replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

// The world's landmass as unit-sphere points, from a pre-sampled land mask
// (src/data/landDots — [lon, lat] pairs). `stride` thins it for mobile.
function landPoints(stride) {
  const pts = []
  for (let i = 0; i < landDots.length; i += stride) {
    const la = landDots[i][1] * D2R
    const lo = landDots[i][0] * D2R
    pts.push({
      x: Math.cos(la) * Math.sin(lo),
      y: Math.sin(la),
      z: Math.cos(la) * Math.cos(lo),
    })
  }
  return pts
}

// A dotted globe that rotates the target into frame and zooms into it as the
// section scrolls. Pure canvas 2D — no WebGL, no new deps — so it stays light
// and on-brand with the site's dot motif. The scroll progress is read via a
// ScrollTrigger scrub (no pin: a sticky inner layer holds it, matching the
// home CTA pattern that plays nicely with Lenis).
export default function OriginGlobe() {
  const { t } = useLang()
  const o = t.studioPage.origin

  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const worldRef = useRef(null)
  const homeRef = useRef(null)
  const placeRef = useRef(null)
  const hintRef = useRef(null)

  const progress = useRef(0)
  const visible = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768

    const points = landPoints(mobile ? 2 : 1)
    // Target as a unit vector in the same (lat/lon) frame.
    const tLat = TARGET.lat * D2R
    const tLon = TARGET.lon * D2R
    const T = {
      x: Math.cos(tLat) * Math.sin(tLon),
      y: Math.sin(tLat),
      z: Math.cos(tLat) * Math.cos(tLon),
    }

    // Theme colours, refreshed on theme change.
    let cText = { r: 242, g: 239, b: 233 }
    let cAccent = { r: 255, g: 199, b: 0 }
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement)
      try {
        cText = hexToRgb(cs.getPropertyValue('--color-text'))
        cAccent = hexToRgb(cs.getPropertyValue('--color-accent'))
      } catch {
        /* keep defaults */
      }
    }
    readColors()
    const themeObs = new MutationObserver(readColors)
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    let W = 0
    let H = 0
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.clientWidth
      H = canvas.clientHeight
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // rotate helpers
    const rotY = (v, a) => {
      const c = Math.cos(a)
      const s = Math.sin(a)
      return { x: v.x * c + v.z * s, y: v.y, z: -v.x * s + v.z * c }
    }
    const rotX = (v, b) => {
      const c = Math.cos(b)
      const s = Math.sin(b)
      return { x: v.x, y: v.y * c - v.z * s, z: v.y * s + v.z * c }
    }

    let raf = 0
    const render = (time) => {
      raf = requestAnimationFrame(render)
      if (!visible.current) return

      const p = progress.current
      // Reversed journey: p=0 starts zoomed into Ílhavo (rooted), scrolling
      // pulls back out to the whole globe (available to the world). `e` is the
      // Ílhavo-proximity: 1 at home, 0 at the world view.
      const e = easeInOut(1 - p)
      const cx = W / 2
      // Nudge the globe down a touch so it doesn't crowd the hero above it.
      const cy = H / 2 + H * 0.08
      const R0 = Math.min(W, H) * (mobile ? 0.36 : 0.34)
      const scale = 1 + (ZOOM - 1) * e
      const Reff = R0 * scale

      // idle drift before you engage, fading as the fly-in takes over
      const idle = reduce ? 0 : (time / 1000) * 0.14 * (1 - e)
      const yaw = -tLon - (1 - e) * SWING + idle
      const pitch = 0.14 + (tLat - 0.14) * e

      ctx.clearRect(0, 0, W, H)

      // dots
      for (let i = 0; i < points.length; i++) {
        const base = points[i]
        let v = rotY(base, yaw)
        v = rotX(v, pitch)
        if (v.z < -0.25) continue
        const sx = cx + v.x * Reff
        const sy = cy - v.y * Reff
        // proximity to target (pre-rotation dot product) → accent tint near Ílhavo
        const near = base.x * T.x + base.y * T.y + base.z * T.z
        const depth = clamp01((v.z + 0.25) / 1.25)
        const a = (0.12 + depth * 0.5) * clamp01(0.4 + v.z)
        const dr = (0.7 + depth * 0.9) * (mobile ? 0.85 : 1)
        const tint = smooth(0.986, 0.999, near) * e
        const col = tint > 0
          ? {
              r: cText.r + (cAccent.r - cText.r) * tint,
              g: cText.g + (cAccent.g - cText.g) * tint,
              b: cText.b + (cAccent.b - cText.b) * tint,
            }
          : cText
        ctx.beginPath()
        ctx.fillStyle = `rgba(${col.r | 0},${col.g | 0},${col.b | 0},${a + tint * 0.4})`
        ctx.arc(sx, sy, dr + tint * 1.2, 0, Math.PI * 2)
        ctx.fill()
      }

      // marker at the target
      let tv = rotY(T, yaw)
      tv = rotX(tv, pitch)
      const mAlpha = smooth(0.32, 0.72, e)
      if (tv.z > 0 && mAlpha > 0.001) {
        const mx = cx + tv.x * Reff
        const my = cy - tv.y * Reff
        const ac = `${cAccent.r},${cAccent.g},${cAccent.b}`
        // pulsing ring
        if (!reduce) {
          const pulse = (time / 1000) % 1.8
          const rr = 8 + pulse * 26
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${ac},${mAlpha * (1 - pulse / 1.8) * 0.7})`
          ctx.lineWidth = 1.5
          ctx.arc(mx, my, rr, 0, Math.PI * 2)
          ctx.stroke()
        }
        // static ring + core
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${ac},${mAlpha * 0.9})`
        ctx.lineWidth = 1.5
        ctx.arc(mx, my, 9, 0, Math.PI * 2)
        ctx.stroke()
        ctx.beginPath()
        ctx.fillStyle = `rgba(${ac},${mAlpha})`
        ctx.arc(mx, my, 3.4, 0, Math.PI * 2)
        ctx.fill()
      }

      // overlay copy opacities — home + coords lead at the start (Ílhavo), the
      // world line arrives as you pull back out
      if (homeRef.current) homeRef.current.style.opacity = String(clamp01(1 - p / 0.42))
      if (placeRef.current) placeRef.current.style.opacity = String(clamp01(1 - p / 0.35))
      if (worldRef.current) worldRef.current.style.opacity = String(smooth(0.55, 0.85, p))
      if (hintRef.current) hintRef.current.style.opacity = String(clamp01(1 - p / 0.12))
    }
    raf = requestAnimationFrame(render)

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress
      },
      onToggle: (self) => {
        visible.current = self.isActive
      },
    })
    // also render while the section is merely on screen (before/after the pin range)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => (visible.current = en.isIntersecting || st.isActive)),
      { threshold: 0 },
    )
    io.observe(section)

    return () => {
      cancelAnimationFrame(raf)
      themeObs.disconnect()
      ro.disconnect()
      io.disconnect()
      st.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[320vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* Home headline — centred in the upper-middle, with the coordinate
            readout and pin clustered just below it. */}
        <div className="pointer-events-none absolute inset-x-0 top-[40%] -translate-y-1/2 px-6 text-center">
          <p ref={homeRef} className="display text-5xl leading-[1.02] md:text-8xl">
            {o.home} <span className="ital text-accent-text">{o.homeAccent}</span>
          </p>
        </div>

        {/* World headline — centred over the (lowered) globe; no pin at this end. */}
        <div
          ref={worldRef}
          className="pointer-events-none absolute inset-x-0 top-[58%] -translate-y-1/2 px-6 text-center"
          style={{ opacity: 0 }}
        >
          <p className="display text-5xl leading-[1.02] md:text-8xl">
            {o.world} <span className="ital text-accent-text">{o.worldAccent}</span>
          </p>
        </div>

        {/* place + coordinates readout, tucked just above the pin */}
        <div
          ref={placeRef}
          className="pointer-events-none absolute inset-x-0 top-[52%] -translate-y-1/2 flex flex-col items-center gap-1 text-center"
          style={{ opacity: 0 }}
        >
          <span className="label text-accent-text">{o.place}</span>
          <span className="font-mono text-xs tracking-wide text-muted">{o.coords}</span>
        </div>

        {/* scroll hint */}
        <div ref={hintRef} className="absolute inset-x-0 bottom-10 flex justify-center">
          <span className="label text-muted">↓ {o.hint}</span>
        </div>
      </div>
    </section>
  )
}
