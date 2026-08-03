import { createContext, useContext, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Cover from '../components/Cover'

const ZoomContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useZoom() {
  return useContext(ZoomContext)
}

// Seamless click-to-zoom: the clicked cover grows from its position to a full
// viewport takeover while the project mounts underneath (with its entrance
// skipped and its header text held back). When the overlay reaches full size it
// exactly matches the project's full-bleed header, so it's removed without a
// visible swap; only then does the header text rise in. Signals via
// window.__zoomEntry + a 'rds:zoomlanded' event. Plain nav for reduced-motion.
export function ZoomProvider({ children }) {
  const navigate = useNavigate()
  const [state, setState] = useState(null)

  const land = useCallback(() => {
    window.dispatchEvent(new Event('rds:zoomlanded'))
    setState(null)
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
      // Mount the project under the (near-full) overlay late in the expand, so
      // the home→project swap happens hidden behind it.
      setTimeout(() => navigate(`/work/${slug}`), 640)
    },
    [navigate],
  )

  return (
    <ZoomContext.Provider value={{ zoom }}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div
            className="fixed z-[95] overflow-hidden"
            initial={{
              top: state.rect.top,
              left: state.rect.left,
              width: state.rect.width,
              height: state.rect.height,
              borderRadius: 12,
            }}
            animate={{ top: 0, left: 0, width: '100vw', height: '100vh', borderRadius: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: 'easeInOut' } }}
            transition={{ duration: 0.8, ease: [0.6, 0, 0.2, 1] }}
            onAnimationComplete={(def) => {
              // Fire only when the expand (not the exit) finishes.
              if (def && typeof def === 'object' && def.width) land()
            }}
          >
            <Cover colors={state.colors} image={state.image} className="h-full w-full" />
            {/* Match the header scrims so brightness is identical at the swap */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/10" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/70 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </ZoomContext.Provider>
  )
}
