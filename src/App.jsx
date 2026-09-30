import React, { Suspense, lazy, useEffect, useState } from 'react';

const TempleScene = lazy(() => import('./components/TempleScene.jsx'));

const chapters = [
  { id: 'gate', number: '01', japanese: '山門', label: 'THE ARCHITECT' },
  { id: 'pathways', number: '02', japanese: '庭園', label: 'PROJECTS' },
  { id: 'craft', number: '03', japanese: '手業', label: 'CRAFT & CURIOSITY' },
  { id: 'study', number: '04', japanese: '学堂', label: 'EDUCATION' },
];

function Arrow() { return <span className="arrow" aria-hidden="true">↗</span>; }

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header" id="top">
      <a className="brand" href="#top" aria-label="Sayan Nandi, back to top">
        <span className="brand-mark">S<span>.</span></span>
        <span className="brand-copy"><strong>SAYAN NANDI</strong><small>CRAFT & COMPUTATION</small></span>
      </a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'CLOSE −' : 'MENU +'}</button>
      <nav className={menuOpen ? 'chapter-nav is-open' : 'chapter-nav'} aria-label="Portfolio chapters">
        {chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`} onClick={() => setMenuOpen(false)}><span>{chapter.label}</span><i>{chapter.japanese}</i></a>)}
      </nav>
    </header>
  );
}

function Hero({ signal, onSignal, reducedMotion }) {
  return (
    <section className="hero" id="hero">
      <div className="hero-backdrop" aria-hidden="true"><div className="moon-halo" /><div className="moon" /><div className="ridge ridge-back" /><div className="ridge ridge-front" /><div className="ground-haze" /></div>
      <div className="hero-scene" aria-label="Interactive 3D lantern-lit mountain gate at night. Move your pointer to shift perspective; tap the lantern to interact.">
        <Suspense fallback={<div className="scene-fallback"><span /></div>}><TempleScene onSignal={onSignal} reducedMotion={reducedMotion} /></Suspense>
      </div>
      <div className="hero-content">
        <span className="chapter-kicker"><i /> CHAPTER 00 <b>—</b> THE ARCHITECTURE</span>
        <h1>Turning curiosity<br />into <em>things that work.</em></h1>
        <p className="hero-intro">A computer science student exploring intelligent systems, thoughtful software, and the small details that make ideas real.</p>
        <a className="enter-link" href="#gate"><span>WALK THROUGH</span><b>↓</b></a>
      </div>
      <div className="hero-coordinate">22°34′ N&nbsp; / &nbsp;88°22′ E <span>•</span> {signal}</div>
      <div className="hero-index"><span>SCROLL TO ENTER</span><i /></div>
      <div className="vertical-caption">A PERSONAL ARCHIVE OF CURIOSITY</div>
    </section>
  );
}

function ChapterLabel({ number, title, japanese }) {
  return <div className="chapter-label"><span>{number} <i>—</i> {title}</span><b>{japanese}</b></div>;
}

function About() {
  return (
    <section className="chapter-section about-section" id="gate">
      <div className="section-scene section-scene-gate" aria-hidden="true"><div className="gate-shape"><i /><i /><i /><i /></div><div className="scene-grain" /></div>
      <div className="section-inner about-inner">
        <ChapterLabel number="01" title="THE ARCHITECT" japanese="山門" />
        <div className="about-layout">
          <h2>Deep curiosity.<br /><em>A mind wired to build.</em></h2>
          <div className="about-copy"><p>I’m Sayan Nandi, a B.Tech Computer Science and Engineering student. I like following a question beyond the screen: from the first line of code to the system, circuit, or useful tool it might become.</p><p>Right now, that curiosity leads me through AI and machine learning, generative AI, web development, Python, and hands-on electronics. I’m learning by making, and this space will grow with the work.</p><div className="quiet-facts"><span>BASED IN <b>INDIA</b></span><span>APPROACH <b>BUILD · LEARN · REFINE</b></span></div></div>
        </div>
        <div className="about-footnote"><span>STUDENT / MAKER / CONSTANTLY LEARNING</span><span>00 — 01</span></div>
      </div>
    </section>
  );
}

const projects = [
  { number: '01', title: 'A project will live here.', description: 'A space for a real build, its constraints, and what you learned along the way.', mark: '余白', state: 'SPACE RESERVED' },
  { number: '02', title: 'The next idea, in time.', description: 'This archive will take shape as your work becomes ready to share.', mark: '道', state: 'IN THE MAKING' },
];

function Projects() {
  return (
    <section className="chapter-section projects-section" id="pathways">
      <div className="project-landscape" aria-hidden="true"><div className="project-moon" /><div className="mountain mountain-one" /><div className="mountain mountain-two" /><div className="waterline" /></div>
      <div className="section-inner">
        <ChapterLabel number="02" title="STILL GARDENS" japanese="庭園" />
        <div className="section-heading-row"><h2>Work, with room<br /><em>to take root.</em></h2><p>Selected projects will appear here as they’re built and ready to share.</p></div>
        <div className="project-list">{projects.map((project) => <article className="project-row" key={project.number}><span className="project-number">{project.number}</span><div className="project-emblem" aria-hidden="true">{project.mark}</div><div className="project-copy"><span className="project-state"><i /> {project.state}</span><h3>{project.title}</h3><p>{project.description}</p></div><span className="project-arrow" aria-hidden="true">↗</span></article>)}</div>
      </div>
    </section>
  );
}

function Craft() {
  const interests = [
    ['01', 'Artificial intelligence', 'Machine learning · Generative AI'],
    ['02', 'Software & the web', 'Python · Web development'],
    ['03', 'Electronics & making', 'Circuits · DIY experiments'],
  ];
  return (
    <section className="chapter-section craft-section" id="craft">
      <div className="section-inner">
        <ChapterLabel number="03" title="THE HAND AND WORD" japanese="手業" />
        <div className="section-heading-row craft-heading"><h2>Many interests.<br /><em>One curious mind.</em></h2><p>Things I’m currently learning, exploring, and finding ways to connect.</p></div>
        <div className="interest-list">{interests.map(([number, title, detail]) => <div className="interest-row" key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p><i aria-hidden="true">✳</i></div>)}</div>
        <div className="craft-note"><span className="craft-seal">學</span><p>Good work takes patience.<br />So does learning how to do it.</p></div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="chapter-section education-section" id="study">
      <div className="education-backdrop" aria-hidden="true"><span>学</span><div /></div>
      <div className="section-inner education-inner">
        <ChapterLabel number="04" title="THE HALL OF STUDY" japanese="学堂" />
        <div className="education-main"><span className="education-year">PRESENT / ONGOING</span><h2>Education</h2><div className="education-entry"><span className="entry-line" /><div><h3>B.Tech in Computer Science & Engineering</h3><p>Currently studying</p></div><span className="entry-mark">学</span></div></div>
        <a href="#top" className="back-to-top">RETURN TO THE BEGINNING <span>↑</span></a>
      </div>
    </section>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><a className="footer-name" href="#top">SAYAN NANDI<span>静けさの中で、つくる。</span></a><div className="footer-links"><span>CHAPTERS</span>{chapters.map(({ id, label, number }) => <a href={`#${id}`} key={id}>{number} — {label}</a>)}</div><div className="footer-links footer-connect"><span>CONNECT</span><p>Contact details will be added here.</p></div><div className="footer-kanji" aria-hidden="true">灯</div></div><div className="footer-bottom"><span>© 2026 SAYAN NANDI</span><span>B.TECH CSE · BUILT WITH CURIOSITY</span><a href="#top">BACK TO TOP ↑</a></div></footer>;
}

export default function App() {
  const [signal, setSignal] = useState('LISTENING');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event) => setReducedMotion(event.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return <div className="site-shell"><a className="skip-link" href="#gate">SKIP TO CONTENT</a><Header /><main><Hero signal={signal} onSignal={setSignal} reducedMotion={reducedMotion} /><About /><Projects /><Craft /><Education /></main><Footer /></div>;
}
