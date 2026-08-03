// Provider-agnostic analytics helpers. Google Analytics 4 loads only when a
// measurement id is provided (VITE_GA_ID) — dormant otherwise. Vercel Analytics
// is wired separately in the Analytics component (cookieless, no consent banner).

export const GA_ID = import.meta.env.VITE_GA_ID

export function initGA() {
  if (!GA_ID || typeof window === 'undefined' || window.__gaInit) return
  window.__gaInit = true

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  // SPA: we send page_view manually on route change.
  gtag('config', GA_ID, { send_page_view: false })
}

export function pageview(path) {
  if (typeof window === 'undefined' || !window.gtag || !GA_ID) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

// Fire a custom event to whatever providers are active.
export function track(name, params = {}) {
  if (typeof window !== 'undefined' && window.gtag && GA_ID) {
    window.gtag('event', name, params)
  }
}
