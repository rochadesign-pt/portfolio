import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { services } from '../data/site'
import Reveal from './Reveal'

// Minimal line-art marks per service — abstract, on-brand, stroke = currentColor.
const serviceIcons = {
  branding: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" className="h-11 w-11">
      <circle cx="19" cy="20" r="10.5" />
      <circle cx="29" cy="20" r="10.5" />
      <circle cx="24" cy="29" r="10.5" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="h-11 w-11">
      <rect x="9" y="12" width="30" height="21" rx="1.5" />
      <path d="M9 18h30" />
      <path d="M12.5 15.2h.01M15 15.2h.01M17.5 15.2h.01" />
      <path d="M19 40h10M24 33v7" />
    </svg>
  ),
  product: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" className="h-11 w-11">
      <circle cx="14" cy="16" r="3" />
      <circle cx="34" cy="14" r="3" />
      <circle cx="23" cy="31" r="3" />
      <circle cx="35" cy="33" r="3" />
      <path d="M16.6 17.6l4 11M31.2 15.2l-5.6 13.2M25.8 30.6l6.4 2" />
    </svg>
  ),
}

// Shared service grid: numbered columns, each with an icon and the title pinned
// to the bottom. The title + description sit together at the base; on hover
// (desktop) they rise as one and the deliverables open below on a kinetic
// grid-rows reveal (0fr→1fr) with a staggered fade. On touch (mobile) the list
// is always open and the columns stack vertically.
//
// `to` makes each column a Link (homepage → /services) and shows the trailing
// arrow; omit it for a static grid (the Services page itself). `headingAs` keeps
// the heading level correct per page (h3 under a section h2, h2 under a page h1).
export default function ServiceColumns({ to, headingAs: Heading = 'h3' }) {
  const { lang } = useLang()
  const Wrap = to ? Link : 'div'

  return (
    <div className="grid border-t border-line md:grid-cols-3">
      {services.map((s, i) => (
        <Reveal
          key={s.key}
          delay={i * 0.06}
          className="border-b border-line md:border-b-0 md:border-l md:first:border-l-0"
        >
          <Wrap
            {...(to ? { to } : {})}
            className="group flex h-full flex-col py-8 md:min-h-[520px] md:px-8 md:py-10"
          >
            <span className="label text-muted transition-colors duration-500 group-hover:text-text">{s.n}</span>
            <span
              className="mt-8 block text-text/60 transition-colors duration-500 group-hover:text-text"
              aria-hidden="true"
            >
              {serviceIcons[s.key]}
            </span>

            <div className="mt-16 md:mt-auto">
              <Heading className="display text-2xl md:text-3xl">{s.title[lang]}</Heading>
              <p className="mt-3 max-w-xs text-sm text-muted">{s.desc[lang]}</p>
              <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-[650ms] [transition-timing-function:cubic-bezier(0.65,0,0.1,1)] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <ul className="pt-6">
                    {s.items[lang].map((it, idx) => (
                      <li
                        key={it}
                        className="flex items-center gap-2.5 py-1 text-sm text-text/75 transition-all duration-500 md:translate-y-1.5 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                        style={{ transitionDelay: `${120 + idx * 45}ms` }}
                      >
                        <span className="h-1 w-1 flex-none rounded-full bg-accent-text" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  {to && (
                    <span
                      className="mt-6 inline-flex text-xl text-muted transition-all duration-500 group-hover:text-text md:opacity-0 md:group-hover:translate-x-1 md:group-hover:opacity-100"
                      style={{ transitionDelay: `${120 + s.items[lang].length * 45}ms` }}
                    >
                      →
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Wrap>
        </Reveal>
      ))}
    </div>
  )
}
