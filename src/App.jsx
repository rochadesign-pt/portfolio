import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LanguageProvider } from './i18n/LanguageContext'
import SmoothScroll from './components/SmoothScroll'
import Nav from './components/Nav'
import Footer from './components/Footer'
import TypePanel from './components/TypePanel'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
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

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Preloader />
        <Cursor />
        <SmoothScroll>
          <Nav />
          <AnimatedRoutes />
          <Footer />
          <TypePanel />
        </SmoothScroll>
      </BrowserRouter>
    </LanguageProvider>
  )
}
