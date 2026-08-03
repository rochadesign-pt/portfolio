import { useEffect, useState } from 'react'

// Sticky chapter stepper. Tracks which section is in view and highlights it,
// with a progress rail on the left. Clicking a chapter scrolls to it.
export default function ChapterNav({ chapters, label }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = chapters.findIndex((c) => c.id === e.target.id)
            if (i !== -1) setActive(i)
          }
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [chapters])

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <nav aria-label={label}>
      {label && <p className="label mb-6">{label}</p>}
      <ol className="relative">
        {/* rail */}
        <span className="absolute left-[5px] top-2 bottom-2 w-px bg-line" aria-hidden />
        {chapters.map((c, i) => {
          const isActive = i === active
          const isDone = i < active
          return (
            <li key={c.id}>
              <button
                onClick={() => go(c.id)}
                className="group flex w-full items-center gap-4 py-2.5 text-left"
              >
                <span className="relative flex h-[11px] w-[11px] flex-none items-center justify-center">
                  <span
                    className={`h-[11px] w-[11px] rounded-full border transition-all duration-300 ${
                      isActive
                        ? 'border-accent bg-accent scale-100'
                        : isDone
                          ? 'border-accent/60 bg-accent/60'
                          : 'border-line bg-bg group-hover:border-text/40'
                    }`}
                  />
                </span>
                <span
                  className={`flex items-baseline gap-2 text-sm transition-colors duration-300 ${
                    isActive ? 'text-text' : 'text-muted group-hover:text-text'
                  }`}
                >
                  <span className={`text-xs tabular-nums ${isActive ? 'text-accent-text' : 'text-muted/60'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {c.label}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
