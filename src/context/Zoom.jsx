import { createContext, useContext, useCallback, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Cover from '../components/Cover'

gsap.registerPlugin(useGSAP)

const ZoomContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useZoom() {
  return useContext(ZoomContext)
}

// Kinetic growth: eases in slowly, then accelerates — reads as being pulled
// into the page rather than a page swap.
const GROW = 0.85
const EASE = 'power3.inOut'

// Seamless click-to-zoom.
//
// The clicked cover grows from its on-screen box to a full-viewport takeover
// while the project mounts underneath (entrance skipped, header text held back).
// At full size it matches the project's full-bleed header, so it fades over the
// identical image — no visible swap; only then does the header text rise in.
//
// The overlay is a SINGLE box whose image is `object-cover`, animated by GSAP
// (position/size/radius). Because the image *is* the box, frame and image can
// never desync as the aspect ratio morphs from card (4:3) to hero (portrait) —
// object-cover simply re-crops smoothly the whole way. GSAP gives full control
// of the kinetic curve.
export function ZoomProvider({ children }) {
  const navigate = useNavigate()
  const [state, setState] = useState(null) // { colors, image, rect }
  const overlayRef = useRef(null)
  const landedRef = useRef(false)

  useGSAP(
    () => {
      if (!state) return
      const el = overlayRef.current
      if (!el) return
      const { rect } = state
      landedRef.current = false

      const announce = () => {
        if (landedRef.current) return
        landedRef.current = true
        // Header text starts rising while the overlay fades over the identical
        // image, so image → text reads as one continuous move.
        window.dispatchEvent(new Event('rds:zoomlanded'))
      }

      gsap.set(el, {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: 12,
        opacity: 1,
      })

      const tl = gsap.timeline()
      tl.to(el, {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        duration: GROW,
        ease: EASE,
        onComplete: () => {
          announce()
          // No cross-fade: the hero underneath is a pixel-identical image, so
          // dropping the overlay in a single frame shows nothing — and it avoids
          // any compositing shimmer from fading two layers. Wait two frames so
          // the hero has painted underneath before the overlay is removed.
          requestAnimationFrame(() => requestAnimationFrame(() => setState(null)))
        },
      })
    },
    { dependencies: [state], scope: overlayRef },
  )

  const zoom = useCallback(
    (slug, colors, image, rect) => {
      // No reduced-motion skip: the zoom is a tap-driven, core interaction and
      // plays for everyone (consistent with the CTA). Only bail if we somehow
      // have no source rect to grow from.
      if (!rect) {
        navigate(`/work/${slug}`)
        return
      }
      window.__zoomEntry = true
      setState({ colors, image, rect })
      // Mount the project immediately underneath the overlay; the overlay covers
      // the home → project swap for its whole growth.
      navigate(`/work/${slug}`)
    },
    [navigate],
  )

  return (
    <ZoomContext.Provider value={{ zoom }}>
      {children}
      {state && (
        <div
          ref={overlayRef}
          className="fixed z-[95] overflow-hidden"
          style={{
            top: state.rect.top,
            left: state.rect.left,
            width: state.rect.width,
            height: state.rect.height,
            borderRadius: 12,
          }}
        >
          <Cover colors={state.colors} image={state.image} className="h-full w-full" objectPosition="center 22%" />
          {/* Match the header scrim so brightness is identical at the fade-out */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/10" />
        </div>
      )}
    </ZoomContext.Provider>
  )
}
