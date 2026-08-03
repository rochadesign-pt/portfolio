import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import { useMenu } from '../context/Menu'
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
  const { open, toggle } = useMenu()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled && !open
          ? 'border-b border-line bg-bg/95 md:bg-bg/75 md:backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="group flex items-center gap-2 text-sm font-medium tracking-tight">
          <span className="inline-block h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-125" />
          Rocha Design Studio
        </Link>

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

          {/* Menu toggle — opens the push-aside panel */}
          <button
            onClick={toggle}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            className="group flex items-center gap-2.5 rounded-full border border-line px-3.5 py-2 text-sm text-text transition-colors hover:border-text/40"
          >
            <span className="hidden sm:inline">Menu</span>
            <span className="relative flex h-3 w-4 flex-col justify-between">
              <span className={`h-px w-full origin-center bg-text transition-all duration-300 ${open ? 'translate-y-[5.5px] rotate-45' : ''}`} />
              <span className={`h-px w-full bg-text transition-all duration-300 ${open ? 'scale-x-0 opacity-0' : ''}`} />
              <span className={`h-px w-full origin-center bg-text transition-all duration-300 ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>
    </header>
  )
}
