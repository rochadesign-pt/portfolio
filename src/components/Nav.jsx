import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import Magnetic from './Magnetic'

export default function Nav() {
  const { t, lang, toggle } = useLang()
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
          scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-line' : 'bg-transparent'
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
            <button
              onClick={toggle}
              className="flex items-center gap-1 text-xs font-medium tracking-wide"
              aria-label="Toggle language"
            >
              <span className={lang === 'pt' ? 'text-text' : 'text-muted'}>PT</span>
              <span className="text-muted">/</span>
              <span className={lang === 'en' ? 'text-text' : 'text-muted'}>EN</span>
            </button>

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
