import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// A quiet wayfinding layer:
//  · a hairline progress bar pinned to the top edge, tracking read depth
//  · a right-side dot rail (desktop) that maps the page's <section>s and lets
//    you jump between them; the active section lights up as you scroll.
// It stays out of the way — no labels until hover, hidden when a page has
// fewer than two sections (nothing to navigate).
export default function Wayfinding() {
  const location = useLocation()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  const [sections, setSections] = useState([])
  const [active, setActive] = useState(0)

  // Re-scan the DOM for top-level sections whenever the route changes. The page
  // transition swaps <main>, so we wait a beat for the incoming page to mount.
  useEffect(() => {
    let observer
    const scan = () => {
      const nodes = Array.from(document.querySelectorAll('main > section'))
      setSections(nodes)
      setActive(0)
      if (nodes.length < 2) return
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const i = nodes.indexOf(entry.target)
              if (i !== -1) setActive(i)
            }
          })
        },
        { rootMargin: '-45% 0px -45% 0px' },
      )
      nodes.forEach((n) => observer.observe(n))
    }
    const id = setTimeout(scan, 400)
    return () => {
      clearTimeout(id)
      if (observer) observer.disconnect()
    }
  }, [location.pathname])

  const goto = (node) => {
    const lenis = window.__lenis
    if (lenis) lenis.scrollTo(node, { offset: -80 })
    else node.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent-text"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {sections.length >= 2 && (
        <nav
          aria-label="Secções da página"
          className="fixed right-6 top-1/2 z-[60] hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
        >
          {sections.map((node, i) => (
            <button
              key={i}
              onClick={() => goto(node)}
              aria-label={`Ir para a secção ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              className="group flex items-center gap-2"
            >
              <span
                className={`h-[6px] rounded-full transition-all duration-300 ${
                  i === active ? 'w-5 bg-accent-text' : 'w-[6px] bg-line group-hover:bg-muted'
                }`}
              />
            </button>
          ))}
        </nav>
      )}
    </>
  )
}
