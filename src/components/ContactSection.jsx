import { useState } from 'react'
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MessageSquare,
  Send,
} from 'lucide-react'
import { portfolioData } from '../data/portfolioData.js'
import '../styles/ContactSection.css'

// Authentic brand icons
function GithubIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedinIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  )
}

function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  )
}

export function ContactSection() {
  const [copied, setCopied] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [sentMessage, setSentMessage] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(portfolioData.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) return
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formState.name}`)
    const body = encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    )
    window.location.href = `mailto:${portfolioData.email}?subject=${subject}&body=${body}`
    setSentMessage(true)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCardTiltMove = (e, maxRot = 5) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotX = (((y - centerY) / centerY) * -maxRot).toFixed(2)
    const rotY = (((x - centerX) / centerX) * maxRot).toFixed(2)

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale3d(1.012, 1.012, 1.012)`
  }

  const handleCardTiltLeave = (e) => {
    const card = e.currentTarget
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)'
  }

  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case 'github':
        return <GithubIcon size={20} />
      case 'linkedin':
        return <LinkedinIcon size={20} />
      case 'instagram':
        return <InstagramIcon size={20} />
      case 'facebook':
        return <FacebookIcon size={20} />
      default:
        return <Mail size={20} />
    }
  }

  return (
    <section className="contact-showcase-section" id="contact" aria-label="Stage 6: Contact">
      <div className="contact-container">
        {/* Section Header */}
        <header className="contact-header">
          <h2 className="contact-main-title">
            Let’s Build Something <em>Together</em>
          </h2>
          <p className="contact-main-subtitle">
            Whether you have a question, want to collaborate on software, or just want to connect — my inbox is always open.
          </p>

          <div className="availability-badge">
            <span className="avail-pulse" />
            <span>Open for internships, projects & tech discussions</span>
          </div>
        </header>

        {/* Contact Grid: Details + Quick Form */}
        <div className="contact-grid">
          {/* Left Column: Direct Info & Social Cards */}
          <div className="contact-info-col">
            {/* Primary Email Card */}
            <div
              className="email-highlight-card"
              onMouseMove={(e) => handleCardTiltMove(e, 4)}
              onMouseLeave={handleCardTiltLeave}
            >
              <div className="email-card-header">
                <div className="email-icon-box">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="email-label">DIRECT INQUIRIES</span>
                  <h3 className="email-address">{portfolioData.email}</h3>
                </div>
              </div>

              <div className="email-actions">
                <button
                  type="button"
                  className={`btn-copy ${copied ? 'copied' : ''}`}
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Email'}</span>
                </button>

                <a
                  href={`mailto:${portfolioData.email}`}
                  className="btn-mailto"
                >
                  <span>Send Direct Email</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* Social Connect Directory */}
            <div className="social-directory">
              <h4 className="social-dir-title">Connect on Social Platforms</h4>

              <div className="social-links-grid">
                {portfolioData.socialLinks
                  .filter((s) => s.icon !== 'email')
                  .map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-card"
                      onMouseMove={(e) => handleCardTiltMove(e, 6)}
                      onMouseLeave={handleCardTiltLeave}
                    >
                      <div className="social-card-icon">
                        {getSocialIcon(social.icon)}
                      </div>
                      <div className="social-card-text">
                        <span className="social-card-label">{social.label}</span>
                        <span className="social-card-user">{social.username}</span>
                      </div>
                      <ArrowUpRight size={16} className="social-card-arrow" />
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div className="contact-form-col">
            <div
              className="contact-form-card"
              onMouseMove={(e) => handleCardTiltMove(e, 3.5)}
              onMouseLeave={handleCardTiltLeave}
            >
              <div className="form-card-header">
                <MessageSquare size={18} className="form-header-icon" />
                <h3>Send a Quick Message</h3>
              </div>

              {sentMessage ? (
                <div className="form-success-banner">
                  <Check size={28} className="success-icon" />
                  <h4>Message Client Opened!</h4>
                  <p>Your mail application has been prepared with your message to Sayan.</p>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSentMessage(false)
                      setFormState({ name: '', email: '', message: '' })
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="e.g. Alex Smith"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email">Your Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="e.g. alex@example.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-msg">Message</label>
                    <textarea
                      id="contact-msg"
                      rows={4}
                      placeholder="Share your thoughts, project ideas, or questions..."
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button type="submit" className="btn-submit">
                    <Send size={15} />
                    <span>Send Message to Sayan</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="portfolio-footer">
          <div className="footer-left">
            <button onClick={scrollToTop} className="footer-brand" aria-label="Go to top">
              SN<span>.</span>
            </button>
            <p className="footer-copy">
              © 2026 Sayan Nandi · Durgapur, India. Built with React & HTML5 Canvas.
            </p>
          </div>

          <div className="footer-right">
            <button onClick={scrollToTop} className="btn-back-to-top">
              <span>Back to the Beginning</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </footer>
      </div>
    </section>
  )
}
