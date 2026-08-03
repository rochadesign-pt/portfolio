import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import Magnetic from './Magnetic'
import LanguageSwitcher from './LanguageSwitcher'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-text transition-colors hover:border-text/40"
    >
      {theme === 'dark' ? (
        // sun
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      ) : (
        // moon
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

export default function Nav() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { to: '/work', label: t.nav.work },
    { to: '/services', label: t.nav.services },
    { to: '/studio', label: t.nav.studio },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled
            ? 'border-b border-line bg-bg/95 md:bg-bg/75 md:backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <Link to="/" className="group flex items-center gap-2 text-sm font-medium tracking-tight">
            <span className="inline-block h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-125" />
            Rocha Design Studio
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="link-underline text-sm text-text/80 hover:text-text">
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />

            <Magnetic className="hidden md:inline-block">
              <Link
                to="/contact"
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
              >
                {t.nav.cta}
              </Link>
            </Magnetic>

            <button
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center md:hidden"
              aria-label="Menu"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`h-px w-6 bg-text transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
                <span className={`h-px w-6 bg-text transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-bg px-6 md:hidden"
          >
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06 }}
              >
                <Link to={l.to} className="display block py-2 text-5xl">
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
