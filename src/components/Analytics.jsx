import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { initGA, pageview } from '../lib/analytics'

// Mounts Vercel Analytics + Speed Insights and (if VITE_GA_ID is set) GA4,
// sending a page_view on every route change.
export default function Analytics() {
  const { pathname } = useLocation()

  useEffect(() => {
    initGA()
  }, [])

  useEffect(() => {
    pageview(pathname)
  }, [pathname])

  return (
    <>
      <VercelAnalytics />
      <SpeedInsights />
    </>
  )
}
