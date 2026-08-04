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
import TypePanel from './components/TypePanel'
import Preloader from './components/Preloader'
import Analytics from './components/Analytics'
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

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
      <ContentProvider>
      <BrowserRouter>
        <ZoomProvider>
          <MenuProvider>
            <Analytics />
            <Preloader />
            <SmoothScroll>
              <div className="grain" aria-hidden="true" />
              <Nav />
              <MenuPanel />
              <PageShell>
                <AnimatedRoutes />
                <CTASection />
                <Footer />
              </PageShell>
              <TypePanel />
            </SmoothScroll>
          </MenuProvider>
        </ZoomProvider>
      </BrowserRouter>
      </ContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
