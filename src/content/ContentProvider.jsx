import { createContext, useContext, useEffect, useState, lazy, Suspense } from 'react'
import { projects as localProjects } from '../data/projects'
import { explorations as localExplorations, clients as localClientNames } from '../data/site'

// Fallback client list (names only) until logos are added in the Studio.
const localClients = localClientNames.map((name) => ({ name, logo: null, url: null }))

// Live draft preview — lazy, and only mounted inside the Studio's Presentation
// iframe, so react-loader never reaches the bundle normal visitors download.
const LiveContent = lazy(() => import('./LiveContent'))
const inPresentationFrame = typeof window !== 'undefined' && window.self !== window.top

// Serves content to the app. Starts with the bundled local data (so the site
// renders instantly and never breaks), then hydrates from Sanity: published
// content normally, or live drafts when editing inside Presentation.
const ContentContext = createContext({
  projects: localProjects,
  explorations: localExplorations,
  clients: localClients,
})

// eslint-disable-next-line react-refresh/only-export-components
export function useContent() {
  return useContext(ContentContext)
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState({
    projects: localProjects,
    explorations: localExplorations,
    clients: localClients,
  })

  useEffect(() => {
    // Inside Presentation, LiveContent drives the content (live drafts). Anywhere
    // else, fetch published content once — Sanity is imported lazily so its
    // libraries stay off the initial critical path.
    if (inPresentationFrame) return
    let alive = true
    import('../lib/sanity')
      .then(({ sanityConfigured, fetchProjects, fetchExplorations, fetchClients }) => {
        if (!sanityConfigured || !alive) return
        fetchProjects()
          .then((d) => {
            if (alive && d && d.length) setContent((c) => ({ ...c, projects: d }))
          })
          .catch((e) => console.error('[sanity] projects fetch FAILED:', e?.message || e))
        fetchExplorations()
          .then((d) => {
            if (alive && d && d.length) setContent((c) => ({ ...c, explorations: d }))
          })
          .catch((e) => console.error('[sanity] explorations fetch FAILED:', e?.message || e))
        fetchClients()
          .then((d) => {
            if (alive && d && d.length) setContent((c) => ({ ...c, clients: d }))
          })
          .catch((e) => console.error('[sanity] clients fetch FAILED:', e?.message || e))
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  return (
    <ContentContext.Provider value={content}>
      {inPresentationFrame && (
        <Suspense fallback={null}>
          <LiveContent onContent={setContent} />
        </Suspense>
      )}
      {children}
    </ContentContext.Provider>
  )
}
