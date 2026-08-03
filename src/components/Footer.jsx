import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { social, contact } from '../data/site'
import Reveal from './Reveal'

export default function Footer() {
  const { t, lang } = useLang()

  return (
    <footer className="relative mt-32 border-t border-line px-6 pt-20 pb-8 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="label mb-4">{t.cta.label}</p>
          <Link to="/contact" className="display block text-6xl leading-[0.9] tracking-tight md:text-8xl">
            {t.cta.line} <span className="italic hl">{t.cta.lineAccent}</span>
          </Link>
        </Reveal>

        <div className="mt-20 grid gap-10 border-t border-line pt-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="mb-3 text-sm font-medium">Rocha Design Studio</p>
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

        <div className="mt-16 flex flex-col items-start justify-between gap-2 text-xs text-muted md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Rocha Design Studio. {t.footer.rights}</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="link-underline hover:text-text"
          >
            {t.footer.back} ↑
          </button>
        </div>
      </div>
    </footer>
  )
}
