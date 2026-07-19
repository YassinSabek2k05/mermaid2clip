# Mermaid 2 Clip

An installable web app for turning [Mermaid](https://mermaid.js.org/)
diagram code into an image you can copy straight to your clipboard or download as
a PNG — with a built-in **syntax guide** so you never have to memorise the syntax.

## Features

- **Live preview** — diagrams re-render as you type.
- **Copy image / Download PNG** — high-resolution export on a white background.
- **Syntax guide** — clickable snippets and full templates for flowcharts,
  sequence, class, state, ER, Gantt, pie, mindmap, git graph and user-journey
  diagrams. Click to insert at the cursor; no memorising required.
- **PWA** — installable and works offline once loaded.
- Your latest diagram is saved locally between sessions.

## Development

```bash
npm install
npm run icons   # generate PWA icons (once, or after changing the logo)
npm run dev     # start the dev server
npm run build   # production build into dist/
```

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. Enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

The app is served from `/mermaid2clip/`; change `base` in `vite.config.ts` if you
rename the repository or use a custom domain.

## Tech

React + TypeScript + Vite, `mermaid` for rendering, `vite-plugin-pwa` for the
service worker and manifest.
