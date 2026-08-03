import { useEffect } from 'react'
import { useLang } from '../i18n/LanguageContext'

function upsert(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    for (const [k, v] of Object.entries(attrs.create)) el.setAttribute(k, v)
    document.head.appendChild(el)
  }
  el.setAttribute('content', attrs.content)
}

// Lightweight per-route <head> management (no dependency). Sets the document
// title, meta description, Open Graph title/description and the <html lang>.
export function useSeo({ title, description }) {
  const { lang } = useLang()
  useEffect(() => {
    document.documentElement.lang = lang
    if (title) document.title = title
    if (description) {
      upsert('meta[name="description"]', {
        create: { name: 'description' },
        content: description,
      })
      upsert('meta[property="og:description"]', {
        create: { property: 'og:description' },
        content: description,
      })
    }
    if (title) {
      upsert('meta[property="og:title"]', {
        create: { property: 'og:title' },
        content: title,
      })
    }
  }, [title, description, lang])
}
