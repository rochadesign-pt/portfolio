import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

const SITE_URL = 'https://rochadesign.pt'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

// Upsert a <meta> tag by CSS selector, creating it (with `create` attrs) if
// it is missing, then setting its content.
function upsertMeta(selector, createAttrs, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    for (const [k, v] of Object.entries(createAttrs)) el.setAttribute(k, v)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Upsert a <link rel="..."> tag (e.g. canonical), creating it if missing.
function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Per-route <head> management (no dependency). Sets the document title, meta
// description, Open Graph + Twitter tags, the canonical URL and og:url for the
// current path, the <html lang> and og:locale. Pass an absolute or root-relative
// `image` to override the default social card per page.
export function useSeo({ title, description, image } = {}) {
  const { lang } = useLang()
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.lang = lang

    // Canonical + og:url — normalise (drop any trailing slash except root).
    const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
    const url = `${SITE_URL}${path}`
    upsertLink('canonical', url)
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, url)

    // Locale reflects the active language toggle.
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale' }, lang === 'pt' ? 'pt_PT' : 'en_US')

    if (title) {
      document.title = title
      upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title)
      upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
    }

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description' }, description)
      upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description)
      upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
    }

    const img = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, img)
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, img)
  }, [title, description, image, lang, pathname])
}
