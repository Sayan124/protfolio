import React, { Suspense, lazy, useEffect, useState } from 'react';

const CoreScene = lazy(() => import('./components/CoreScene.jsx'));

const interests = ['AI / ML', 'Generative AI', 'Python', 'Web development', 'Electronics & DIY'];

function ArrowIcon() {
  return <span aria-hidden="true" className="arrow-icon">↗</span>;
}

function Header() {
  return (
    <header className="topbar">
      <a className="wordmark" href="#home" aria-label="SAYAN.OS home">
        <span className="wordmark-icon">S<span>.</span></span>
        <span>SAYAN<span className="muted">.OS</span></span>
      </a>
      <nav className="nav-links" aria-label="Main navigation">
        <a href="#about">About</a>
        <a href="#work">Work</a>
        <a href="#interests">Interests</a>
      </nav>
      <a className="contact-link" href="#contact">Let’s connect <ArrowIcon /></a>
    </header>
  );
}

function Hero({ signal, onSignal, reducedMotion }) {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <div className="eyebrow"><span className="live-dot" /> PERSONAL PORTFOLIO <span className="eyebrow-divider">/</span> 001</div>
        <h1>Curiosity,<br />connected<span className="title-period">.</span></h1>
        <p className="hero-description">I’m <strong>Sayan Nandi</strong> — a B.Tech CSE student exploring the space where intelligent software meets the physical world.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#work">Explore my work <ArrowIcon /></a>
          <a className="text-link" href="#about">A little about me <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-meta"><span>INDEPENDENT THINKER</span><span className="meta-line" /><span>ALWAYS LEARNING</span></div>
      </div>

      <div className="core-stage" aria-label="Interactive three-dimensional neural network. Move your pointer or select a node.">
        <div className="stage-grid" />
        <div className="stage-orbit stage-orbit-a" />
        <div className="stage-orbit stage-orbit-b" />
        <Suspense fallback={<div className="canvas-fallback" />}>
          <CoreScene onSignal={onSignal} reducedMotion={reducedMotion} />
        </Suspense>
        <div className="stage-index"><span>FIG 01</span><span>NEURAL STUDY</span></div>
        <div className="core-readout"><span className="readout-pulse" /><span>CORE / {signal}</span></div>
        <div className="stage-coordinate">BUILD / LEARN<br />NODE 001</div>
      </div>

      <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><span className="scroll-mark">↓</span><span className="hero-bottom-note">A mind in progress. A universe of ideas.</span></div>
    </section>
  );
}

function SectionLabel({ number, children }) {
  return <div className="section-label"><span>{number}</span><span className="label-rule" /><span>{children}</span></div>;
}

function About() {
  return (
    <section className="content-section about-section" id="about">
      <SectionLabel number="01">A LITTLE CONTEXT</SectionLabel>
      <div className="about-grid">
        <h2>Learning by<br /><span>connecting dots.</span></h2>
        <div className="about-copy">
          <p>I’m studying computer science and following the questions that pull me in: How can machines learn? How do ideas become useful tools? What happens when code reaches beyond the screen?</p>
          <p>My interests move between AI and machine learning, building for the web, and hands-on electronics. This space will grow alongside the things I make.</p>
          <div className="profile-facts">
            <div><span className="fact-label">CURRENTLY</span><span>B.Tech · Computer Science & Engineering</span></div>
            <div><span className="fact-label">APPROACH</span><span>Build, understand, iterate.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="content-section work-section" id="work">
      <SectionLabel number="02">SELECTED WORK</SectionLabel>
      <div className="work-heading"><h2>Made of questions<span className="title-period">.</span></h2><span className="work-count">PORTFOLIO / IN PROGRESS</span></div>
      <a className="project-placeholder" href="#contact">
        <div className="project-number">01</div>
        <div className="project-main"><span className="project-kicker">PROJECT SLOT 01</span><h3>Projects will take shape here.</h3><p>This space is ready for a project title, what you explored, and a link to try it.</p></div>
        <div className="project-action"><span>YOUR WORK GOES HERE</span><ArrowIcon /></div>
        <div className="project-decoration" aria-hidden="true"><span /><span /><span /></div>
      </a>
    </section>
  );
}

function Interests() {
  return (
    <section className="content-section interests-section" id="interests">
      <SectionLabel number="03">CURRENT CURIOSITIES</SectionLabel>
      <div className="interests-grid"><h2>Areas I keep<br /><span>coming back to.</span></h2><div className="interest-list">{interests.map((interest, i) => <div className="interest-item" key={interest}><span className="interest-index">0{i + 1}</span><span>{interest}</span><span className="interest-spark" aria-hidden="true">✳</span></div>)}</div></div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-orb" aria-hidden="true" />
      <SectionLabel number="04">OPEN CHANNEL</SectionLabel>
      <div className="contact-inner"><h2>Have a good<br />question<span className="title-period">?</span></h2><p>I’m always glad to talk ideas, learning, and things worth building.</p><span className="contact-placeholder">CONTACT DETAILS · ADD WHEN READY</span></div>
      <footer><a className="wordmark footer-mark" href="#home"><span className="wordmark-icon">S<span>.</span></span><span>SAYAN<span className="muted">.OS</span></span></a><span>BUILT WITH CURIOSITY · 2026</span><a href="#home" className="back-top">BACK TO TOP ↑</a></footer>
    </section>
  );
}

export default function App() {
  const [signal, setSignal] = useState('LISTENING');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (event) => setReducedMotion(event.matches);
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  return <div className="site-shell"><div className="ambient-glow" /><Header /><main><Hero signal={signal} onSignal={setSignal} reducedMotion={reducedMotion} /><About /><Work /><Interests /><Contact /></main></div>;
}
