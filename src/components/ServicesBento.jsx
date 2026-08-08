import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { services } from '../data/site'
import { easeSoft } from '../lib/motion'
import Cover from './Cover'
import Reveal from './Reveal'

// A duotone glow per discipline — colour reads at the top-left corner and
// falls to near-black, so text stays legible while each card gets its own hue.
const tints = {
  branding: ['#c8912e', '#0b0b0d'],
  web: ['#5b6ee0', '#0b0b0d'],
  product: ['#cf5a40', '#0b0b0d'],
}

// Placement in the asymmetric bento: the first discipline gets the tall column,
// the other two stack beside it.
const spans = ['md:row-span-2', 'md:col-span-2', 'md:col-span-2']

// Services as a bento of duotone cards (each carrying the site's dot texture via
// Cover) instead of a flat text grid — colour, asymmetry and a hover lift give
// the page visual weight while the deliverables read as chips.
export default function ServicesBento() {
  const { lang } = useLang()

  return (
    <div className="grid gap-3 md:grid-cols-3 md:auto-rows-[16rem] md:gap-4">
      {services.map((s, i) => (
        <Reveal key={s.key} delay={i * 0.06} className={spans[i]}>
          <motion.article
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5, ease: easeSoft }}
            className="group relative h-full min-h-[15rem] overflow-hidden rounded-2xl ring-1 ring-inset ring-white/10"
          >
            <div className="absolute inset-0">
              <Cover colors={tints[s.key]} className="h-full w-full" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

            <div className="relative flex h-full flex-col justify-between p-7 md:p-8">
              <span className="label text-accent-text">{s.n}</span>
              <div>
                <h3 className="display text-2xl text-white md:text-3xl">{s.title[lang]}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/65">{s.desc[lang]}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.items[lang].map((it) => (
                    <li
                      key={it}
                      className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs text-white/75 transition-colors duration-300 group-hover:border-white/30"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.article>
        </Reveal>
      ))}
    </div>
  )
}
