import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { dict } from './dict'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const reduce = useReducedMotion()
  const timer = useRef(null)
  const [lang, setLangRaw] = useState(() => {
    if (typeof window === 'undefined') return 'pt'
    return window.localStorage.getItem('rds-lang') || 'pt'
  })
  // `switching` drives a brief crossfade: the copy dims, swaps language at the
  // low point, then rises back — so PT↔EN reads as a deliberate morph rather
  // than a jarring instant relabel.
  const [switching, setSwitching] = useState(false)

  useEffect(() => {
    window.localStorage.setItem('rds-lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => () => clearTimeout(timer.current), [])

  const applyLang = (next) => {
    if (next === lang) return
    if (reduce) {
      setLangRaw(next)
      return
    }
    setSwitching(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setLangRaw(next)
      // clear on the next frame so the incoming copy fades in from the low point
      requestAnimationFrame(() => setSwitching(false))
    }, 190)
  }

  const setLang = (next) => applyLang(next)
  const toggle = () => applyLang(lang === 'pt' ? 'en' : 'pt')

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, switching, t: dict[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
