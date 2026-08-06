import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import './index.css'
import { Providers, Shell } from './App.jsx'

// Render the app to an HTML string for a given path. Called by the prerender
// script at build time — effects never run, so this stays browser-free.
export function render(url) {
  return renderToString(
    <StrictMode>
      <Providers>
        <StaticRouter location={url}>
          <Shell />
        </StaticRouter>
      </Providers>
    </StrictMode>,
  )
}
