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
  const [sel, setSel] = useState({ budget: '', found: '' })
  const [help, setHelp] = useState([])
  const [token, setToken] = useState('')

  const toggleHelp = (opt) =>
    setHelp((h) => (h.includes(opt) ? h.filter((x) => x !== opt) : [...h, opt]))
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
    track('contact_submit', { help: help.join(', ') })
    setStatus('sending')

    const payload = {
      access_key: WEB3FORMS_KEY,
      subject: `Novo contacto — ${data.get('name') || 'website'}`,
      from_name: 'rochadesign.pt',
      Nome: data.get('name'),
      Email: data.get('email'),
      Representa: data.get('company') || '—',
      Serviços: help.length ? help.join(', ') : '—',
      Orçamento: sel.budget || '—',
      'Como nos encontrou': sel.found || '—',
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
  const qlabel = 'mb-3 block text-base text-text/90'

  // Inline render helpers (not nested components) so fields don't remount on
  // every state change.
  const renderSelect = (name, placeholder, options) => (
    <div className="relative">
      <select
        name={name}
        value={sel[name]}
        onChange={(e) => setSel((s) => ({ ...s, [name]: e.target.value }))}
        className={`${field} cursor-pointer appearance-none pr-8 ${sel[name] ? 'text-text' : 'text-muted'}`}
      >
        <option value="">{placeholder}</option>
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
    </div>
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
              <form onSubmit={onSubmit} className="max-w-2xl space-y-9">
                <div>
                  <label className={qlabel} htmlFor="name">{c.qName}</label>
                  <input id="name" name="name" className={field} placeholder={c.phName} required autoComplete="name" />
                </div>
                <div>
                  <label className={qlabel} htmlFor="email">{c.qEmail}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={field}
                    placeholder={c.phEmail}
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className={qlabel} htmlFor="company">{c.qCompany}</label>
                  <input
                    id="company"
                    name="company"
                    className={field}
                    placeholder={c.phCompany}
                    autoComplete="organization"
                  />
                </div>

                {/* What can we help you with — multi-select */}
                <fieldset>
                  <legend className={qlabel}>{c.qHelp}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {c.helpOptions.map((opt) => {
                      const on = help.includes(opt)
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleHelp(opt)}
                          aria-pressed={on}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                            on ? 'border-accent bg-accent/10 text-text' : 'border-line text-muted hover:border-text hover:text-text'
                          }`}
                        >
                          <span
                            className={`grid h-4 w-4 flex-none place-items-center rounded-[5px] border ${
                              on ? 'border-accent bg-accent text-accent-ink' : 'border-line'
                            }`}
                          >
                            {on && (
                              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <div>
                  <label className={qlabel}>{c.qBudget}</label>
                  {renderSelect('budget', c.budgetPlaceholder, c.budgetOptions)}
                </div>

                <div>
                  <label className={qlabel} htmlFor="message">{c.qMessage}</label>
                  <textarea
                    id="message"
                    name="message"
                    className={`${field} resize-none`}
                    rows={4}
                    placeholder={c.phMessage}
                    required
                  />
                </div>

                <div>
                  <label className={qlabel}>{c.qFound}</label>
                  {renderSelect('found', c.foundPlaceholder, c.foundOptions)}
                </div>

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
