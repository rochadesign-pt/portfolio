import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { social, contact } from '../data/site'
import LiveClock from './LiveClock'
import Wordmark from './Wordmark'

export default function Footer() {
  const { t, lang } = useLang()

  return (
    <footer className="theme-invert relative bg-bg px-6 pt-16 pb-8 text-text md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Wordmark className="mb-5 h-10 w-auto text-text" />
            <p className="max-w-xs text-sm text-muted">{t.footer.tagline}</p>
            <p className="mt-4 text-sm text-muted">{lang === 'pt' ? contact.location : contact.locationEn}</p>
          </div>

          <div>
            <p className="label mb-4">{t.footer.nav}</p>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/work" className="hover:text-text">{t.nav.work}</Link></li>
              <li><Link to="/services" className="hover:text-text">{t.nav.services}</Link></li>
              <li><Link to="/studio" className="hover:text-text">{t.nav.studio}</Link></li>
              <li><Link to="/contact" className="hover:text-text">{t.nav.contact}</Link></li>
            </ul>
          </div>

          <div>
            <p className="label mb-4">{t.footer.contactCol}</p>
            <a href={`mailto:${contact.email}`} className="link-underline text-sm hover:text-text">
              {contact.email}
            </a>
          </div>

          <div>
            <p className="label mb-4">{t.footer.social}</p>
            <ul className="space-y-2 text-sm text-muted">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-text">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-muted md:flex-row md:items-center">
          <LiveClock className="text-text/80" />
          <div className="flex items-center gap-6">
            <span>© {new Date().getFullYear()} Rocha Design Studio</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="link-underline hover:text-text"
            >
              {t.footer.back} ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
