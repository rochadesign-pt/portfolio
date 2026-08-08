import { useLang } from '../i18n/LanguageContext'
import Reveal from './Reveal'
import MaskReveal from './MaskReveal'

// Colophon — an editorial "built with" section. It lays the site's own raw
// materials on the table (type, stack, AI in the loop) as a gesture of
// transparency and craft, and reinforces the studio's AI-native stance by
// naming the AI it actually works with. Three columns of name/role rows on
// hairlines; the name warms to the accent on hover.
export default function Colophon() {
  const { t } = useLang()
  const c = t.servicesPage.colophon

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="mb-14 max-w-2xl md:mb-20">
        <Reveal className="mb-4">
          <span className="label">{c.label}</span>
        </Reveal>
        <MaskReveal>
          <h2 className="display text-5xl md:text-7xl">
            {c.title} <span className="ital text-accent-text">{c.titleAccent}</span>
          </h2>
        </MaskReveal>
        <Reveal className="mt-6">
          <p className="text-lg text-muted">{c.sub}</p>
        </Reveal>
      </div>

      <div className="grid gap-x-16 gap-y-14 md:grid-cols-3">
        {c.groups.map((group, gi) => (
          <Reveal key={group.label} delay={gi * 0.08}>
            <h3 className="label mb-2 text-muted">{group.label}</h3>
            <ul>
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="group flex items-baseline justify-between gap-4 border-t border-line py-4"
                >
                  <span className="display text-lg transition-colors duration-300 group-hover:text-accent-text md:text-xl">
                    {item.name}
                  </span>
                  <span className="text-right text-sm text-muted">{item.role}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 border-t border-line pt-8 md:mt-20">
        <p className="max-w-xl text-muted">
          <span className="ital text-accent-text">✦</span> {c.note}
        </p>
      </Reveal>
    </section>
  )
}
