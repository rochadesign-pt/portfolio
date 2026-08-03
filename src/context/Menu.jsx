import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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

  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((o) => !o), [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.__lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return <MenuContext.Provider value={{ open, toggle, close }}>{children}</MenuContext.Provider>
}
