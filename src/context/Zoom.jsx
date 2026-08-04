import { createContext, useContext, useCallback, useState, useRef, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Cover from '../components/Cover'

const ZoomContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useZoom() {
  return useContext(ZoomContext)
}

// Soft, iOS-like curve (see animation-stack).
const EASE = [0.32, 0.72, 0, 1]
const EXPAND = 0.7

// Seamless click-to-zoom.
//
// The clicked cover grows from its on-screen position to a full-viewport
// takeover while the project mounts underneath (entrance skipped, header text
// held back). When the overlay reaches full size it exactly matches the
// project's full-bleed header, so it fades out over the identical image — no
// visible swap; only then does the header text rise in.
//
// Reliability comes from two choices:
//  1. Framer Motion `layout` drives the growth via *transform* (compositor),
//     not top/left/width/height (which thrash layout every frame). It stays
//     smooth even while React is unmounting Home / mounting Project on the main
//     thread, and the inner `layout` node cancels the scale so the image never
//     stretches.
//  2. The handoff is state-driven — `onLayoutAnimationComplete` — not a
//     setTimeout racing the animation. It lands exactly when the growth ends.
export function ZoomProvider({ children }) {
  const navigate = useNavigate()
  const [state, setState] = useState(null) // { colors, image, rect }
  const [expanded, setExpanded] = useState(false)
  const fallback = useRef(null)

  // Paint one frame at the card's box, then flip to full — Framer Motion sees
  // the layout delta and animates transform between the two.
  useLayoutEffect(() => {
    if (!state) return
    const id = requestAnimationFrame(() => setExpanded(true))
    return () => cancelAnimationFrame(id)
  }, [state])

  const land = useCallback(() => {
    if (fallback.current) {
      clearTimeout(fallback.current)
      fallback.current = null
    }
    window.dispatchEvent(new Event('rds:zoomlanded'))
    setState(null)
    setExpanded(false)
  }, [])

  const zoom = useCallback(
    (slug, colors, image, rect) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce || !rect) {
        navigate(`/work/${slug}`)
        return
      }
      window.__zoomEntry = true
      setState({ colors, image, rect })
      // Mount the project immediately underneath the overlay; the overlay
      // covers the home→project swap for its whole growth.
      navigate(`/work/${slug}`)
      // Safety net in case the layout-complete callback never fires.
      if (fallback.current) clearTimeout(fallback.current)
      fallback.current = setTimeout(land, (EXPAND + 0.25) * 1000)
    },
    [navigate, land],
  )

  return (
    <ZoomContext.Provider value={{ zoom }}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            key="zoom"
            layout
            className="fixed z-[95] overflow-hidden"
            style={
              expanded
                ? { top: 0, left: 0, right: 0, bottom: 0, borderRadius: 0 }
                : {
                    top: state.rect.top,
                    left: state.rect.left,
                    width: state.rect.width,
                    height: state.rect.height,
                    borderRadius: 12,
                  }
            }
            transition={{
              layout: { duration: EXPAND, ease: EASE },
              opacity: { duration: 0.28, ease: 'easeInOut' },
            }}
            onLayoutAnimationComplete={() => {
              if (expanded) land()
            }}
            exit={{ opacity: 0 }}
          >
            {/* Inner `layout` node cancels the parent's scale so the image
                grows without stretching. The image lands clean — the header's
                solid text panel slides in afterwards (no scrims to match). */}
            <motion.div layout className="h-full w-full">
              <Cover colors={state.colors} image={state.image} className="h-full w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ZoomContext.Provider>
  )
}
