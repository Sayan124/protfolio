import { useState } from 'react'
import { STAGES } from '../data/stages.js'
import '../styles/Navbar.css'

export function Navbar({ activeStage, onSelectStage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleStageClick = (stageIndex) => {
    onSelectStage(stageIndex)
    setMenuOpen(false)
  }

  return (
    <header className="navbar-container" aria-label="Main Portfolio Navigation">
      <nav className="navbar-content">
        {/* Brand Logo */}
        <button
          className="brand-logo"
          onClick={() => handleStageClick(0)}
          aria-label="Go to Intro"
        >
          S<span>N</span>
        </button>

        {/* Right side navigation items + 2-line menu toggle */}
        <div className="navbar-right">
          {/* Desktop Nav Links */}
          <div className="nav-stages-list" role="tablist">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                role="tab"
                aria-selected={activeStage === stage.index}
                className={`stage-link ${activeStage === stage.index ? 'active' : ''}`}
                onClick={() => handleStageClick(stage.index)}
              >
                <span className="stage-name">{stage.label}</span>
              </button>
            ))}
          </div>

          {/* Minimalist 2-line menu toggle */}
          <button
            className={`menu-toggle-lines ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className="menu-line line-long" />
            <span className="menu-line line-short" />
          </button>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-dropdown-menu">
          <div className="mobile-stages-grid">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                className={`mobile-stage-btn ${activeStage === stage.index ? 'active' : ''}`}
                onClick={() => handleStageClick(stage.index)}
              >
                <span className="mobile-stage-label">{stage.label}</span>
                {activeStage === stage.index && <span className="mobile-active-dot" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

