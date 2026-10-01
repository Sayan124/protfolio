import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import { portfolioData } from '../data/portfolioData.js'
import '../styles/CinematicCanvas.css'

const TOTAL_FRAMES = 300

function getFrameSrc(index) {
  const padded = String(index + 1).padStart(3, '0')
  return `/frames/ezgif-frame-${padded}.jpg`
}

export function CinematicCanvas({ onStageChange, reducedMotion = false }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const world3dRef = useRef(null)
  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null))
  const lastDrawnFrameRef = useRef(-1)
  const targetFrameRef = useRef(0)
  const currentFrameRef = useRef(0)
  const rafIdRef = useRef(null)
  const mouseTargetRef = useRef({ x: 0, y: 0 })
  const mouseCurrentRef = useRef({ x: 0, y: 0 })

  const [initialFrameReady, setInitialFrameReady] = useState(false)

  // Overlay opacity state
  const [opacities, setOpacities] = useState({
    intro: 1,
    about: 0,
    education: 0,
    future: 0,
  })

  // Listen to cursor movement for interactive 3D parallax
  useEffect(() => {
    if (reducedMotion) return
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer) return

    const onMouseMove = (e) => {
      // Map cursor coordinates from center of screen to normalized range [-1, 1]
      const normX = (e.clientX / window.innerWidth - 0.5) * 2
      const normY = (e.clientY / window.innerHeight - 0.5) * 2
      mouseTargetRef.current = { x: normX, y: normY }
    }

    const onMouseLeave = () => {
      // Smoothly return to center when cursor exits viewport
      mouseTargetRef.current = { x: 0, y: 0 }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [reducedMotion])

  // Draw a frame onto the canvas with object-fit: cover math
  const renderFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // Find the requested image or the nearest available image
    let img = imagesRef.current[frameIdx]
    if (!img || !img.complete || !img.naturalWidth) {
      // Find closest loaded frame
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const left = frameIdx - offset
        if (left >= 0 && imagesRef.current[left]?.complete && imagesRef.current[left]?.naturalWidth) {
          img = imagesRef.current[left]
          break
        }
        const right = frameIdx + offset
        if (right < TOTAL_FRAMES && imagesRef.current[right]?.complete && imagesRef.current[right]?.naturalWidth) {
          img = imagesRef.current[right]
          break
        }
      }
    }

    if (!img || !img.complete || !img.naturalWidth) return

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight

    const imgRatio = imgWidth / imgHeight
    const canvasRatio = canvasWidth / canvasHeight

    let drawWidth, drawHeight, drawX, drawY

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth
      drawHeight = canvasWidth / imgRatio
      drawX = 0
      drawY = (canvasHeight - drawHeight) / 2
    } else {
      drawHeight = canvasHeight
      drawWidth = canvasHeight * imgRatio
      drawX = (canvasWidth - drawWidth) / 2
      drawY = 0
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    lastDrawnFrameRef.current = frameIdx
  }, [])

  // Resize canvas to match display size and device pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()
    const targetW = Math.round(rect.width * dpr)
    const targetH = Math.round(rect.height * dpr)

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
      if (lastDrawnFrameRef.current >= 0) {
        renderFrame(lastDrawnFrameRef.current)
      }
    }
  }, [renderFrame])

  // Preload frame sequence with priority order
  useEffect(() => {
    let isCancelled = false
    // 1. Immediately load frame 0 (first frame) for instant rendering
    const img0 = new Image()
    img0.src = getFrameSrc(0)
    img0.onload = () => {
      if (isCancelled) return
      imagesRef.current[0] = img0
      setInitialFrameReady(true)
      handleResize()
      renderFrame(0)
    }

    // 2. Preload key milestone frames first (every 10 frames), then the rest
    const keyIndices = []
    const otherIndices = []

    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (i % 10 === 0 || i === TOTAL_FRAMES - 1) {
        keyIndices.push(i)
      } else {
        otherIndices.push(i)
      }
    }

    const priorityQueue = [...keyIndices, ...otherIndices]

    // Preload with controlled concurrency
    const concurrency = 8
    let currentIndex = 0

    const loadNext = () => {
      if (isCancelled || currentIndex >= priorityQueue.length) return
      const idx = priorityQueue[currentIndex++]
      const img = new Image()
      img.src = getFrameSrc(idx)
      const onDone = () => {
        if (!isCancelled) {
          imagesRef.current[idx] = img
          // If this is the current target frame, re-render
          if (Math.abs(targetFrameRef.current - idx) <= 1) {
            renderFrame(targetFrameRef.current)
          }
        }
        loadNext()
      }
      img.onload = onDone
      img.onerror = onDone
    }

    for (let c = 0; c < concurrency; c++) {
      loadNext()
    }

    return () => {
      isCancelled = true
    }
  }, [handleResize, renderFrame])

  // RAF loop for smooth frame interpolation and 3D cursor movement
  useEffect(() => {
    let animId

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current

      if (reducedMotion || Math.abs(diff) < 0.2) {
        currentFrameRef.current = targetFrameRef.current
      } else {
        currentFrameRef.current += diff * 0.28
      }

      const frameToDraw = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)))

      if (frameToDraw !== lastDrawnFrameRef.current) {
        renderFrame(frameToDraw)
      }

      // Smooth 3D cursor parallax camera lerp
      if (!reducedMotion) {
        const mx = mouseTargetRef.current.x - mouseCurrentRef.current.x
        const my = mouseTargetRef.current.y - mouseCurrentRef.current.y

        if (Math.abs(mx) > 0.0005 || Math.abs(my) > 0.0005) {
          mouseCurrentRef.current.x += mx * 0.065
          mouseCurrentRef.current.y += my * 0.065

          const worldEl = world3dRef.current
          if (worldEl) {
            const rx = (-mouseCurrentRef.current.y * 3.2).toFixed(2)
            const ry = (mouseCurrentRef.current.x * 3.2).toFixed(2)
            const tx = (-mouseCurrentRef.current.x * 14).toFixed(2)
            const ty = (-mouseCurrentRef.current.y * 10).toFixed(2)

            worldEl.style.transform = `scale(1.035) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`
          }
        }
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    rafIdRef.current = animId

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [reducedMotion, renderFrame])

  // Window scroll handler mapping to the 4 cinematic stages
  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const scrollableDistance = container.offsetHeight - window.innerHeight

      if (scrollableDistance <= 0) return

      // Raw progress through the cinematic section: 0 at top, 1 at bottom
      const rawProgress = Math.min(1, Math.max(0, -rect.top / scrollableDistance))

      // Timeline mapping:
      // The sequence begins at Intro scene and ends at Future Goals scene.
      // From 0 to 0.88: scrub through frames 0 to 299.
      // From 0.88 to 1.0: frame is LOCKED at final frame (299 - Future Goals sunrise vista).
      const frameProgress = Math.min(1, rawProgress / 0.88)
      const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(frameProgress * (TOTAL_FRAMES - 1)))
      targetFrameRef.current = targetFrame

      // Overlays opacity calculations:
      // Stage 1 - Intro: [0.0 - 0.20]
      const introOpacity = rawProgress < 0.12 ? 1 : Math.max(0, 1 - (rawProgress - 0.12) / 0.08)

      // Stage 2 - About Me: [0.22 - 0.48]
      const enterAbout = Math.min(1, Math.max(0, (rawProgress - 0.22) / 0.06))
      const leaveAbout = rawProgress > 0.44 ? Math.max(0, 1 - (rawProgress - 0.44) / 0.06) : 1
      const aboutOpacity = Math.min(enterAbout, leaveAbout)

      // Stage 3 - Education: [0.50 - 0.76]
      const enterEdu = Math.min(1, Math.max(0, (rawProgress - 0.50) / 0.06))
      const leaveEdu = rawProgress > 0.72 ? Math.max(0, 1 - (rawProgress - 0.72) / 0.06) : 1
      const eduOpacity = Math.min(enterEdu, leaveEdu)

      // Stage 4 - Future Goals: [0.78 - 1.0]
      const futureOpacity = rawProgress < 0.78 ? 0 : Math.min(1, (rawProgress - 0.78) / 0.06)

      setOpacities({
        intro: introOpacity,
        about: aboutOpacity,
        education: eduOpacity,
        future: futureOpacity,
      })

      // Notify parent about which stage is currently active (0: Intro, 1: About, 2: Edu, 3: Future)
      if (rawProgress < 0.22) {
        onStageChange?.(0)
      } else if (rawProgress < 0.50) {
        onStageChange?.(1)
      } else if (rawProgress < 0.78) {
        onStageChange?.(2)
      } else if (rawProgress <= 1.0) {
        onStageChange?.(3)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    // Initial trigger
    handleResize()
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize, onStageChange])

  return (
    <section
      ref={containerRef}
      className="cinematic-section"
      id="cinematic-journey"
      aria-label="Cinematic Story Stages 1 to 4"
    >
      <div className="cinematic-sticky">
        <div className="cinematic-3d-world" ref={world3dRef}>
          {/* Hardware-accelerated 2D Canvas */}
        <canvas
          ref={canvasRef}
          className="cinematic-canvas"
          aria-label="Interactive 300-frame cinematic journey from platform to workstation, clouds, and mountain horizon"
        />

        {/* Ambient subtle vignette & gradients */}
        <div className="cinematic-vignette" aria-hidden="true" />

        {/* Discreet loading indicator if frames are being buffered */}
        {!initialFrameReady && (
          <div className="cinematic-loading-badge" role="status">
            <span className="loading-spinner" />
            <span>Loading cinematic universe...</span>
          </div>
        )}

        {/* ==================================================
            STAGE 1: INTRO OVERLAY
            ================================================== */}
        <div
          className="cinematic-overlay intro-overlay"
          id="stage-intro"
          style={{
            opacity: opacities.intro,
            pointerEvents: opacities.intro > 0.15 ? 'auto' : 'none',
            visibility: opacities.intro > 0.01 ? 'visible' : 'hidden',
          }}
        >
          <div className="intro-content">
            <p className="intro-greeting">Hi, I’m</p>
            <h1 className="intro-name">
              Sayan <em>Nandi</em>
            </h1>

            <p className="intro-tagline">{portfolioData.tagline}</p>
            <p className="intro-bio">{portfolioData.introduction}</p>

            <div className="intro-actions">
              <a
                href="#stage-about"
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault()
                  const container = containerRef.current
                  if (container) {
                    const scrollDist = container.offsetHeight - window.innerHeight
                    window.scrollTo({ top: scrollDist * 0.35, behavior: 'smooth' })
                  }
                }}
              >
                <span>Explore My Journey</span>
                <ArrowDown size={14} />
              </a>

              <a href={`mailto:${portfolioData.email}`} className="btn-secondary">
                <span>Let’s Connect</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="scroll-indicator">
              <div className="scroll-pill-mouse">
                <span className="scroll-wheel" />
              </div>
              <span>SCROLL TO MOVE THROUGH THE FILM</span>
            </div>
          </div>
        </div>

        {/* ==================================================
            STAGE 2: ABOUT ME OVERLAY (Split layout: Heading one side, Content other side)
            ================================================== */}
        <div
          className="cinematic-overlay about-overlay"
          id="stage-about"
          style={{
            opacity: opacities.about,
            pointerEvents: opacities.about > 0.15 ? 'auto' : 'none',
            visibility: opacities.about > 0.01 ? 'visible' : 'hidden',
          }}
        >
          <div className="about-split-layout">
            {/* Heading Side (Left on desktop) */}
            <div className="about-heading-side">
              <h2 className="overlay-heading">
                Inside the <em>Workspace</em>
              </h2>
              <p className="overlay-subheading">
                Where curiosity transforms into code and software.
              </p>
            </div>

            {/* Content Side (Right on desktop) */}
            <div className="about-content-side">
              <div className="about-bio-paragraphs">
                <p>
                  I’m a first-year Computer Science & Engineering student at{' '}
                  <strong>DIATM</strong> with an insatiable drive to build.
                </p>
                <p>
                  From coding automated trading bots and web scraping engines in
                  Python to designing interactive, responsive web applications, I
                  focus on building tools that solve real problems.
                </p>
              </div>

              <div className="about-stats-grid">
                {portfolioData.about.highlights.map((item) => (
                  <div key={item.label} className="about-stat-item">
                    <span className="stat-label">{item.label}</span>
                    <strong className="stat-value">{item.value}</strong>
                  </div>
                ))}
              </div>

              <div className="about-philosophy-tag">
                <Sparkles size={13} className="sparkle-icon" />
                <span>Philosophy: Learn by building real things</span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            STAGE 3: EDUCATION OVERLAY
            ================================================== */}
        <div
          className="cinematic-overlay education-overlay"
          id="stage-education"
          style={{
            opacity: opacities.education,
            pointerEvents: opacities.education > 0.15 ? 'auto' : 'none',
            visibility: opacities.education > 0.01 ? 'visible' : 'hidden',
          }}
        >
          <div className="education-content">
            <h2 className="overlay-heading">
              Where I <em>Learn</em>
            </h2>
            <p className="overlay-subheading">
              Solid theoretical foundations powering technical creation.
            </p>

            <div className="education-timeline-list">
              {portfolioData.education.map((item) => (
                <article key={item.step} className="edu-timeline-item">
                  <div className="edu-step-badge">{item.step}</div>
                  <div className="edu-item-body">
                    <span className="edu-item-label">{item.label}</span>
                    <h3 className="edu-item-title">{item.title}</h3>
                    <p className="edu-item-place">{item.place}</p>
                    {item.note && <p className="edu-item-note">{item.note}</p>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================
            STAGE 4: FUTURE GOALS OVERLAY (FINAL CINEMATIC SCENE)
            Desktop/Laptop: Goals positioned at visible mountain peaks
            Mobile: Stacked as currently
            ================================================== */}
        <div
          className="cinematic-overlay future-overlay"
          id="stage-future"
          style={{
            opacity: opacities.future,
            pointerEvents: opacities.future > 0.15 ? 'auto' : 'none',
            visibility: opacities.future > 0.01 ? 'visible' : 'hidden',
          }}
        >
          {/* Header block (top-left on desktop, stacked on mobile) */}
          <div className="future-header-block">
            <h2 className="overlay-heading">
              Looking Toward the <em>Horizon</em>
            </h2>
            <p className="overlay-subheading">
              The principles and aspirations guiding what comes next.
            </p>
          </div>

          {/* Goals container: Anchored at mountain peaks on desktop */}
          <div className="future-goals-container">
            {portfolioData.goals.map((goal, index) => (
              <div
                key={goal.step}
                className={`future-goal-item peak-goal-${index + 1}`}
              >
                {/* Floating goal card content */}
                <div className="goal-card-content">
                  <div className="goal-card-header">
                    <div className="goal-title-wrap">
                      <span className="goal-num">{goal.step}</span>
                      <h3 className="goal-title">{goal.title}</h3>
                    </div>
                    <span className="goal-tag">{goal.tag}</span>
                  </div>
                  <p className="goal-detail">{goal.detail}</p>
                </div>

                {/* Mountain peak locator beacon pointing downwards to the summit (desktop only) */}
                <div className="peak-beacon" aria-hidden="true">
                  <div className="peak-beacon-line" />
                  <div className="peak-beacon-dot" />
                </div>
              </div>
            ))}
          </div>

          <div className="cinematic-complete-banner">
            <div className="complete-indicator">
              <span className="complete-dot" />
              <span>CINEMATIC JOURNEY COMPLETE</span>
            </div>
            <p className="scroll-next-hint">
              Continue scrolling to explore all projects below ↓
            </p>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
