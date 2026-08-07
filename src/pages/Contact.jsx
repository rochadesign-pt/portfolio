import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { contact, social } from '../data/site'
import Reveal from '../components/Reveal'
import MaskReveal from '../components/MaskReveal'
import Magnetic from '../components/Magnetic'
import PageTransition from '../components/PageTransition'
import { track } from '../lib/analytics'
import { useSeo } from '../lib/useSeo'

// Keys come from env (set in Vercel). Web3Forms relays the submission to the
// studio inbox; Cloudflare Turnstile provides the captcha.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const TURNSTILE_SITEKEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

export default function Contact() {
  const { t } = useLang()
  const c = t.contactPage
  useSeo(t.seo.contact)

  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [sel, setSel] = useState({ type: '', budget: '', timeline: '' })
  const [token, setToken] = useState('')
  const captchaRef = useRef(null)
  const widgetId = useRef(null)

  // Cloudflare Turnstile — load once, render explicitly, keep the token in state.
  useEffect(() => {
    if (!TURNSTILE_SITEKEY) return
    const render = () => {
      if (!window.turnstile || !captchaRef.current || widgetId.current !== null) return
      widgetId.current = window.turnstile.render(captchaRef.current, {
        sitekey: TURNSTILE_SITEKEY,
        theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
        callback: (tok) => setToken(tok),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      })
    }
    if (window.turnstile) return void render()
    let script = document.querySelector('script[data-turnstile]')
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.turnstile = '1'
      document.head.appendChild(script)
    }
    script.addEventListener('load', render)
    return () => {
      script && script.removeEventListener('load', render)
      try {
        if (widgetId.current !== null && window.turnstile) window.turnstile.remove(widgetId.current)
      } catch {
        /* widget already gone */
      }
      widgetId.current = null
    }
  }, [])

  const captchaReady = !TURNSTILE_SITEKEY || !!token

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('botcheck')) return // honeypot — silently drop bots
    if (!WEB3FORMS_KEY || !captchaReady) {
      setStatus('error')
      return
    }
    track('contact_submit', { type: sel.type })
    setStatus('sending')

    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `Novo contacto — ${data.get('name') || 'website'}`,
      from_name: 'rochadesign.pt',
      Nome: data.get('name'),
      Email: data.get('email'),
      Empresa: data.get('company') || '—',
      'Tipo de projeto': sel.type || '—',
      Orçamento: sel.budget || '—',
      Prazo: sel.timeline || '—',
      Mensagem: data.get('message'),
      ...(token ? { 'cf-turnstile-response': token } : {}),
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      setStatus(json.success ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
    if (widgetId.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(widgetId.current)
        setToken('')
      } catch {
        /* noop */
      }
    }
  }

  const field =
    'w-full border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-muted focus:border-accent'

  // Inline render helper (not a nested component) so the selects don't remount
  // on every keystroke/state change.
  const renderSelect = (name, label, options) => (
    <label className="relative block">
      <span className="label mb-2 block text-muted">{label}</span>
      <select
        name={name}
        value={sel[name]}
        onChange={(e) => setSel((s) => ({ ...s, [name]: e.target.value }))}
        className={`${field} cursor-pointer appearance-none pr-8 ${sel[name] ? 'text-text' : 'text-muted'}`}
      >
        <option value="">{c.selectPlaceholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-surface text-text">
            {o}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute bottom-4 right-1 h-4 w-4 text-muted"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  )

  return (
    <PageTransition>
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-16 md:px-10 md:pt-52">
        <Reveal className="mb-4">
          <span className="label">{c.eyebrow}</span>
        </Reveal>
        <MaskReveal>
          <h1 className="display text-6xl leading-[0.95] md:text-8xl">
            {c.title} <span className="ital text-accent-text">{c.titleAccent}</span>
          </h1>
        </MaskReveal>
        <Reveal className="mt-6 max-w-xl">
          <p className="text-lg text-muted">{c.sub}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-16 md:px-10">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            {status === 'success' ? (
              <div className="flex min-h-72 items-center">
                <p className="display text-4xl md:text-5xl">
                  {c.sentTitle} <span className="ital text-accent-text">✓</span>
                  <span className="mt-4 block text-lg text-muted">{c.response}</span>
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <input name="name" className={field} placeholder={c.formName} required autoComplete="name" />
                  <input
                    name="email"
                    type="email"
                    className={field}
                    placeholder={c.formEmail}
                    required
                    autoComplete="email"
                  />
                </div>
                <input name="company" className={field} placeholder={c.formCompany} autoComplete="organization" />

                <div className="grid gap-8 md:grid-cols-2">
                  {renderSelect('type', c.formType, c.typeOptions)}
                  {renderSelect('budget', c.formBudget, c.budgetOptions)}
                </div>
                <div className="md:max-w-[calc(50%-1rem)]">
                  {renderSelect('timeline', c.formTimeline, c.timelineOptions)}
                </div>

                <textarea
                  name="message"
                  className={`${field} resize-none`}
                  rows={4}
                  placeholder={c.formMessage}
                  required
                />

                {/* Honeypot — hidden from humans, tempting to bots */}
                <input
                  type="checkbox"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {TURNSTILE_SITEKEY && <div ref={captchaRef} className="min-h-[65px]" />}

                {status === 'error' && (
                  <p className="text-sm text-accent-text">
                    {c.error}{' '}
                    <a href={`mailto:${contact.email}`} className="link-underline">
                      {contact.email}
                    </a>
                    .
                  </p>
                )}

                <Magnetic className="inline-block">
                  <button
                    type="submit"
                    disabled={status === 'sending' || !captchaReady}
                    className="rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'sending' ? c.sending : `${c.formSubmit} →`}
                  </button>
                </Magnetic>
              </form>
            )}
          </Reveal>

          <Reveal className="space-y-6">
            {/* Brand contact card — yellow */}
            <div className="rounded-2xl bg-accent p-8 text-accent-ink">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent-ink/60">{c.or}</p>
              <a href={`mailto:${contact.email}`} className="block text-xl font-medium md:text-2xl">
                {contact.email}
              </a>
              <p className="mt-6 text-sm text-accent-ink/70">{c.response}</p>
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
