import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { easeSoft } from '../lib/motion'
import Cover from './Cover'
import Reveal from './Reveal'
import { useZoom } from '../context/Zoom'
import { track } from '../lib/analytics'

export default function WorkCard({ project, index = 0, titleAs = 'h3', eager = false }) {
  const { lang } = useLang()
  const coverRef = useRef(null)
  const zoomCtx = useZoom()
  const isCaseStudy = project.isCaseStudy !== false
  const Title = titleAs

  const onClick = (e) => {
    track('project_open', { slug: project.slug })
    if (!zoomCtx || !coverRef.current) return
    // The zoom is tied to the user's own tap and is core to the experience, so
    // it plays regardless of the reduced-motion setting (like the CTA reveal).
    e.preventDefault()
    zoomCtx.zoom(project.slug, project.cover, project.coverImage, coverRef.current.getBoundingClientRect())
  }

  return (
    <Reveal delay={(index % 2) * 0.06}>
      <Link to={`/work/${project.slug}`} onClick={onClick} className="group block">
        <div ref={coverRef} className="relative overflow-hidden rounded-xl">
          <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.8, ease: easeSoft }}>
            <Cover colors={project.cover} image={project.coverImage} className="aspect-[4/3] w-full" eager={eager} />
          </motion.div>

          {/* Hover tags — category + case-study marker */}
          <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
            <span className="inline-flex -translate-y-1 items-center gap-2 rounded-md bg-white px-2.5 py-1 text-xs font-medium text-[#0b0b0d] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: project.cover[0] }} />
              {project.category}
            </span>
            <span
              className={`inline-flex -translate-y-1 items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium opacity-0 transition-all delay-[60ms] duration-500 group-hover:translate-y-0 group-hover:opacity-100 ${
                isCaseStudy ? 'bg-accent text-accent-ink' : 'bg-white/90 text-[#0b0b0d]'
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-[3px]"
                style={{ background: isCaseStudy ? '#0b0b0d' : '#8f8b83' }}
              />
              {isCaseStudy ? 'Case study' : lang === 'pt' ? 'Projeto' : 'Project'}
            </span>
          </div>

          {/* CTA */}
          <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-bg/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="m-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-ink">
              {lang === 'pt' ? 'Ver projeto' : 'View project'} →
            </span>
          </div>
        </div>

        {/* Caption — Title / short description, with opacity differentiation.
            The project name is the heading; the tagline sits inline beside it. */}
        <div className="mt-5">
          <div className="max-w-xl text-lg leading-snug tracking-[-0.02em] md:text-xl">
            <Title className="inline font-normal text-text">{project.title}</Title>
            <span className="text-muted"> / {project.tagline[lang]}</span>
          </div>
          <div className="mt-3 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs uppercase tracking-[0.15em] text-muted">{project.category}</span>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
