import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../i18n/LanguageContext'
import { useZoom } from '../context/Zoom'
import { track } from '../lib/analytics'
import Cover from './Cover'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// A horizontal showreel of featured work. On desktop the section holds (tall
// wrapper + sticky inner — the same Lenis-friendly, no-pin pattern used across
// the site, so the zoom overlay and page transitions stay intact) and the track
// slides sideways as you scroll, with the covers drifting on a gentle parallax.
// On mobile it's a native swipeable, snap-scrolling rail — no scrub (GPU-cheap).
// Cards keep the click-to-zoom.
export default function WorkShowreel({ projects }) {
  const { lang } = useLang()
  const zoomCtx = useZoom()
  const wrapRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(
    () => {
      const desktop = window.matchMedia('(min-width: 768px)').matches
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!desktop) return

      const track = trackRef.current
      const covers = gsap.utils.toArray('.reel-cover', track)
      const vw = window.innerWidth

      const measure = () => Math.max(0, track.scrollWidth - vw)
      let total = measure()
      // Height of the pinned scroll = the horizontal overflow, so 1px of vertical
      // scroll ≈ 1px of sideways travel.
      wrapRef.current.style.height = `${window.innerHeight + total}px`

      const st = ScrollTrigger.create({
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          total = measure()
          wrapRef.current.style.height = `${window.innerHeight + total}px`
        },
        onUpdate: (self) => {
          const x = -self.progress * total
          track.style.transform = `translate3d(${x}px,0,0)`
          if (reduce) return
          for (const cover of covers) {
            const r = cover.parentElement.getBoundingClientRect()
            const rel = Math.max(-0.5, Math.min(0.5, (r.left + r.width / 2 - vw / 2) / vw))
            cover.style.transform = `translate3d(${-rel * 56}px,0,0) scale(1.2)`
          }
        },
      })
      return () => st.kill()
    },
    { scope: wrapRef },
  )

  const openZoom = (e, p) => {
    track('project_open', { slug: p.slug })
    if (!zoomCtx) return
    e.preventDefault()
    zoomCtx.zoom(p.slug, p.cover, p.coverImage, e.currentTarget.getBoundingClientRect())
  }

  const total = projects.length

  return (
    <section ref={wrapRef} className="relative">
      <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
        <div className="flex md:h-screen md:items-center">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-6 pr-6 [scrollbar-width:none] md:snap-none md:gap-6 md:overflow-visible md:pb-0 md:pl-10 md:pr-10 md:[will-change:transform] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((p, i) => (
              <Link
                key={p.slug}
                to={`/work/${p.slug}`}
                onClick={(e) => openZoom(e, p)}
                data-cursor={lang === 'en' ? 'View' : 'Ver'}
                className="group relative h-[58vh] w-[80vw] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[62vw] md:h-[70vh] md:w-[46vw] lg:w-[38vw]"
              >
                <div className="reel-cover absolute inset-0 scale-[1.2] [will-change:transform]">
                  <Cover colors={p.cover} image={p.coverImage} className="h-full w-full" objectPosition="center 22%" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
                <div className="pointer-events-none relative flex h-full flex-col justify-between p-7 md:p-9">
                  <span className="label text-white/70">
                    {String(i + 1).padStart(2, '0')} <span className="text-white/40">/ {String(total).padStart(2, '0')}</span>
                  </span>
                  <div>
                    <span className="label text-white/60">{p.category}</span>
                    <h3 className="display mt-1 text-3xl text-white md:text-4xl">{p.title}</h3>
                    {p.tagline && <p className="mt-2 max-w-sm text-sm text-white/70">{p.tagline[lang] || p.tagline}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
