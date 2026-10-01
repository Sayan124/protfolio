import { useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Calculator,
  Code2,
  Eye,
  Filter,
  Layers,
  Lock,
  MessageSquare,
  Search,
  ShoppingBag,
  Terminal,
  Trophy
} from 'lucide-react'
import { portfolioData } from '../data/portfolioData.js'
import '../styles/ProjectsSection.css'

// Visual thumbnail component customized for each project
function ProjectThumbnail({ project }) {
  const renderVisual = () => {
    switch (project.id) {
      case 'binance-bot':
        return (
          <div className="thumb-graphic thumb-binance">
            <div className="thumb-bar">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
              <span className="thumb-title">binance_algo.py</span>
            </div>
            <div className="thumb-code">
              <span className="code-kw">import</span> binance_api, websockets<br />
              <span className="code-var">bot</span> = <span className="code-fn">TradeEngine</span>(pair=<span className="code-str">"BTC/USDT"</span>)<br />
              <span className="code-var">bot</span>.<span className="code-fn">listen_orderbook</span>(auto_execute=<span className="code-num">True</span>)
            </div>
            <div className="thumb-stat">
              <span className="stat-pill success">LIVE FEED</span>
              <span className="stat-val">+4.2% ARR</span>
            </div>
          </div>
        )
      case 'coder-decoder':
        return (
          <div className="thumb-graphic thumb-security">
            <div className="thumb-bar">
              <Lock size={11} className="thumb-icon-mini" />
              <span className="thumb-title">cipher_engine.py</span>
            </div>
            <div className="thumb-code">
              <span className="code-kw">cipher</span> = <span className="code-fn">encode_secret</span>(msg, salt)<br />
              <span className="code-comment"># Output: 0x7F4A...B9E1</span><br />
              <span className="code-fn">decode_cipher</span>(cipher, key) == msg
            </div>
            <div className="thumb-stat">
              <span className="stat-pill blue">AES-MODIFIED</span>
            </div>
          </div>
        )
      case 'calculator':
        return (
          <div className="thumb-graphic thumb-calc">
            <div className="thumb-bar">
              <Calculator size={11} className="thumb-icon-mini" />
              <span className="thumb-title">Scientific Calculator</span>
            </div>
            <div className="thumb-calc-preview">
              <div className="calc-screen">sin(45°) + √1024 = 32.707</div>
              <div className="calc-keys">
                <span>sin</span><span>cos</span><span>tan</span><span>DEL</span>
                <span>7</span><span>8</span><span>9</span><span>÷</span>
                <span>4</span><span>5</span><span>6</span><span>×</span>
              </div>
            </div>
          </div>
        )
      case 'shopify-product-page':
        return (
          <div className="thumb-graphic thumb-shopify">
            <div className="thumb-bar">
              <ShoppingBag size={11} className="thumb-icon-mini" />
              <span className="thumb-title">CyberWear Pro · $129</span>
            </div>
            <div className="thumb-store-preview">
              <div className="store-badge">IN STOCK</div>
              <div className="store-chips">
                <span className="chip active">Obsidian</span>
                <span className="chip">Cyber Blue</span>
                <span className="chip">Neon Purple</span>
              </div>
            </div>
            <div className="thumb-stat">
              <span className="stat-pill green">CART READY</span>
            </div>
          </div>
        )
      case 'kbc-game':
        return (
          <div className="thumb-graphic thumb-kbc">
            <div className="thumb-bar">
              <Trophy size={11} className="thumb-icon-mini" />
              <span className="thumb-title">KBC Interactive CLI</span>
            </div>
            <div className="thumb-kbc-preview">
              <div className="kbc-q">Q7: Which protocol powers the web?</div>
              <div className="kbc-options">
                <span>[A] HTTP/HTTPS ✓</span><span>[B] FTP</span>
                <span>[C] SMTP</span><span>[D] SSH</span>
              </div>
            </div>
            <div className="thumb-stat">
              <span className="stat-pill amber">₹ 3,20,000</span>
            </div>
          </div>
        )
      default:
        return (
          <div className="thumb-graphic thumb-default">
            <div className="thumb-bar">
              <Layers size={11} className="thumb-icon-mini" />
              <span className="thumb-title">Cinematic Architecture</span>
            </div>
            <div className="thumb-code">
              <span className="code-kw">const</span> canvas = <span className="code-fn">useRef</span>()<br />
              <span className="code-var">frames</span> = [<span className="code-str">"001.jpg"</span> ... <span className="code-str">"300.jpg"</span>]<br />
              <span className="code-fn">scrubFrame</span>(scrollYProgress)
            </div>
            <div className="thumb-stat">
              <span className="stat-pill purple">6 STAGES</span>
            </div>
          </div>
        )
    }
  }

  return <div className="project-thumbnail-box">{renderVisual()}</div>
}

// Interactive project card with 3D cursor tilt movement
function ProjectCardItem({ project }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotX = (((y - centerY) / centerY) * -6.5).toFixed(2)
    const rotY = (((x - centerX) / centerX) * 6.5).toFixed(2)

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)'
  }

  return (
    <article
      ref={cardRef}
      className="project-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail Container */}
      <ProjectThumbnail project={project} />

      {/* Project Card Content */}
      <div className="project-card-body">
        <div className="project-top-meta">
          <span className="project-category-badge">{project.category}</span>
          <span className="project-badge-tag">{project.badge}</span>
        </div>

        <h3 className="project-name">{project.name}</h3>
        <p className="project-description">{project.description}</p>

        {/* Technology Tags */}
        <div className="project-tech-tags">
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>

        {/* Card Action Buttons */}
        <div className="project-actions">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn project-btn-primary"
              aria-label={`View ${project.name} source code on GitHub`}
            >
              <Code2 size={13} />
              <span>Source Code</span>
              <ArrowUpRight size={13} className="btn-arrow" />
            </a>
          ) : (
            <span className="project-btn-disabled">Code on request</span>
          )}

          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="project-btn project-btn-secondary"
              aria-label={`View live demo of ${project.name}`}
            >
              <Eye size={13} />
              <span>Live Demo</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    const set = new Set(['All'])
    portfolioData.projects.forEach((p) => set.add(p.category))
    return Array.from(set)
  }, [])

  const filteredProjects = useMemo(() => {
    return portfolioData.projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory
      const matchesQuery =
        searchQuery.trim() === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        )
      return matchesCategory && matchesQuery
    })
  }, [selectedCategory, searchQuery])

  return (
    <section className="projects-showcase-section" id="projects" aria-label="Stage 5: Projects Showcase">
      <div className="projects-container">
        {/* Section Header */}
        <header className="projects-header">
          <h2 className="projects-main-title">
            Featured <em>Projects</em>
          </h2>
          <p className="projects-main-subtitle">
            A comprehensive showcase of automated software, web applications, and developer utilities built by Sayan.
          </p>
        </header>

        {/* Filter and Search Bar */}
        <div className="projects-controls">
          <div className="category-filters" role="tablist" aria-label="Project categories">
            {categories.map((category) => (
              <button
                key={category}
                role="tab"
                aria-selected={selectedCategory === category}
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                <span className="tab-count">
                  {category === 'All'
                    ? portfolioData.projects.length
                    : portfolioData.projects.filter((p) => p.category === category).length}
                </span>
              </button>
            ))}
          </div>

          <div className="project-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search tools, tech, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCardItem key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="empty-projects-state">
            <Filter size={24} />
            <p>No projects found matching your filter criteria.</p>
            <button
              className="btn-primary"
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
