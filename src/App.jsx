import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './theme/ThemeContext'
import { LanguageProvider } from './i18n/LanguageContext'
import { ContentProvider } from './content/ContentProvider'
import { ZoomProvider } from './context/Zoom'
import { MenuProvider, useMenu } from './context/Menu'
import SmoothScroll from './components/SmoothScroll'
import Nav from './components/Nav'
import MenuPanel from './components/MenuPanel'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import Analytics from './components/Analytics'
import VisualEditing from './components/VisualEditing'
// TypePanel (type playground) removed — typography locked to Switzer Light.
import Home from './pages/Home'
// Project stays eager: the click-to-zoom transition grows an overlay while the
// project page mounts underneath, so the destination must be ready synchronously
// (a lazy chunk would reveal a blank frame when the overlay clears).
import Project from './pages/Project'
// Other secondary routes are split out of the initial bundle and load on nav.
const Work = lazy(() => import('./pages/Work'))
const Services = lazy(() => import('./pages/Services'))
const Studio = lazy(() => import('./pages/Studio'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="/services" element={<Services />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

// The scrollable content that slides aside to reveal the menu panel.
function PageShell({ children }) {
  const { open, close } = useMenu()
  return (
    <div className={`page-shell ${open ? 'is-open' : ''}`}>
      {open && <button aria-label="Fechar menu" className="page-shell-cover" onClick={close} />}
      {children}
    </div>
  )
}

// Remount the closing CTA on each route so its scroll-driven reveal re-measures
// against the new page height (otherwise useScroll keeps stale offsets and the
// effect can fail to fire after an SPA navigation).
function RoutedCTA() {
  const { pathname } = useLocation()
  return <CTASection key={pathname} />
}

// App-wide providers, router-agnostic. Shared by the client entry (wrapped in
// BrowserRouter) and the prerender entry (wrapped in StaticRouter).
export function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ContentProvider>{children}</ContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

// Everything that lives inside the router — the interactive shell and routes.
export function Shell() {
  return (
    <ZoomProvider>
      <MenuProvider>
        <Analytics />
        <VisualEditing />
        <Preloader />
        <SmoothScroll>
          <div className="grain" aria-hidden="true" />
          <Nav />
          <MenuPanel />
          <PageShell>
            <AnimatedRoutes />
            <RoutedCTA />
            <Footer />
          </PageShell>
        </SmoothScroll>
      </MenuProvider>
    </ZoomProvider>
  )
}

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </Providers>
  )
}
