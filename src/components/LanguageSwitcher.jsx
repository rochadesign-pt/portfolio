import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'

// Small inline SVG flags — render consistently across platforms (unlike emoji flags).
function FlagPT() {
  return (
    <svg viewBox="0 0 20 14" className="h-full w-full">
      <rect width="20" height="14" fill="#c8102e" />
      <rect width="8" height="14" fill="#046a38" />
      <circle cx="8" cy="7" r="2.5" fill="#ffe000" stroke="#fff" strokeWidth="0.6" />
      <circle cx="8" cy="7" r="1.1" fill="#c8102e" />
    </svg>
  )
}

function FlagEN() {
  return (
    <svg viewBox="0 0 20 14" className="h-full w-full">
      <rect width="20" height="14" fill="#012169" />
      <path d="M0,0 20,14 M20,0 0,14" stroke="#fff" strokeWidth="2.6" />
      <path d="M0,0 20,14 M20,0 0,14" stroke="#c8102e" strokeWidth="1.2" />
      <rect x="8" width="4" height="14" fill="#fff" />
      <rect y="5" width="20" height="4" fill="#fff" />
      <rect x="8.75" width="2.5" height="14" fill="#c8102e" />
      <rect y="5.75" width="20" height="2.5" fill="#c8102e" />
    </svg>
  )
}

const options = [
  { code: 'pt', label: 'Português', Flag: FlagPT },
  { code: 'en', label: 'English', Flag: FlagEN },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const current = options.find((o) => o.code === lang) || options[0]
  const Current = current.Flag

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-medium transition-colors hover:border-text/40"
        aria-label="Select language"
        aria-expanded={open}
      >
        <span className="h-3 w-[18px] overflow-hidden rounded-[2px] ring-1 ring-line">
          <Current />
        </span>
        <span className="uppercase tracking-wide">{lang}</span>
        <motion.svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted"
        >
          <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-xl border border-line bg-surface p-1 shadow-2xl"
          >
            {options.map((o) => {
              const active = o.code === lang
              return (
                <li key={o.code}>
                  <button
                    onClick={() => {
                      setLang(o.code)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active ? 'bg-surface-2 text-text' : 'text-muted hover:bg-surface-2 hover:text-text'
                    }`}
                  >
                    <span className="h-3.5 w-[22px] overflow-hidden rounded-[3px] ring-1 ring-line">
                      <o.Flag />
                    </span>
                    <span>{o.label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
