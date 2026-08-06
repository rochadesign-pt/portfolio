import { useEffect } from 'react'
import { useQuery, useLiveMode } from '../lib/sanityLoader'
import { client, PROJECT_QUERY, EXPLORATION_QUERY, mapProject, mapExploration } from '../lib/sanity'

// Live draft preview. Mounted ONLY inside the Studio's Presentation iframe.
// useLiveMode streams draft updates from the Studio over its channel (no token),
// and useQuery re-runs as the editor types — so edits show live, before publish.
// It pushes the mapped content up to ContentProvider, overriding published data.
export default function LiveContent({ onContent }) {
  useLiveMode({ client })

  const { data: projectDocs } = useQuery(PROJECT_QUERY)
  const { data: explorationDocs } = useQuery(EXPLORATION_QUERY)

  useEffect(() => {
    onContent((prev) => ({
      projects:
        Array.isArray(projectDocs) && projectDocs.length ? projectDocs.map(mapProject) : prev.projects,
      explorations:
        Array.isArray(explorationDocs) && explorationDocs.length
          ? explorationDocs.map(mapExploration)
          : prev.explorations,
    }))
  }, [projectDocs, explorationDocs, onContent])

  return null
}
