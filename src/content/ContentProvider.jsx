import { createContext, useContext, useEffect, useState } from 'react'
import { projects as localProjects } from '../data/projects'
import { explorations as localExplorations } from '../data/site'
import { sanityConfigured, fetchProjects, fetchExplorations } from '../lib/sanity'

// Serves content to the app. Starts with the bundled local data (so the site
// renders instantly and never breaks), then hydrates from Sanity when it's
// configured and returns content. Any Sanity error keeps the local fallback.
const ContentContext = createContext({ projects: localProjects, explorations: localExplorations })

// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
  return useContext(ContentContext)
}

export function ContentProvider({ children }) {
  const [projects, setProjects] = useState(localProjects)
  const [explorations, setExplorations] = useState(localExplorations)

  useEffect(() => {
    if (!sanityConfigured) return
    let alive = true
    fetchProjects()
      .then((d) => {
        if (alive && d && d.length) setProjects(d)
      })
      .catch(() => {})
    fetchExplorations()
      .then((d) => {
        if (alive && d && d.length) setExplorations(d)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return <ContentContext.Provider value={{ projects, explorations }}>{children}</ContentContext.Provider>
}
