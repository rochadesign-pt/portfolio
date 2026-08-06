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
// All routes are eager: the page-transition choreography (AnimatePresence) and
// the click-to-zoom (which mounts the destination underneath a growing overlay)
// depend on routes being present synchronously — lazy chunks broke the zoom.
import Home from './pages/Home'
import Work from './pages/Work'
import Project from './pages/Project'
import Services from './pages/Services'
import Studio from './pages/Studio'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<Project />} />
        <Route path="/services" element={<Services />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
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
//
// The homepage is the exception: there the CTA is rendered inside the page as
// the second half of a sticky stack (the "lab" pins and the CTA rises over it),
// so it must be a DOM sibling of that section — Home renders its own copy and we
// skip the global one here to avoid a duplicate.
function RoutedCTA() {
  const { pathname } = useLocation()
  if (pathname === '/') return null
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
