import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import PageTransition from '../components/PageTransition'
import { useSeo } from '../lib/useSeo'

export default function NotFound() {
  const { t, lang } = useLang()
  useSeo({
    title:
      lang === 'pt'
        ? 'Página não encontrada — Rocha Design Studio'
        : 'Page not found — Rocha Design Studio',
  })
  return (
    <PageTransition>
      <section className="mx-auto flex min-h-[80vh] max-w-[1400px] flex-col items-center justify-center px-6 text-center md:px-10">
        <h1
          className="display text-[28vw] leading-none md:text-[16rem]"
          aria-label={lang === 'pt' ? 'Página não encontrada' : 'Page not found'}
        >
          404
        </h1>
        <p className="mt-4 text-lg text-muted">
          {lang === 'pt' ? 'Esta página perdeu-se algures.' : 'This page got lost somewhere.'}
        </p>
        <Link
          to="/work"
          className="mt-10 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink"
        >
          {t.project.back} →
        </Link>
      </section>
    </PageTransition>
  )
}
