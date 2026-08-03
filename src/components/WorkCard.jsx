import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { easeSoft } from '../lib/motion'
import Cover from './Cover'
import Reveal from './Reveal'

export default function WorkCard({ project, index = 0 }) {
  const { lang } = useLang()

  return (
    <Reveal delay={(index % 2) * 0.06}>
      <Link to={`/work/${project.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-xl">
          <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.8, ease: easeSoft }}>
            <Cover colors={project.cover} className="aspect-[4/3] w-full" />
          </motion.div>
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-bg/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="m-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-ink">
              {lang === 'pt' ? 'Ver projeto' : 'View project'} →
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="display text-2xl leading-none md:text-3xl">{project.title}</h3>
            <p className="mt-1 text-sm text-muted">{project.category}</p>
          </div>
          <span className="text-sm text-muted">{project.year}</span>
        </div>
      </Link>
    </Reveal>
  )
}
