import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Cover from './Cover'

gsap.registerPlugin(useGSAP)

// Continuous horizontal strip of work covers — a visual header showcase.
export default function WorkStrip({ projects, speed = 60 }) {
  const track = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return
      const half = track.current.scrollWidth / 2
      gsap.to(track.current, { x: -half, duration: half / speed, ease: 'none', repeat: -1 })
    },
    { scope: track },
  )

  const items = [...projects, ...projects]

  return (
    <div className="overflow-hidden">
      <div ref={track} className="flex w-max gap-4 will-change-transform">
        {items.map((p, i) => (
          <Link
            key={`${p.slug}-${i}`}
            to={`/work/${p.slug}`}
            className="group relative block w-[280px] flex-none md:w-[360px]"
          >
            <Cover colors={p.cover} image={p.coverImage} className="aspect-[4/3] w-full rounded-xl" />
            <div className="mt-3 flex items-center justify-between">
              <span className="display text-xl">{p.title}</span>
              <span className="text-xs text-muted">{p.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
