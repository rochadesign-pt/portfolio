import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { contact, social } from '../data/site'
import Reveal from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import PageTransition from '../components/PageTransition'

export default function Contact() {
  const { t } = useLang()
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    // Placeholder — wire to a form backend (Formspree / Framer form) later.
    setSent(true)
  }

  const field =
    'w-full border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted focus:border-accent'

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52">
        <Reveal className="mb-4">
          <span className="label">{t.contactPage.eyebrow}</span>
        </Reveal>
        <Reveal>
          <h1 className="display text-6xl leading-[0.95] md:text-8xl">
            {t.contactPage.title} <span className="italic text-accent">{t.contactPage.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted">{t.contactPage.sub}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            {sent ? (
              <div className="flex min-h-72 items-center">
                <p className="display text-4xl md:text-5xl">
                  {t.contactPage.title} <span className="italic text-accent">✓</span>
                  <span className="mt-4 block text-lg text-muted">{t.contactPage.response}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <input className={field} placeholder={t.contactPage.formName} required />
                  <input className={field} type="email" placeholder={t.contactPage.formEmail} required />
                </div>
                <input className={field} placeholder={t.contactPage.formType} />
                <textarea className={`${field} resize-none`} rows={4} placeholder={t.contactPage.formMessage} required />
                <Magnetic className="inline-block">
                  <button
                    type="submit"
                    className="rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
                  >
                    {t.contactPage.formSubmit} →
                  </button>
                </Magnetic>
              </form>
            )}
          </Reveal>

          <Reveal className="space-y-6">
            {/* Brand contact card — yellow */}
            <div className="rounded-2xl bg-accent p-8 text-accent-ink">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent-ink/60">{t.contactPage.or}</p>
              <a href={`mailto:${contact.email}`} className="block text-xl font-medium md:text-2xl">
                {contact.email}
              </a>
              <p className="mt-6 text-sm text-accent-ink/70">{t.contactPage.response}</p>
            </div>
            <div className="rounded-2xl border border-line p-8">
              <p className="label mb-4">Social</p>
              <ul className="space-y-2">
                {social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="link-underline text-muted hover:text-text">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}
