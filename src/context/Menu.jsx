import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const MenuContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  return useContext(MenuContext)
}

// Drives the Salient "Signal"-style menu: the page shell slides aside to
// reveal the menu panel. Locks Lenis + listens for Esc while open, and closes
// on navigation.
export function MenuProvider({ children }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  // Remember what had focus before the menu opened, so we can hand it back on
  // close (keyboard users don't get dumped at the top of the document).
  const restoreRef = useRef(null)

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((o) => !o), [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement
    window.__lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.__lenis?.start()
      window.removeEventListener('keydown', onKey)
      // Return focus to the trigger (or wherever it was) once the panel closes.
      const el = restoreRef.current
      if (el && typeof el.focus === 'function') el.focus()
    }
  }, [open])

  return <MenuContext.Provider value={{ open, toggle, close }}>{children}</MenuContext.Provider>
}
