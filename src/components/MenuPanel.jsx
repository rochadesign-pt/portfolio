import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { useMenu } from '../context/Menu'
import { social, contact } from '../data/site'
import LiveClock from './LiveClock'

// The revealed panel behind the page shell (see index.css .page-shell). Fixed
// to the right edge; the shell slides left to uncover it.
export default function MenuPanel() {
  const { t, lang } = useLang()
  const { open, close } = useMenu()
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: lang === 'pt' ? 'Início' : 'Home' },
    { to: '/work', label: t.nav.work },
    { to: '/services', label: t.nav.services },
    { to: '/studio', label: t.nav.studio },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <>
      {/* Circular close button — fixed on the divider (the shell's right edge),
          above the shell so it's never clipped. left = 100% - panel width. */}
      <button
        onClick={close}
        aria-label="Fechar menu"
        tabIndex={open ? 0 : -1}
        className={`fixed left-[28%] top-1/2 z-[70] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-text text-bg shadow-lg transition-all duration-500 md:left-[64%] ${
          open ? 'scale-100 opacity-100 delay-200' : 'pointer-events-none scale-75 opacity-0'
        }`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <aside
        aria-hidden={!open}
        className="fixed right-0 top-0 z-30 flex h-[100svh] w-[72%] flex-col justify-center px-8 md:w-[36%] md:px-14"
      >
        <nav className="flex flex-col gap-1">
        {links.map((l, i) => {
          const active = pathname === l.to
          return (
            <Link
              key={l.to}
              to={l.to}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${0.24 + i * 0.05}s` : '0s' }}
              className={`group w-fit text-4xl leading-[1.35] transition-all duration-500 md:text-5xl ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              } ${active ? 'text-text' : 'text-text/70 hover:text-text'}`}
            >
              <span className={`bg-gradient-to-r from-current to-current bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px] ${active ? 'bg-[length:100%_1px]' : ''}`}>
                {l.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Secondary info, low in the panel */}
      <div
        style={{ transitionDelay: open ? '0.5s' : '0s' }}
        className={`absolute inset-x-8 bottom-10 flex flex-col gap-4 text-sm transition-all duration-500 md:inset-x-14 ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <a href={`mailto:${contact.email}`} className="link-underline w-fit text-text" tabIndex={open ? 0 : -1}>
          {contact.email}
        </a>
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-muted">
          {social.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-text" tabIndex={open ? 0 : -1}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <LiveClock className="text-muted" />
      </div>
      </aside>
    </>
  )
}
