import { useEffect } from 'react'

// True only when the site is embedded in the Studio's Presentation iframe.
// Computed locally (no Sanity import) so the client stays out of the main bundle.
const inPresentationFrame = typeof window !== 'undefined' && window.self !== window.top

// Sanity click-to-edit overlays. Renders nothing and loads nothing for normal
// visitors — the library is dynamically imported and the overlays are enabled
// ONLY inside the Presentation iframe.
export default function VisualEditing() {
  useEffect(() => {
    if (!inPresentationFrame) return
    let disable
    let cancelled = false
    import('@sanity/visual-editing')
      .then(({ enableVisualEditing }) => {
        if (!cancelled) disable = enableVisualEditing()
      })
      .catch(() => {})
    return () => {
      cancelled = true
      if (disable) disable()
    }
  }, [])
  return null
}
