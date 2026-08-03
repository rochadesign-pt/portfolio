import { createContext, useContext, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Cover from '../components/Cover'

const ZoomContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useZoom() {
  return useContext(ZoomContext)
}

// Click-to-zoom page transition: the clicked project cover expands from its
// position to a full-viewport takeover, we navigate mid-flight, then it fades
// to reveal the project's own (matching) hero. Falls back to plain navigation.
export function ZoomProvider({ children }) {
  const navigate = useNavigate()
  const [state, setState] = useState(null)

  const zoom = useCallback(
    (slug, colors, rect) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce || !rect) {
        navigate(`/work/${slug}`)
        return
      }
      setState({ colors, rect })
      setTimeout(() => navigate(`/work/${slug}`), 460)
      setTimeout(() => setState(null), 1000)
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
            exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
          >
            <Cover colors={state.colors} className="h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </ZoomContext.Provider>
  )
}
