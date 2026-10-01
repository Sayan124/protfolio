import { useCallback, useEffect, useState } from 'react'
import { CinematicCanvas } from './components/CinematicCanvas.jsx'
import { ProjectsSection } from './components/ProjectsSection.jsx'
import { ContactSection } from './components/ContactSection.jsx'
import { Navbar } from './components/Navbar.jsx'
import './styles/App.css'

export default function App() {
  const [activeStage, setActiveStage] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  )

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener?.('change', handler)
    return () => mediaQuery.removeEventListener?.('change', handler)
  }, [])

  // Check section intersections for Stage 5 (Projects) and Stage 6 (Contact)
  useEffect(() => {
    const handleScroll = () => {
      // Check intersections for Stage 5 (Projects) and Stage 6 (Contact)
      const projectsEl = document.getElementById('projects')
      const contactEl = document.getElementById('contact')
      const windowHeight = window.innerHeight

      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect()
        // If contact section is significantly visible in viewport
        if (contactRect.top <= windowHeight * 0.45) {
          setActiveStage(5)
          return
        }
      }

      if (projectsEl) {
        const projectsRect = projectsEl.getBoundingClientRect()
        // If projects section is in the upper part of viewport
        if (projectsRect.top <= windowHeight * 0.45) {
          setActiveStage(4)
          return
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Callback from CinematicCanvas when scrolling through stages 0-3
  const handleCinematicStageChange = useCallback((cinematicStage) => {
    // Only update if not already scrolled into Projects (4) or Contact (5)
    const projectsEl = document.getElementById('projects')
    if (projectsEl) {
      const projectsRect = projectsEl.getBoundingClientRect()
      if (projectsRect.top <= window.innerHeight * 0.45) {
        return
      }
    }
    setActiveStage(cinematicStage)
  }, [])

  // Smooth jump to any of the 6 stages
  const handleSelectStage = useCallback((stageIndex) => {
    const behavior = reducedMotion ? 'auto' : 'smooth'
    const cinematicSection = document.getElementById('cinematic-journey')
    const projectsSection = document.getElementById('projects')
    const contactSection = document.getElementById('contact')

    if (stageIndex <= 3 && cinematicSection) {
      const scrollDist = cinematicSection.offsetHeight - window.innerHeight
      let targetProgress = 0
      if (stageIndex === 0) targetProgress = 0.0
      else if (stageIndex === 1) targetProgress = 0.35 // Stage 2: About Me
      else if (stageIndex === 2) targetProgress = 0.63 // Stage 3: Education
      else if (stageIndex === 3) targetProgress = 0.90 // Stage 4: Future Goals

      const targetY = scrollDist * targetProgress
      window.scrollTo({ top: targetY, behavior })
      setActiveStage(stageIndex)
    } else if (stageIndex === 4 && projectsSection) {
      projectsSection.scrollIntoView({ behavior, block: 'start' })
      setActiveStage(4)
    } else if (stageIndex === 5 && contactSection) {
      contactSection.scrollIntoView({ behavior, block: 'start' })
      setActiveStage(5)
    }
  }, [reducedMotion])

  return (
    <div className="portfolio-app-root">
      {/* Floating 6-Stage Navbar */}
      <Navbar
        activeStage={activeStage}
        onSelectStage={handleSelectStage}
      />

      {/* STAGES 1 TO 4: CINEMATIC FRAME SEQUENCE
          (Pre-rendered 300-frame sequence on 2D canvas with scroll-scrubbing) */}
      <CinematicCanvas
        onStageChange={handleCinematicStageChange}
        reducedMotion={reducedMotion}
      />

      {/* ==================================================
          CRITICAL TRANSITION NOTE:
          The sticky cinematic canvas container above naturally
          moves out of view when scrolling past Future Goals.
          Then the normal webpage sections begin directly below.
          NO canvas, NO frame sequence, NO fake 3D transitions.
          ================================================== */}

      {/* STAGE 5: PROJECTS SHOWCASE
          (Normal webpage section with clean dark background) */}
      <ProjectsSection />

      {/* STAGE 6: CONTACT
          (Normal webpage section with clean dark background) */}
      <ContactSection />
    </div>
  )
}
