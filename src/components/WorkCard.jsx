import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { easeSoft } from '../lib/motion'
import Cover from './Cover'
import Reveal from './Reveal'
import { useZoom } from '../context/Zoom'
import { track } from '../lib/analytics'

export default function WorkCard({ project, index = 0 }) {
  const { lang } = useLang()
  const coverRef = useRef(null)
  const zoomCtx = useZoom()

  const onClick = (e) => {
    track('project_open', { slug: project.slug })
    if (!zoomCtx || !coverRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    e.preventDefault()
    zoomCtx.zoom(project.slug, project.cover, project.coverImage, coverRef.current.getBoundingClientRect())
  }

  return (
    <Reveal delay={(index % 2) * 0.06}>
      <Link to={`/work/${project.slug}`} onClick={onClick} className="group block">
        <div ref={coverRef} className="relative overflow-hidden rounded-xl">
          <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.8, ease: easeSoft }}>
            <Cover colors={project.cover} image={project.coverImage} className="aspect-[4/3] w-full" />
          </motion.div>
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-bg/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="m-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-ink">
              {lang === 'pt' ? 'Ver projeto' : 'View project'} →
            </span>
          </div>
        </div>

        {/* Caption with intro line for context */}
        <div className="mt-5">
          <p className="max-w-xl text-lg leading-snug md:text-xl">
            <span className="text-text">{project.title}</span>
            <span className="text-muted"> — {project.tagline[lang]}</span>
          </p>
          <div className="mt-3 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs uppercase tracking-[0.15em] text-muted">{project.category}</span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
