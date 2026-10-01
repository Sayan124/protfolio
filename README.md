# Sayan Nandi — Cinematic Portfolio

> A scroll-led journey through the work, learning, and ambitions of **Sayan Nandi**, a Computer Science & Engineering student in Durgapur, India.

This portfolio pairs a cinematic, frame-by-frame canvas experience with a clear showcase of projects, education, and ways to connect. Scroll through the story or use the floating navigation to jump between its six chapters.

## The experience

- **Six chapters:** Intro, About Me, Education, Future Goals, Projects, and Contact.
- **Cinematic scroll sequence:** A 300-frame image sequence is drawn to an HTML canvas and scrubbed as you scroll.
- **Project discovery:** Browse project cards with category filters and search.
- **Interactive details:** Motion effects, responsive layouts, and a contact form that opens a prefilled email in your mail app.
- **Motion-aware:** Honors your device’s reduced-motion preference.

## Built with

| Area | Tools |
| --- | --- |
| UI | React 19 |
| Build and development | Vite 8 |
| Canvas and visuals | HTML Canvas, Three.js, React Three Fiber, Drei |
| Animation | Framer Motion |
| Icons | Lucide React |

## Run locally

**Requirements:** Node.js 20.19+ or 22.12+ and npm.

```bash
# Clone the repository
git clone https://github.com/Sayan124/protfolio.git
cd protfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Vite prints the local address in your terminal when the server is ready.

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local development server with hot reload. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Check the source with Oxlint. |

## Project layout

```text
src/
├── components/   # Navigation, cinematic canvas, projects, and contact sections
├── data/         # Portfolio content and chapter configuration
├── styles/       # Section and app styles
├── App.jsx       # Page composition and chapter navigation
└── main.jsx      # Application entry point
public/
└── frames/       # 300 images used by the scroll-scrubbed sequence
```

The portfolio content—including biography, education, projects, and social links—is kept in [`src/data/portfolioData.js`](src/data/portfolioData.js). Update that file to personalize the page.

## Get in touch

- **Email:** [sayannandi623@gmail.com](mailto:sayannandi623@gmail.com)
- **GitHub:** [@Sayan124](https://github.com/Sayan124)
- **LinkedIn:** [sayannandi623](https://www.linkedin.com/in/sayannandi623)

---

<p align="center">Made with curiosity and code by <a href="https://github.com/Sayan124">Sayan Nandi</a> · Durgapur, India</p>
